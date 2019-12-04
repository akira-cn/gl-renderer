#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;

void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
}