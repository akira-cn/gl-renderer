#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 a_position;
attribute vec2 a_vertexTextureCoord;

attribute vec3 a_color;

varying mediump vec2 vTextureCoord;
varying vec3 vColor;

void main() {
  gl_PointSize = 1.0;
  gl_Position.x = a_position.x;
  gl_Position.y = a_position.y;
  gl_Position.z = 1.0;
  gl_Position.w = 1.0;

  vTextureCoord = a_vertexTextureCoord;
  vColor = a_color;
}