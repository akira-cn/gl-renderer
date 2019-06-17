import {setupWebGL, createProgram, pointsToBuffer, loadImage} from './helpers';

import DEFAULT_VERT from './default_vert.glsl';
import DEFAULT_FRAG from './default_frag.glsl';
import DEFAULT_FEEDBACK_VERT from './default_feeback_vert.glsl';

const GLSL_LIBS = {};

const _enableTextures = Symbol('enableTextures');
const _renderFrameID = Symbol('renderFrameID');

const shaderCache = {};
async function fetchShader(url) {
  if(shaderCache[url]) return shaderCache[url];
  const res = await fetch(url);
  if(res.status >= 200 && res.status < 300) {
    const content = await res.text();
    shaderCache[url] = content;
    return content;
  }
  return null;
}

const uniformTypeMap = {
  int: '1i',
  ivec2: '2i',
  ivec3: '3i',
  ivec4: '4i',
  float: '1f',
  vec2: '2f',
  vec3: '3f',
  vec4: '4f',
  mat2: 'Matrix2fv',
  mat3: 'Matrix3fv',
  mat4: 'Matrix4fv',
  sampler2D: 'sampler2D',
};

export default class Renderer {
  static defaultOptions = {
    preserveDrawingBuffer: true,
    vertexPosition: 'a_vertexPosition',
    vertexTextureCoord: 'a_vertexTextureCoord',
  }

  static addLibs(libs = {}) {
    Object.assign(GLSL_LIBS, libs);
  }

  static FLOAT(points) {
    return pointsToBuffer(points);
  }

  static UNSIGNED_BYTE(points) {
    return pointsToBuffer(points, Uint8Array);
  }

  static UNSIGNED_SHORT(points) {
    return pointsToBuffer(points, Uint16Array);
  }

  static BYTE(points) {
    return pointsToBuffer(points, Int8Array);
  }

  static SHORT(points) {
    return pointsToBuffer(points, Int16Array);
  }

  static UBYTE = Renderer.UNSIGNED_BYTE;

  static USHORT = Renderer.UNSIGNED_SHORT;

  static fetchShader = fetchShader;

  constructor(canvas, opts = {}) {
    this.options = Object.assign({}, Renderer.defaultOptions, opts);

    this.canvas = canvas;

    const gl = setupWebGL(canvas, this.options);
    this.gl = gl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    this.textures = [];
    this.programs = [];
    this._events = {};
  }

  get enableTextures() {
    return !!this[_enableTextures];
  }

  get uniforms() {
    const program = this.program;
    if(!program || !program.uniforms) {
      throw Error('No avaliable program.');
    }
    return program.uniforms;
  }

  clearBuffers(program) {
    const buffers = program._buffers;
    Object.values(buffers).forEach((buffer) => {
      this.gl.deleteBuffer(buffer);
    });
    program._buffers = {};
  }

  deleteProgram(program) {
    if(this.program === program) {
      this.startRender = false;
      if(this[_renderFrameID]) {
        cancelAnimationFrame(this[_renderFrameID]);
        delete this[_renderFrameID];
      }
      this.gl.useProgram(null);
    }

    const idx = this.programs.indexOf(program);
    if(idx >= 0) {
      this.programs.splice(idx, 1);
    }

    this.clearBuffers(program);
    this.gl.deleteProgram(program);
  }

  clearTextures() {
    const gl = this.gl;
    this.textures.forEach((texture) => {
      gl.deleteTexture(texture);
    });
    this.textures = [];
  }

  deleteTexture(texture) {
    const textures = this.textures;
    const idx = textures.indexOf(texture);
    if(idx >= 0) {
      textures.splice(idx, 1);
      this.gl.deleteTexture(texture);
    }
    return texture;
  }

