# gl-renderer

A lightweight webgl renderer.

The underlying Library of [glsl-doodle](https://doodle.webgl.group/).

## Usage

In browser:

```html
<script src="https://unpkg.com/gl-renderer/dist/gl-renderer.js"></script>
```

With NPM:

```bash
npm install gl-renderer
```

## Quick Start

index.frag

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 color;

void main() {
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Demo</title>
  <script src="https://unpkg.com/gl-renderer/dist/gl-renderer.js"></script>
</head>
<body>
  <canvas id="gl-canvas" width="512" height="512"></canvas>
  <script>
  (async function () {
    const glCanvas = document.getElementById('gl-canvas');
    const renderer = new GlRenderer(glCanvas);

    // load fragment shader and createProgram
    const program = await renderer.load('./index.frag');
    renderer.useProgram(program);

    // set color to RED
    renderer.uniforms.color = [1, 0, 0];

    renderer.render();
  }());
  </script>
</body>
</html>
```

You will see a canvas 512 pixels wide and 512 pixels high in red.

## API Reference

### renderer.createProgram(fragment[, vertex])

Create a program with specified fragment shader and vertex shader.

```js
const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

void main() {
  gl_FragColor = vec4(1, 0, 0, 1);
}
`;

const program = renderer.createProgram(fragmentShader);
render.useProgram(program);
```

If you don't specified vertex shader, a default vertex shader will be loaded.

```glsl
attribute vec4 a_vertexPosition;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_vertexPosition;
}
```

or

```glsl
attribute vec4 a_vertexPosition;
attribute vec2 a_vertexTextureCoord;
varying vec2 vTextureCoord;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_vertexPosition;
  vTextureCoord = a_vertexTextureCoord;
}
```

It depends whether you use texture samplers in your fragment shader or not.

### _async_ renderer.compile(fragment[, vertex])

gl-render allows you to use `#pragma include` statment to load and include other shaders.

base.glsl

```glsl
highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
```

```js
const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

#pragma include "./base.glsl"

void main() {
  gl_FragColor = random(gl_FragCoord.xy) * vec4(1, 0, 0, 1);
}
`;

const program = await render.compile(fragmentShader);
renderer.useProgram(program);
```

### _async_ renderer.load(fragmentURL[, vertexURL])

Load fragment shader and vertex shader from url.

```js
const program = await renderer.load('./index.glsl');

renderer.useProgram(program);
```

### renderer.useProgram(program)

Sets the specified Program as part of the current rendering state.

### renderer.createTexture(image)

Wrap a image object (or canvas) to a webgl texture.

```js
function loadImage(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  return new Promise((resolve) => {
    img.onload = function () {
      resolve(img);
    };
    img.src = src;
  });
}

(async function () {
  const glCanvas = document.getElementById('gl-canvas');
  const renderer = new GlRenderer(glCanvas);

  const image = await loadImage('http://path.to.image/image.png');
  const texture = renderer.createTexture(image);

  const program = await renderer.load('./index.frag');
  renderer.useProgram(program);
  // bind texture to samplerMyTex
  renderer.uniforms.samplerMyTex = texture;

  renderer.render();
}());
```

### renderer.loadTexture(src)

Load image from source url and create a texture.

```js
(async function () {
  const glCanvas = document.getElementById('gl-canvas');
  const renderer = new GlRenderer(glCanvas);

  const texture = await renderer.loadTexture('http://path.to.image/image.png');

  const program = await renderer.load('./index.frag');
  renderer.useProgram(program);
  // bind texture to samplerMyTex
  renderer.uniforms.samplerMyTex = texture;

  renderer.render();
}());
```

### renderer.setMeshData(meshData)

Set a list of meshData.

```js
const meshData = [mesh0, mesh1, mesh2...];
```

A mesh object contains the following properties:

- positions : _Required_. The vertex positions of the geometry.
- cells: _Required_. The indices of the vertexes.
- textureCoord: The texture coordinates.
- attributes: The attributes passed into the shaders.
- uniforms: The changed uniform values.

index.vert

```glsl
attribute vec4 a_vertexPosition;
attribute vec3 a_color;

varying vec3 vColor;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_vertexPosition;
  vColor = a_color;
}
```

index.frag

```glsl
#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
```

```js
(async function () {
  const glCanvas = document.getElementById('gl-canvas');
  const renderer = new GlRenderer(glCanvas);

  const program = await renderer.load('./index.frag', './index.vert');
  renderer.useProgram(program);

  const vertexColors = [
    [255, 0, 0],
    [255, 0, 0],
    [255, 255, 0],
  ];

  renderer.setMeshData([
    {
      positions: [[-1.0, -1.0, 0.0], [-1.0, 1.0, 0.0], [1.0, 1.0, 0.0]],
      cells: [[0, 1, 2]],
      attributes: {
        a_color: {data: vertexColors, type: 'UNSIGNED_BYTE', normalize: true},
      },
    },
    {
      positions: [[0.5, 0.5, 0], [-0.5, 0.8, 0], [1, -1, 0]],
      cells: [[0, 1, 2]],
      attributes: {
        a_color: {data: vertexColors, type: 'UNSIGNED_BYTE', normalize: true},
      },
    },
  ]);

  renderer.render();
}());
```

### renderer.render(clearBuffer = true)

Clear and re-draw canvas. If clearBuffer set to true(default is true), renderer will automately clear color buffer before render.

### renderer.uniforms

The uniform declarations in the fragment shader will be automatically bind to renderer.uniforms.

index.frag

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
  gl_FragColor = 0.5 * (1.0 + sin(0.00314 * u_time)) * vec4(1, 0, 0, 1);
}
```

```js
(async function () {
  const glCanvas = document.getElementById('gl-canvas');
  const renderer = new GlRenderer(glCanvas);

  const program = await renderer.load('./index.frag');
  renderer.useProgram(program);

  const startTime = Date.now();

  renderer.uniforms.u_time = 0;

  requestAnimationFrame(function update() {
    renderer.uniforms.u_time = Date.now() - startTime;
    requestAnimationFrame(update);
  });

  renderer.render();
}());
```

### renderer.update()

Cause canvas to clear and re-draw in next frame. Change **uniforms** or set meshData will force renderer update automatically.
