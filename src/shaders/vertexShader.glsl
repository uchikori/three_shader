uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // modelPosition.x += 0.3;

  float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

  modelPosition.z += elevation;

  // modelPosition.y *= 0.6;
  

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix *vec4(position, 1);

  vUv = uv;
  vElevation = elevation;
}