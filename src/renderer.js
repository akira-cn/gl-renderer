import {setupWebGL, createProgram, pointsToBuffer, loadImage} from './helpers';

import DEFAULT_VERT from './default_vert.glsl';
import DEFAULT_FRAG from './default_frag.glsl';
import DEFAULT_FEEDBACK_VERT from './default_feeback_vert.glsl';

const GLSL_LIBS = {};

const _textures = Symbol('textures');
const _enableTextures = Symbol('enableTextures');
const _samplerMap = Symbol('samplerMap');
const _renderFrameID = Symbol('renderFrameID');
const _events = Symbol('events');
const _uniforms = Symbol('uniforms');
const _buffers = Symbol('buffers');

async function fetchShader(url) {
  const res = await fetch(url);
  if(res.status >= 200 && res.status < 300) {
    const content = await res.text();
    return content;
  }
  return null;
}

function mergeMeshes(data) {
  return data.reduce((a, b) => {
    const offset = a.positions.length;
    return {
      positions: [...a.positions, ...b.positions],
      cells: [...a.cells, ...b.cells.map(c => c.map(i => i + offset))],
    };
  });
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

    this[_samplerMap] = {};

    const gl = setupWebGL(canvas, this.options);
    this.gl = gl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    this.positions = [
      [-1.0, -1.0, 0.0],
      [1.0, -1.0, 0.0],
      [1.0, 1.0, 0.0],
      [-1.0, 1.0, 0.0],
    ];

    this.cells = [
      [0, 1, 3],
      [3, 1, 2],
    ];

    this[_buffers] = {};
  }

  get enableTextures() {
    return !!this[_enableTextures];
  }

  get uniforms() {
    if(!this[_uniforms]) {
      throw Error('Must load shader first.');
    }
    return this[_uniforms];
  }

  clearBuffers() {
    const buffers = this[_buffers];
    Object.values(buffers).forEach((buffer) => {
      this.gl.deleteBuffer(buffer);
    });
    this[_buffers] = {};
  }

  deleteProgram() {
    if(this.program) {
      this.startRender = false;
      if(this[_renderFrameID]) {
        cancelAnimationFrame(this[_renderFrameID]);
        delete this[_renderFrameID];
      }
      this.clearBuffers();
      this.clearTextures();
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  setMeshData(data) {
    if(Array.isArray(data)) {
      data = mergeMeshes(data);
    }
    const {positions, cells} = data;
    const gl = this.gl;
    this.verticesBuffer = this.verticesBuffer || gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(positions), gl.STATIC_DRAW);
    this.cellsBuffer = this.cellsBuffer || gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cellsBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pointsToBuffer(cells, Uint8Array), gl.STATIC_DRAW);
    this.positions = positions;
    this.cells = cells;
    if(this[_enableTextures] && this.texCoordBuffer) {
      this.setTextureCoordinate();
    }
    this.update();
  }

  setTextureCoordinate(texVertexData) {
    const gl = this.gl;
    texVertexData = texVertexData || this.positions.map(v => [0.5 * (v[0] + 1), 0.5 * (v[1] + 1)]);
    // texture coordinate data
    this.texCoordBuffer = this.texCoordBuffer || gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(texVertexData), gl.STATIC_DRAW);
  }

  setAttribute(name, bufferData, normalize = false) {
    const gl = this.gl;
    this[_buffers][name] = this[_buffers][name] || gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this[_buffers][name]);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    const attrib = gl.getAttribLocation(this.program, name);
    let type = gl.FLOAT;
    if(bufferData instanceof Uint8Array) {
      type = gl.UNSIGNED_BYTE;
    } else if(bufferData instanceof Uint16Array) {
      type = gl.UNSIGNED_SHORT;
    } else if(bufferData instanceof Int8Array) {
      type = gl.BYTE;
    } else if(bufferData instanceof Int16Array) {
      type = gl.SHORT;
    }
    gl.vertexAttribPointer(attrib, 3, type, normalize, 0, 0);
    gl.enableVertexAttribArray(attrib);
    this.update();
  }

  setProgram(fragmentShader, vertexShader) {
    this.deleteProgram();

    this[_uniforms] = {};
    this[_events] = {};

    this[_enableTextures] = /^\s*uniform\s+sampler2D/mg.test(fragmentShader);
    if(fragmentShader == null) fragmentShader = DEFAULT_FRAG;
    if(vertexShader == null) vertexShader = this[_enableTextures] ? DEFAULT_FEEDBACK_VERT : DEFAULT_VERT;

    this.fragmentShader = fragmentShader;
    this.vertexShader = vertexShader;

    const gl = this.gl;

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    this.program = program;

    this.setMeshData({positions: this.positions, cells: this.cells});

    const vPosition = gl.getAttribLocation(program, this.options.vertexPosition);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    if(this[_enableTextures]) {
      this.setTextureCoordinate();
      const vTexCoord = gl.getAttribLocation(this.program, this.options.vertexTextureCoord);
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vTexCoord);
    }

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
      this.declareUniform(name, type);
    });

    this.program = program;
    return program;
  }

  async compile(frag, vert) {
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
    const program = this.setProgram(fragmentShader, vertexShader);

    return program;
  }

  async load(frag, vert = null) {
    frag = await fetchShader(frag) || DEFAULT_FRAG;
    if(vert) vert = await fetchShader(vert);
    return this.compile(frag, vert);
  }

  clearTextures() {
    const gl = this.gl;
    if(this[_textures]) {
      this[_textures].forEach((texture) => {
        gl.deleteTexture(texture);
      });
      this[_textures] = null;
    }
    this[_samplerMap] = {};
  }

  bindTextures(sources) {
    return sources.map(this.bindTexture.bind(this));
  }

  bindTexture(source, i) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + i);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
  }

  loadTexture(source) {
    return loadImage(source);
  }

  loadTextures(...sources) {
    return Promise.all(sources.map(loadImage));
  }

  // WebGLRenderingContext.uniform[1234][fi][v]()
  // WebGLRenderingContext.uniformMatrix[234]fv()
  declareUniform(name, type = '1f') {
    const gl = this.gl;
    const uniform = gl.getUniformLocation(this.program, name);
    let value;
    type = type.replace(/^m/, 'Matrix');

    const isTypeV = /v$/.test(type);
    const that = this;
    if(type === 'sampler2D') {
      const samplerID = this[_samplerMap][name];
      const textures = this[_textures] || [];
      Object.defineProperty(this[_uniforms], name, {
        get() {
          return value;
        },
        set(v) {
          value = v;
          const idx = samplerID || textures.length;
          textures[idx] = v;
          that.bindTexture(v, idx);
          if(samplerID == null) that[_samplerMap][name] = idx;
          that.update();
        },
        configurable: false,
        enumerable: true,
      });
    } else {
      Object.defineProperty(this[_uniforms], name, {
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
    if(!this[_events]) {
      throw new Error('Must load shader first.');
    }
    this[_events][type] = this[_events][type] || [];
    this[_events][type].push(handler);
  }

  once(type, handler) {
    this.on(type, function f(...args) {
      this.off(type, f);
      return handler.apply(this, args);
    });
    return this;
  }

  off(type, handler) {
    if(!this[_events]) {
      throw new Error('Must load shader first.');
    }
    if(handler && this[_events][type]) {
      const idx = this[_events][type].indexOf(handler);

      if(idx >= 0) {
        this[_events][type].splice(idx, 1);
      }
    } else {
      delete this[_events][type];
    }
  }

  trigger(type, eventArgs = {}) {
    if(!this[_events]) {
      throw new Error('Must load shader first.');
    }
    const handlers = this[_events][type] || [];
    handlers.forEach((handler) => {
      handler.call(this, Object.assign({target: this, type}, eventArgs));
    });
  }

  render() {
    this.startRender = true;
    this.trigger('beforeRender');
    const gl = this.gl;
    if(!this.program) this.setProgram();
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, this.cells.length * 3, gl.UNSIGNED_BYTE, 0);
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
