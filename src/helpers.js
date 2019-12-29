function create3DContext(canvas, opt_attribs) {
  const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
  let context = null;
  for(let ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch (e) {
      // no-empty
    }
    if(context) {
      break;
    }
  }
  return context;
}

export function setupWebGL(canvas, opt_attribs) {
  const context = create3DContext(canvas, opt_attribs);
  if(!context) {
    throw new Error("Sorry, your browser doesn't support WebGL.");
  }
  return context;
}

export function createProgram(gl, vertex, fragment) {
  const vertShdr = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShdr, vertex);
  gl.compileShader(vertShdr);

  if(!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
    const msg = `Vertex shader failed to compile.  The error log is:${gl.getShaderInfoLog(vertShdr)}`;
    throw new Error(msg);
  }

  const fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShdr, fragment);
  gl.compileShader(fragShdr);

  if(!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
    const msg = `Fragment shader failed to compile.  The error log is:${gl.getShaderInfoLog(fragShdr)}`;
    throw new Error(msg);
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const msg = `Shader program failed to link.  The error log is:${gl.getProgramInfoLog(program)}`;
    throw new Error(msg);
  }
  gl.deleteShader(vertShdr);
  gl.deleteShader(fragShdr);
  return program;
}

export function pointsToBuffer(points, Type = Float32Array, buffer = null) {
  if(buffer && !(buffer instanceof Type)) throw new TypeError('Wrong buffer type.');
  if(points == null) return points;
  if(points instanceof Type) return points;
  if(points[0] == null || points[0].length == null) {
    if(buffer) {
      buffer.set(points, 0);
      return buffer;
    }
    return new Type(points);
  }
  const deminsion = points[0].length;
  const len = points.length;
  if(!buffer) {
    buffer = new Type(deminsion * len);
  }
  let idx = 0;
  for(let i = 0; i < len; i++) {
    for(let j = 0; j < deminsion; j++) {
      buffer[idx++] = points[i][j];
    }
  }
  return buffer;
}

const imageCache = {};
export function loadImage(src, {useImageBitmap = true, alias = null} = {}) {
  if(!imageCache[src]) {
    if(typeof Image === 'function') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      imageCache[src] = new Promise((resolve) => {
        img.onload = function () {
          if(useImageBitmap && typeof createImageBitmap === 'function') {
            createImageBitmap(img, {imageOrientation: 'flipY'}).then((bitmap) => {
              imageCache[src] = bitmap;
              if(alias) imageCache[alias] = bitmap;
              resolve(bitmap);
            });
          } else {
            imageCache[src] = img;
            if(alias) imageCache[alias] = img;
            resolve(img);
          }
        };
        img.src = src;
      });
      if(alias) imageCache[alias] = imageCache[src];
    } else if(typeof fetch === 'function') {
      // run in worker
      return fetch(src, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
      })
        .then((response) => {
          return response.blob();
        })
        .then((blob) => {
          return createImageBitmap(blob, {imageOrientation: 'flipY'}).then((bitmap) => {
            imageCache[src] = bitmap;
            if(alias) imageCache[alias] = bitmap;
            return bitmap;
          });
        });
    }
  }
  return imageCache[src];
}

const shaderCache = {};
export async function fetchShader(url) {
  if(shaderCache[url]) return shaderCache[url];
  const res = await fetch(url);
  if(res.status >= 200 && res.status < 300) {
    const content = await res.text();
    shaderCache[url] = content;
    return content;
  }
  throw new Error('Shader loaded error.');
}