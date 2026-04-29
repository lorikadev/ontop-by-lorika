precision mediump float;

uniform float u_time;
uniform float u_progress;
uniform vec3 u_currentColor;
uniform vec3 u_targetColor;
uniform float u_opacity;

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
    //rotate normalized horizontal position of the mesh to make animation diagonal
    vec2 rotatedPos = rotatePos(v_localPosNormalized, DEG45);

    //calculates "wave" seen in animation and multiply them to make them irregular
    float mainWave = cos(rotatedPos.y * PI * 2. + 2.) * 0.1;
    float subWave = cos(rotatedPos.y * PI * 10. + 2.) * 0.1;
    float finalWave = 2. * (mainWave * subWave);

    float finalProgress = 
        // move horizontally with time
        u_progress +
        //alter the wave line
        finalWave +
        // alter the wave along the y axis
        (sin(rotatedPos.y * 10. + 10. + u_time * 10.) * 0.01);

    /** NOTE
    * v_localPosNormalized had values from 0 to 1 but after rotation the range changes.
    * so we re-normalize the progress axis
    */
    float progressAxisNormalized = rotatedPos.x * 0.5 + 0.5;
    float colorMixOnProgress = step(progressAxisNormalized, finalProgress);

    //calculate a sub progres to make a gradient of the new color (0.2 means that a 0.5 progress, or 50%, the gradient will go from 0.3 to 0.5)
    float clearTargetSmoothStep = smoothstep(finalProgress - 0.2, finalProgress, progressAxisNormalized);
    vec3 finalTargetColor = mix(u_targetColor, u_targetColor * 3., clearTargetSmoothStep);

    vec3 finalColor = mix(u_currentColor, finalTargetColor, colorMixOnProgress);

    csm_DiffuseColor.rgb = finalColor;
    csm_DiffuseColor.a = u_opacity;
}