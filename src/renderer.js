import {setupWebGL, createProgram, pointsToBuffer, loadImage, fetchShader} from './helpers';

import DEFAULT_VERT from './default_vert.glsl';
import DEFAULT_FRAG from './default_frag.glsl';
import DEFAULT_FEEDBACK_VERT from './default_feeback_vert.glsl';

const GLSL_LIBS = {};

function mapTextureCoordinate(positions, size = 3) {
  const texVertexData = [];
  const len = positions.length;
  for(let i = 0; i < len; i++) {
    if(i % size < 2) texVertexData.push(0.5 * (positions[i] + 1));
  }
  return texVertexData;
}

function clearBuffers(gl, program) {
  const buffers = program._buffers;
  Object.values(buffers).forEach((buffer) => {
    gl.deleteBuffer(buffer);
  });
  program._buffers = {};
}

function bindTexture(gl, texture, i) {
  gl.activeTexture(gl.TEXTURE0 + i);
  if(Array.isArray(texture._img)) {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  } else {
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }
  return texture;
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
  sampler1D: 'sampler1D',
  sampler2D: 'sampler2D',
  sampler3D: 'sampler3D',
  samplerCube: 'samplerCube',
  sampler1DShadow: 'sampler1DShadow',
  sampler2DShadow: 'sampler2DShadow',
  sampler2DRect: 'sampler2DRect',
  sampler2DRectShadow: 'sampler2DRectShadow',
};

export default class Renderer {
  static defaultOptions = {
    preserveDrawingBuffer: true,
    autoUpdate: true,
    vertexPosition: 'a_vertexPosition',
    vertexTextureCoord: 'a_vertexTextureCoord',
    webgl2: false,
  }

  static addLibs(libs = {}) {
    Object.assign(GLSL_LIBS, libs);
  }

  static FLOAT(points, buffer) {
    return pointsToBuffer(points, Float32Array, buffer);
  }

  static UNSIGNED_BYTE(points, buffer) {
    return pointsToBuffer(points, Uint8Array, buffer);
  }

  static UNSIGNED_SHORT(points, buffer) {
    return pointsToBuffer(points, Uint16Array, buffer);
  }

  static BYTE(points, buffer) {
    return pointsToBuffer(points, Int8Array, buffer);
  }

  static SHORT(points, buffer) {
    return pointsToBuffer(points, Int16Array, buffer);
  }

  static UBYTE = Renderer.UNSIGNED_BYTE;

  static USHORT = Renderer.UNSIGNED_SHORT;

  static fetchShader = fetchShader;

  static loadImage = loadImage;

  constructor(canvas, opts = {}) {
    this.options = Object.assign({}, Renderer.defaultOptions, opts);

    this.canvas = canvas;

    let gl;
    if(this.options.webgl2) {
      gl = canvas.getContext('webgl2', this.options);
    }
    if(gl == null) {
      gl = setupWebGL(canvas, this.options);
      this.aia_ext = gl.getExtension('ANGLE_instanced_arrays');
    }
    this.gl = gl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.programs = [];
    this._events = {};
  }

  get program() {
    const gl = this.gl;
    return gl.getParameter(gl.CURRENT_PROGRAM);
  }

