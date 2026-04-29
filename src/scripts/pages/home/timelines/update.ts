import gsap from "gsap";
import type { Color, Mesh, Object3D } from "three";
import type CustomShaderMaterial from "three-custom-shader-material/vanilla";

/**
 * @param cover3DObjRef ref to the cover 3d object in scene
 * @returns the gsap timeline with the animation
 * @summary this gsap timeline handles the uniform the change the color of the cover when the user request it from the color picker
 */
export function createUpdateTimeline(cover3DObjRef: Object3D) {
    const tlUpdate = gsap.timeline({
        paused: true
    })
    tlUpdate.to(
        { progress: 0 },
        {
            progress: 1,
            duration: 2,
            ease: 'sine.out',
            onUpdate() {
                const t = this.targets()[0].progress;
                cover3DObjRef.traverse(child => {
                    if ((child as any)?.isMesh)
                        ((child as Mesh).material as CustomShaderMaterial).uniforms.u_progress.value = t;
                })
            },
            onComplete() {
                //NOTE - after animation is completed switch target color to current and reset progress to 0 so we are resetted for a new update
                cover3DObjRef.traverse(child => {
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