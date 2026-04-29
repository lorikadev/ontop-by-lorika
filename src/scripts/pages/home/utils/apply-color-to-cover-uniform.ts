import type { Color, Mesh, Object3D } from "three";
import type CustomShaderMaterial from "three-custom-shader-material/vanilla";

/**
 * @param cover3DObjRef ref to the cover 3d object in scene, it should have the shader and uniforms attached
 * @param colorRgb rgb of new color
 */
export function applyColorToCoverUniform(cover3DObjRef: Object3D, colorRgb: string) {
    cover3DObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            (((child as Mesh).material as CustomShaderMaterial)
                .uniforms.u_targetColor.value as Color)
                .set(colorRgb);
        }
    });
}