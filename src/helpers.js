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

function makeFailHTML(msg) {
  return `<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>
    <td align="center">
    <div style="display: table-cell; vertical-align: middle;">
    <div>${msg}</div>
    </div>
    </td></tr></table>`;
}

const GET_A_WEBGL_BROWSER = `This page requires a browser that supports WebGL.<br/>
<a href="http://get.webgl.org">Click here to upgrade your browser.</a>`;

const OTHER_PROBLEM = `It doesn't appear your computer can support WebGL.<br/>
<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>`;

export function setupWebGL(canvas, opt_attribs) {
  function showLink(str) {
    const container = canvas.parentNode;
    if(container) {
      container.innerHTML = makeFailHTML(str);
    }
  }

  if(!window.WebGLRenderingContext) {
    showLink(GET_A_WEBGL_BROWSER);
    return null;
  }

  const context = create3DContext(canvas, opt_attribs);
  if(!context) {
    showLink(OTHER_PROBLEM);
  }
  return context;
}

export function createProgram(gl, vertex, fragment) {
  const vertShdr = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShdr, vertex);
  gl.compileShader(vertShdr);

  if(!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
    const msg = `Vertex shader failed to compile.  The error log is:${gl.getShaderInfoLog(vertShdr)}`;
    console.error(msg);
    return -1;
  }

  const fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShdr, fragment);
  gl.compileShader(fragShdr);

  if(!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
    const msg = `Fragment shader failed to compile.  The error log is:${gl.getShaderInfoLog(fragShdr)}`;
    console.error(msg);
    return -1;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertShdr);
  gl.attachShader(program, fragShdr);
  gl.linkProgram(program);

  if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const msg = `Shader program failed to link.  The error log is:${gl.getProgramInfoLog(program)}`;
    console.error(msg);
    return -1;
  }
  gl.deleteShader(vertShdr);
  gl.deleteShader(fragShdr);
  return program;
}

export function pointsToBuffer(points, Type = Float32Array) {
  if(points == null) return points;
  if(points instanceof Type) return points;
  if(points[0] == null || points[0].length == null) return new Type(points);
  const deminsion = points[0].length;
  const len = points.length;
  const buffer = new Type(deminsion * len);
  let idx = 0;
  for(let i = 0; i < len; i++) {
    for(let j = 0; j < deminsion; j++) {
      buffer[idx++] = points[i][j];
    }
  }
  return buffer;
}

const imageCache = {};
export function loadImage(src) {
  if(!imageCache[src]) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    imageCache[src] = new Promise((resolve) => {
      img.onload = function () {
        imageCache[src] = img;
        resolve(img);
      };
      img.src = src;
    });
  }
  return Promise.resolve(imageCache[src]);
}