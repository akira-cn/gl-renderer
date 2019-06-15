#ifdef GL_ES
precision mediump float;
#endif

attribute vec4 a_position;
attribute vec2 a_vertexTextureCoord;
varying vec2 vTextureCoord;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_position;
  vTextureCoord = a_vertexTextureCoord;
}