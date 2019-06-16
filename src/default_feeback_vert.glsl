attribute vec4 a_vertexPosition;
attribute vec2 a_vertexTextureCoord;
varying vec2 vTextureCoord;

void main() {
  gl_PointSize = 1.0;
  gl_Position = a_vertexPosition;
  vTextureCoord = a_vertexTextureCoord;
}