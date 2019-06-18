#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
  gl_FragColor = 0.5 * (1.0 + sin(0.00314 * u_time)) * vec4(1, 0, 0, 1);
}