  /**
    [{
      positions: ...
      cells: ...
      textureCoord: ...
      attributes: {name: {data:..., normalize: true}},
      uniforms: ...
    }]
   */
  setMeshData(data) {
    if(!Array.isArray(data)) {
      data = [data];
    }

    const program = this.program;

    program.meshData = data.map(({positions, cells, attributes, uniforms, textureCoord}) => {
      const meshData = {
        positions: Renderer.FLOAT(positions),
        cells: Renderer.USHORT(cells),
        uniforms,
        textureCoord: Renderer.FLOAT(textureCoord),
      };
      if(attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          let buffer,
            size,
            type = 'FLOAT',
            normalize = false;
          if(value.data) {
            buffer = value.data;
            normalize = !!value.normalize;
            type = value.type || 'FLOAT';
            size = value.size;
          } else {
            buffer = value;
          }
          if(size == null) size = buffer[0].length || 1;
          if(type === 'UBYTE') type = 'UNSIGNED_BYTE';
          if(type === 'USHORT') type = 'UNSIGNED_SHORT';
          if(Array.isArray(buffer)) {
            buffer = Renderer[type](buffer);
          }
          attributes[key] = {data: buffer, type, size, normalize};
        });
        meshData.attributes = attributes;
      }
      return meshData;
    });

    this.update();
  }

  draw() {
    const program = this.program;

    program.meshData.forEach((meshData, meshIndex) => {
      this.trigger('beforedraw', {meshData, meshIndex});
      const {positions, cells, attributes, uniforms, textureCoord} = meshData;

      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, program.verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.cellsBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);

      if(attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          this.setAttribute(key, value.data, value.type, value.size, value.normalize);
        });
      }

      if(uniforms) {
        Object.entries(uniforms).forEach(([key, value]) => {
          this.uniforms[key] = value;
        });
      }

      if(this[_enableTextures] && program.texCoordBuffer) {
        const texVertexData = textureCoord || this.mapTextureCoordinate(positions);
        this.setTextureCoordinate(texVertexData);
      }
      gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0);
      this.trigger('afterdraw', {meshData, meshIndex});
    });
  }

  mapTextureCoordinate(positions) {
    const texVertexData = [];
    const len = positions.length;
    for(let i = 0; i < len; i++) {
      if(i % 3 !== 2) texVertexData.push(0.5 * (positions[i] + 1));
    }
    return texVertexData;
  }

  setTextureCoordinate(texVertexData) {
    const gl = this.gl;
    const program = this.program;
    gl.bindBuffer(gl.ARRAY_BUFFER, program.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Renderer.FLOAT(texVertexData), gl.STATIC_DRAW);
  }

  setAttribute(name, data, type, size, normalize = false) {
    const gl = this.gl;
    const program = this.program;
    program._buffers[name] = program._buffers[name] || gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers[name]);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const attrib = gl.getAttribLocation(program, name);
    gl.vertexAttribPointer(attrib, size, gl[type], normalize, 0, 0);
    gl.enableVertexAttribArray(attrib);
  }

  createProgram(fragmentShader, vertexShader) {
    // this.deleteProgram();
    // this._events = {};

    this[_enableTextures] = /^\s*uniform\s+sampler2D/mg.test(fragmentShader);
    if(fragmentShader == null) fragmentShader = DEFAULT_FRAG;
    if(vertexShader == null) vertexShader = this[_enableTextures] ? DEFAULT_FEEDBACK_VERT : DEFAULT_VERT;

    const gl = this.gl;

    const program = createProgram(gl, vertexShader, fragmentShader);
    program.shaderText = {vertexShader, fragmentShader};
    program._buffers = {};
    program.uniforms = {};
    program._samplerMap = {};
    program._bindTextures = [];
    const uniformPattern = /^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/mg;
    let matched = vertexShader.match(uniformPattern) || [];
    matched = matched.concat(fragmentShader.match(uniformPattern) || []);

    matched.forEach((m) => {
      const _matched = m.match(/^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/);
      let [type, name, isTypeV] = _matched.slice(1);
      type = uniformTypeMap[type];
      isTypeV = !!isTypeV;
      if(type.indexOf('Matrix') !== 0 && isTypeV) {
        type += 'v';
      }
      this.declareUniform(program, name, type);
    });

    program.verticesBuffer = gl.createBuffer();
    program.cellsBuffer = gl.createBuffer();

    this.programs.push(program);

    return program;
  }

  useProgram(program) {
    this.startRender = false;
    if(this[_renderFrameID]) {
      cancelAnimationFrame(this[_renderFrameID]);
      delete this[_renderFrameID];
    }

    const gl = this.gl;

    gl.useProgram(program);
    this.program = program;

    gl.bindBuffer(gl.ARRAY_BUFFER, program.verticesBuffer);
    const vPosition = gl.getAttribLocation(program, this.options.vertexPosition);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    if(this[_enableTextures]) {
      program.texCoordBuffer = program.texCoordBuffer || gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, program.texCoordBuffer);
      const vTexCoord = gl.getAttribLocation(program, this.options.vertexTextureCoord);
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vTexCoord);
    }

    if(!program.meshData) {
      const positions = [
        [-1.0, -1.0, 0.0],
        [1.0, -1.0, 0.0],
        [1.0, 1.0, 0.0],
        [-1.0, 1.0, 0.0],
      ];

      const cells = [
        [0, 1, 3],
        [3, 1, 2],
      ];

      this.setMeshData({positions, cells});
    }

    return program;
  }

  async compile(frag, vert) {
    frag = frag || DEFAULT_FRAG;

    const loaded = {};

    async function _compile(content) {
      content = content.replace(/^\s*/mg, '');

      const includes = [];

      const matched = content.match(/^#pragma\s+include\s+.*/mg);
      if(matched) {
        // console.log(matched, url);
        for(let i = 0; i < matched.length; i++) {
          const m = matched[i];
          const _matched = m.match(/(?:<|")(.*)(?:>|")/);
          if(_matched) {
            const type = _matched[0].indexOf('<') === 0 ? 'lib' : 'link';
            let name = _matched[1];
            if(name === 'graph') name = 'graphics';
            if(!loaded[name]) {
              loaded[name] = true;
              // TODO: 这里可以优化成异步加载
              if(type === 'lib') {
                const c = await _compile(GLSL_LIBS[name]); // eslint-disable-line no-await-in-loop
                includes.push(c);
              } else if(type === 'link') {
                let c = await fetchShader(name); // eslint-disable-line no-await-in-loop
                c = await _compile(c); // eslint-disable-line no-await-in-loop
                includes.push(c);
              }
            } else {
              includes.push(`/* included ${name} */`);
            }
          }
        }

        includes.forEach((inc) => {
          content = content.replace(/^#pragma\s+include\s+.*/m, inc);
        });
      }

      return content;
    }

    const fragmentShader = await _compile(frag);
    const vertexShader = vert ? await _compile(vert) : null;
    const program = this.createProgram(fragmentShader, vertexShader);

    return program;
  }

  async load(frag, vert = null) {
    frag = await fetchShader(frag);
    if(vert) vert = await fetchShader(vert);
    return this.compile(frag, vert);
  }

  bindTextures(textures) {
    return textures.map(this.bindTexture.bind(this));
  }

  bindTexture(texture, i) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    return texture;
  }

  loadTextures(...sources) {
    return Promise.all(sources.map(loadImage));
  }

  async loadTexture(source) {
    const img = await loadImage(source);
    const texture = this.createTexture(img);
    this.textures.push(texture);
    return texture;
  }

  createTexture(img) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE31);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  // WebGLRenderingContext.uniform[1234][fi][v]()
  // WebGLRenderingContext.uniformMatrix[234]fv()
  declareUniform(program, name, type = '1f') {
    const gl = this.gl;
    const uniform = gl.getUniformLocation(program, name);
    let value;
    type = type.replace(/^m/, 'Matrix');

    const isTypeV = /v$/.test(type);
    const that = this;
    if(type === 'sampler2D') {
      const samplerMap = program._samplerMap;
      const textures = program._bindTextures;
      Object.defineProperty(program.uniforms, name, {
        get() {
          return value;
        },
        set(v) {
          value = v;
          const idx = samplerMap[name] || textures.length;
          textures[idx] = v;
          that.bindTexture(v, idx);
          if(!samplerMap[name]) {
            samplerMap[name] = idx;
            gl.uniform1i(uniform, idx);
          }
          that.update();
        },
        configurable: false,
        enumerable: true,
      });
    } else {
      Object.defineProperty(program.uniforms, name, {
        get() {
          return value;
        },
        set(v) {
          value = v;
          if(!Array.isArray(v)) {
            v = [v];
          }
          if(isTypeV) gl[`uniform${type}`](uniform, v);
          else gl[`uniform${type}`](uniform, ...v);
          that.update();
        },
        configurable: false,
        enumerable: true,
      });
    }
  }

  on(type, handler) {
    this._events[type] = this._events[type] || [];
    this._events[type].push(handler);
  }

  once(type, handler) {
    this.on(type, function f(...args) {
      this.off(type, f);
      return handler.apply(this, args);
    });
    return this;
  }

  off(type, handler) {
    if(handler && this._events[type]) {
      const idx = this._events[type].indexOf(handler);

      if(idx >= 0) {
        this._events[type].splice(idx, 1);
      }
    } else {
      delete this._events[type];
    }
  }

  trigger(type, eventArgs = {}) {
    const handlers = this._events[type] || [];
    handlers.forEach((handler) => {
      handler.call(this, Object.assign({target: this, type}, eventArgs));
    });
  }

  render() {
    this.startRender = true;
    this.trigger('beforeRender');
    const gl = this.gl;
    let program = this.program;
    if(!program) {
      program = this.createProgram();
      this.useProgram(program);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    this.draw();

    this[_renderFrameID] = null;
    this.trigger('rendered');
  }

  update() {
    if(!this.startRender) return;
    if(this[_renderFrameID] == null) {
      this[_renderFrameID] = requestAnimationFrame(this.render.bind(this));
    }
  }
}
