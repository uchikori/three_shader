uniform float uWaveLength;
uniform vec2 uFrequency;
uniform float uTime;
uniform float uWaveSpeed;

varying float vElevation;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position,1.0);

  float elevation = sin(modelPosition.x * uFrequency.x + uTime * uWaveSpeed) * uWaveLength
                 *  sin(modelPosition.z * uFrequency.y + uTime * uWaveSpeed) * uWaveLength;

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vElevation = elevation;
}