  // WebGLRenderingContext.uniform[1234][fi][v]()
  // WebGLRenderingContext.uniformMatrix[234]fv()
  _declareUniform(program, name, type = '1f') {
    const gl = this.gl;
    const uniform = gl.getUniformLocation(program, name);
    let value;

    const that = this;
    if(/^sampler/.test(type)) {
      const samplerMap = program._samplerMap;
      const textures = program._bindTextures;
      Object.defineProperty(program.uniforms, name, {
        get() {
          return value;
        },
        set(v) {
          value = v;
          const idx = samplerMap[name] != null ? samplerMap[name] : textures.length;
          textures[idx] = v;
          bindTexture(gl, v, idx);
          if(!samplerMap[name]) {
            samplerMap[name] = idx;
            gl.uniform1i(uniform, idx);
          }
          // gl.bindTexture(gl.TEXTURE_2D, null);
          if(that.options.autoUpdate) that.update();
        },
        configurable: false,
        enumerable: true,
      });
    } else {
      const isMatrix = type.indexOf('Matrix') === 0;
      const isTypeV = !isMatrix && /v$/.test(type);
      const setUniform = gl[`uniform${type}`].bind(gl);
      Object.defineProperty(program.uniforms, name, {
        get() {
          return value;
        },
        set(v) {
          value = v;
          if(typeof v === 'number') {
            v = [v];
          }
          if(isMatrix) setUniform(uniform, false, v);
          else if(isTypeV) setUniform(uniform, v);
          else setUniform(uniform, ...v);
          if(that.options.autoUpdate) that.update();
        },
        configurable: false,
        enumerable: true,
      });
    }
  }

  _draw() {
    const program = this.program;

    program.meshData.forEach((meshData, meshIndex) => {
      const {positions, cells, instanceCount, cellsCount, attributes, uniforms, textureCoord, enableBlend} = meshData;
      const gl = this.gl;
      let mode = meshData.mode || gl.TRIANGLES;
      if(typeof mode === 'string') {
        mode = gl[mode];
      }

      if(enableBlend) gl.enable(gl.BLEND);
      else gl.disable(gl.BLEND);
      gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers.verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      if(cells) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program._buffers.cellsBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW);
      }

      const locations = [];

      if(attributes) {
        Object.values(attributes).forEach(({name, data, divisor}) => {
          gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers[name]);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          if(divisor != null) {
            const location = gl.getAttribLocation(program, name);
            if(location >= 0) {
              gl.enableVertexAttribArray(location);
              locations.push(location);
              if(gl.vertexAttribDivisor) {
                gl.vertexAttribDivisor(location, divisor);
              } else if(this.aia_ext) {
                this.aia_ext.vertexAttribDivisorANGLE(location, divisor);
              }
            }
          }
        });
      }

      if(uniforms) {
        Object.entries(uniforms).forEach(([key, value]) => {
          this.uniforms[key] = value;
        });
      }

      let count;
      if(!cells) {
        const dimension = program._dimension;
        count = positions.length / dimension;
      }

