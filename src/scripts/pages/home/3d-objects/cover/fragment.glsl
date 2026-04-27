precision mediump float;

uniform float u_time;
uniform float u_progress;
uniform vec3 u_currentColor;
uniform vec3 u_targetColor;
uniform float u_opacity;

varying vec2 v_uv;
//the pixel in a 0 - 1 scale locally at the object size
varying vec2 v_localPosNormalized;

const float DEG45 = PI * 0.25;

//SECTION - UTILS
/**
* rotate a position by given rads
*/
vec2 rotatePos(vec2 pos, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(pos.x * c - pos.y * s, pos.x * s + pos.y * c);
}
//!SECTION - UTILS

void main() {
    vec2 rotatedPos = rotatePos(v_localPosNormalized, DEG45);

    float mainWave = cos(rotatedPos.y * PI * 2. + 2.) * 0.1;
    float subWave = cos(rotatedPos.y * PI * 10. + 2.) * 0.1;
    float finalWave = 2. * (mainWave * subWave);

    float finalProgress = 
        // move horizontally with time
        u_progress +
        finalWave +
        // create wave by altering horizontal depending on Y position
        (sin(rotatedPos.y * 10. + 10. + u_time * 10.) * 0.01);

    /** NOTE
    * v_localPosNormalized had values from 0 to 1 but after rotation the range changes.
    * so we re-normalize the progress axis
    */
    float progressAxisNormalized = rotatedPos.x * 0.5 + 0.5;
    float colorMixOnProgress = step(progressAxisNormalized, finalProgress);

    float clearTargetSmoothStep = smoothstep(finalProgress - 0.2, finalProgress, progressAxisNormalized);
    vec3 finalTargetColor = mix(u_targetColor, u_targetColor * 3., clearTargetSmoothStep);

    vec3 finalColor = mix(u_currentColor, finalTargetColor, colorMixOnProgress);

    csm_DiffuseColor.rgb = finalColor;
    csm_DiffuseColor.a = u_opacity;
}