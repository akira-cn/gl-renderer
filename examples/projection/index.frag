#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 color;

void main() {
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}