      if(program._enableTextures && program._buffers.texCoordBuffer) {
        const texVertexData = textureCoord || mapTextureCoordinate(positions, program._dimension);
        gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Renderer.FLOAT(texVertexData), gl.STATIC_DRAW);
      }
      if(instanceCount != null) {
        if(cells) {
          if(gl.drawElementsInstanced) {
            gl.drawElementsInstanced(mode, cellsCount, gl.UNSIGNED_SHORT, 0, instanceCount);
          } else if(this.aia_ext) {
            this.aia_ext.drawElementsInstancedANGLE(mode, cellsCount, gl.UNSIGNED_SHORT, 0, instanceCount);
          }
        } else if(gl.drawArraysInstanced) {
          gl.drawArraysInstanced(mode, 0, count, instanceCount);
        } else {
          this.aia_ext.drawArraysInstancedANGLE(mode, 0, count, instanceCount);
        }
        locations.forEach((location) => {
          if(gl.vertexAttribDivisor) {
            gl.vertexAttribDivisor(location, null);
          } else if(this.aia_ext) {
            this.aia_ext.vertexAttribDivisorANGLE(location, null);
          }
        });
      } else if(cells) {
        gl.drawElements(mode, cellsCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(mode, 0, count);
      }
    });
  }

  get isWebGL2() {
    return typeof WebGL2RenderingContext !== 'undefined' && this.gl instanceof WebGL2RenderingContext;
  }

  get enableTextures() {
    return this.program && this.program._enableTextures;
  }

  get uniforms() {
    const program = this.program;
    if(!program || !program.uniforms) {
      throw Error('No avaliable program.');
    }
    return program.uniforms;
  }

  deleteProgram(program) {
    const gl = this.gl;
    if(this.program === program) {
      this.startRender = false;
      if(this._renderFrameID) {
        cancelAnimationFrame(this._renderFrameID);
        delete this._renderFrameID;
      }
      gl.useProgram(null);
    }

    const idx = this.programs.indexOf(program);
    if(idx >= 0) {
      this.programs.splice(idx, 1);
    }

    clearBuffers(gl, program);
    gl.deleteProgram(program);
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

    program.meshData = data.map(({mode, positions, instanceCount, cells, cellsCount, attributes, uniforms, textureCoord, enableBlend}) => {
      const meshData = {
        positions: Renderer.FLOAT(positions),
        uniforms,
        enableBlend: !!enableBlend,
        textureCoord: Renderer.FLOAT(textureCoord),
      };
      if(cells) {
        meshData.cells = Renderer.USHORT(cells);
        meshData.cellsCount = cellsCount || meshData.cells.length;
      }
      if(mode) {
        meshData.mode = mode;
      }
      if(instanceCount != null) {
        if(!this.isWebGL2 && !this.aia_ext) throw new Error('Cannot use instanceCount in this rendering context, use webgl2 context instead.');
        else meshData.instanceCount = instanceCount;
      }
      if(attributes) {
        const copied = {};
        Object.entries(attributes).forEach(([key, value]) => {
          if(!program._attribute[key]) {
            // throw new Error(`Invalid attribute ${key}.`);
            if(__DEV__) console.warn(`Ignored attribute ${key}.`);
            program._attribute[key] = 'ignored';
          } else if(program._attribute[key] !== 'ignored') {
            const {name, type} = program._attribute[key];

            let buffer = value.data || value;
            if(Array.isArray(buffer)) {
              buffer = Renderer[type](buffer);
            }

            copied[key] = {name, data: buffer};
            if(value.divisor != null) {
              if(!this.isWebGL2 && !this.aia_ext) throw new Error('Cannot use divisor in this rendering context, use webgl2 context instead.');
              else copied[key].divisor = value.divisor;
            }
          }
        });
        meshData.attributes = copied;
      }
      return meshData;
    });

    if(this.options.autoUpdate) this.update();
  }

  createProgram(fragmentShader, vertexShader) {
    // this.deleteProgram();
    // this._events = {};

    const enableTextures = /^\s*uniform\s+sampler/mg.test(fragmentShader);
    if(fragmentShader == null) fragmentShader = DEFAULT_FRAG;
    if(vertexShader == null) vertexShader = enableTextures ? DEFAULT_FEEDBACK_VERT : DEFAULT_VERT;

    const gl = this.gl;

    const program = createProgram(gl, vertexShader, fragmentShader);
    program.shaderText = {vertexShader, fragmentShader};
    program._buffers = {};
    program._attribute = {};
    program.uniforms = {};
    program._samplerMap = {};
    program._bindTextures = [];

    // console.log(vertexShader);
    const pattern = new RegExp(`(?:attribute|in) vec(\\d) ${this.options.vertexPosition}`, 'im');
    let matched = vertexShader.match(pattern);
    if(matched) {
      program._dimension = Number(matched[1]);
    }

    const texCoordPattern = new RegExp(`(?:attribute|in) vec(\\d) ${this.options.vertexTextureCoord}`, 'im');
    matched = vertexShader.match(texCoordPattern);
    if(matched) {
      program._texCoordSize = Number(matched[1]);
    }

    const attributePattern = /^\s*(?:attribute|in) (\w+?)(\d*) (\w+)/gim;
    matched = vertexShader.match(attributePattern);
    if(matched) {
      for(let i = 0; i < matched.length; i++) {
        const patt = /^\s*(?:attribute|in) (\w+?)(\d*) (\w+)/im;
        const _matched = matched[i].match(patt);
        if(_matched && _matched[3] !== this.options.vertexPosition
          && _matched[3] !== this.options.vertexTextureCoord) {
          let [, type, size, name] = _matched;

          if(type === 'mat') size **= 2;
          program._buffers[name] = gl.createBuffer();
          program._attribute[name] = {name, type, size: Number(size) || 1};
        }
      }
    }

    const uniformPattern = /^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/mg;
    matched = vertexShader.match(uniformPattern) || [];
    matched = matched.concat(fragmentShader.match(uniformPattern) || []);

    matched.forEach((m) => {
      const _matched = m.match(/^\s*uniform\s+(\w+)\s+(\w+)(\[\d+\])?/);
      let [type, name, isTypeV] = _matched.slice(1);
      type = uniformTypeMap[type];
      isTypeV = !!isTypeV;
      if(type.indexOf('Matrix') !== 0 && isTypeV) {
        type += 'v';
      }
      this._declareUniform(program, name, type);
    });

    program._buffers.verticesBuffer = gl.createBuffer();
    program._buffers.cellsBuffer = gl.createBuffer();
    const vTexCoord = gl.getAttribLocation(program, this.options.vertexTextureCoord);
    program._enableTextures = vTexCoord >= 0;
    if(program._enableTextures) {
      program._buffers.texCoordBuffer = gl.createBuffer();
    }

    this.programs.push(program);

    return program;
  }

  useProgram(program, attrOptions = {}) {
    this.startRender = false;
    if(this._renderFrameID) {
      cancelAnimationFrame(this._renderFrameID);
      delete this._renderFrameID;
    }

    const gl = this.gl;

    gl.useProgram(program);
    // this.program = program;

    const dimension = program._dimension;

    gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers.verticesBuffer);
    const vPosition = gl.getAttribLocation(program, this.options.vertexPosition);
    gl.vertexAttribPointer(vPosition, dimension, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    if(program._enableTextures) {
      gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers.texCoordBuffer);
      const vTexCoord = gl.getAttribLocation(program, this.options.vertexTextureCoord);
      gl.vertexAttribPointer(vTexCoord, program._texCoordSize || 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vTexCoord);
    }

    Object.entries(program._attribute).forEach(([name, item]) => {
      if(item !== 'ignored') {
        const size = item.size;
        const options = attrOptions[name] || {};
        const normalize = !!options.normalize;
        let bufferType = options.type || 'FLOAT';
        const key = options.key || name;

        if(bufferType === 'UBYTE') bufferType = 'UNSIGNED_BYTE';
        if(bufferType === 'USHORT') bufferType = 'UNSIGNED_SHORT';

        item.type = bufferType;

        if(key && key !== name) {
          program._attribute[key] = item;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, program._buffers[name]);
        const attrib = gl.getAttribLocation(program, name);
        // console.log(size, gl[bufferType]);
        if(attrib >= 0) {
          gl.vertexAttribPointer(attrib, size, gl[bufferType], normalize, 0, 0);
          gl.enableVertexAttribArray(attrib);
        }
      }
    });

    if(!program.meshData) {
      const positions = [
        [-1, -1, 0, 1].slice(0, dimension),
        [1, -1, 0, 1].slice(0, dimension),
        [1, 1, 0, 1].slice(0, dimension),
        [-1, 1, 0, 1].slice(0, dimension),
      ];

      const cells = [
        [0, 1, 3],
        [3, 1, 2],
      ];

      this.setMeshData({positions, cells});
    }

    return program;
  }

  compileSync(frag, vert) {
    frag = frag || DEFAULT_FRAG;

    const loaded = {};

    function _compile(content) {
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
              if(type === 'lib') {
                const c = _compile(GLSL_LIBS[name]); // eslint-disable-line no-await-in-loop
                includes.push(c);
              } else if(type === 'link') {
                throw new Error('Cannot load external links synchronously. Use compile instead of compileSync.');
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

    const fragmentShader = _compile(frag);
    const vertexShader = vert ? _compile(vert) : null;
    const program = this.createProgram(fragmentShader, vertexShader);

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
                let c = await Renderer.fetchShader(name); // eslint-disable-line no-await-in-loop
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
    frag = await Renderer.fetchShader(frag);
    if(vert) vert = await Renderer.fetchShader(vert);
    return this.compile(frag, vert);
  }

  createTexture(img = null, {
    wrapS = this.gl.CLAMP_TO_EDGE,
    wrapT = this.gl.CLAMP_TO_EDGE,
    minFilter = this.gl.LINEAR,
    magFilter = this.gl.LINEAR,
  } = {}) {
    const gl = this.gl;
    const target = Array.isArray(img) ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
    this._max_texture_image_units = this._max_texture_image_units
      || gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    gl.activeTexture(gl.TEXTURE0 + this._max_texture_image_units - 1);
    const texture = gl.createTexture();
    gl.bindTexture(target, texture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const {width, height} = this.canvas;
    if(img) {
      if(target === gl.TEXTURE_CUBE_MAP) {
        // For cube maps
        for(let i = 0; i < 6; i++) {
          gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img[i]
          );
        }
      } else {
        gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      }
    } else if(target === gl.TEXTURE_CUBE_MAP) {
      // For cube maps
      for(let i = 0; i < 6; i++) {
        this.gl.texImage2D(
          this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
          0,
          gl.RGBA,
          width,
          height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );
      }
    } else {
      gl.texImage2D(target, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.

    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, magFilter);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, wrapS);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, wrapT);

    if(target === gl.TEXTURE_CUBE_MAP) {
      // gl.texParameteri(target, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
      img.width = img[0].width;
      img.height = img[0].height;
    }
    gl.bindTexture(target, null);

    texture._img = img || {width, height};
    texture.delete = () => {
      this.deleteTexture(texture);
    };
    return texture;
  }

  deleteTexture(texture) {
    const image = texture._img;
    this.gl.deleteTexture(texture);
    if(typeof image.close === 'function') { // release ImageBitmap
      image.close();
    }
  }

  async loadTexture(source, {useImageBitmap = true} = {}) {
    const img = await Renderer.loadImage(source, {useImageBitmap});
    return this.createTexture(img);
  }

  createFBO({color = 1, blend = false, depth = this.options.depth !== false, stencil = !!this.options.stencil} = {}) {
    const gl = this.gl;
    const buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    const textures = [];
    for(let i = 0; i < color; i++) {
      const texture = this.createTexture();
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0 /* level */);
      textures.push(texture);
    }
    buffer.textures = textures;
    buffer.texture = textures[0];
    buffer.blend = blend;

    const {width, height} = this.canvas;

    // Render buffers
    if(depth && !stencil) {
      buffer.depthBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, buffer.depthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, buffer.depthBuffer);
    }

    if(stencil && !depth) {
      buffer.stencilBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, buffer.stencilBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, buffer.stencilBuffer);
    }

    if(depth && stencil) {
      buffer.depthStencilBuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, buffer.depthStencilBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, buffer.depthStencilBuffer);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return buffer;
  }

  bindFBO(fbo = null) {
    this.fbo = fbo;
  }

  render({clearBuffer = true} = {}) {
    this.startRender = true;

    const gl = this.gl;

    let program = this.program;
    if(!program) {
      program = this.createProgram();
      this.useProgram(program);
    }
    if(this.fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    }

    const depth = this.options.depth;

    if(depth) {
      gl.enable(gl.DEPTH_TEST);
    }

    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT
      | (depth ? this.gl.DEPTH_BUFFER_BIT : 0)
      | (this.options.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
    );

    const lastFrameID = this._renderFrameID;
    this._draw();

    if(this.fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    if(this._renderFrameID === lastFrameID) {
      this._renderFrameID = null;
    }
  }

  update() {
    if(!this.startRender) return;
    if(this._renderFrameID == null) {
      this._renderFrameID = requestAnimationFrame(this.render.bind(this));
    }
  }
}
