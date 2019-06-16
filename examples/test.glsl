#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D samplerTest;
uniform float color[3];
varying vec2 vTextureCoord;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
  // gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  // gl_FragColor = texture2D(samplerTest, vTextureCoord);
}