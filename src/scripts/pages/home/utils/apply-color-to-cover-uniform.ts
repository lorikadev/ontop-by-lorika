import type { Color, Mesh, Object3D } from "three";
import type CustomShaderMaterial from "three-custom-shader-material/vanilla";

export function applyColorToCoverUniform(cover3DObjRef: Object3D, colorRgb: string) {
    cover3DObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            (((child as Mesh).material as CustomShaderMaterial)
                .uniforms.u_targetColor.value as Color)
                .set(colorRgb);
        }
    });
}