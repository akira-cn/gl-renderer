attribute vec3 a_vertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 viewMatrix;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(projectionMatrix * viewMatrix * a_vertexPosition, 1);
}