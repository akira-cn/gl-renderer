attribute vec3 a_vertexPosition;
attribute mat3 a_customMartix3;
attribute vec3 a_customVec3;
uniform vec3 u_customUniform;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(a_vertexPosition, 1);
}