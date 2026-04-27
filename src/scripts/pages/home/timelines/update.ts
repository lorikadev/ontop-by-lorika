import gsap from "gsap";
import type { Color, Mesh, Object3D } from "three";
import type CustomShaderMaterial from "three-custom-shader-material/vanilla";

export function createUpdateTimeline(cover: Object3D) {
    const tlUpdate = gsap.timeline({
        paused: true
    })
    tlUpdate.to(
        { progress: 0 },
        {
            progress: 1,
            duration: 3,
            ease: 'sine.inOut',
            onUpdate() {
                const t = this.targets()[0].progress;
                cover.traverse(child => {
                    if ((child as any)?.isMesh)
                        ((child as Mesh).material as CustomShaderMaterial).uniforms.u_progress.value = t;
                })
            },
            onComplete() {
                //after animation is completed switch target color to current and reset progress to 0
                cover.traverse(child => {
                    if ((child as any)?.isMesh) {
                        const meshUniforms = ((child as Mesh).material as CustomShaderMaterial).uniforms;
                        meshUniforms.u_currentColor.value = (meshUniforms.u_targetColor.value as Color).clone();
                        meshUniforms.u_progress.value = 0;
                    }
                })
            }
        },
    )

    return tlUpdate;
}