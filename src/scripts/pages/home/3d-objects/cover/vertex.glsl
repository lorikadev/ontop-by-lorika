uniform vec2 u_size;

varying vec2 v_uv;
//the pixel in a 0 - 1 scale locally at the object size
varying vec2 v_localPosNormalized;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projPosition = projectionMatrix * viewPosition;
    gl_Position = projPosition;

    v_uv = uv;
    
    //calc the position of the pixel in a 0 - 1 scale locally at the object size
    v_localPosNormalized = position.xy / u_size;
    v_localPosNormalized += 0.5;
}