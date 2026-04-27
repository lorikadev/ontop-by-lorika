import type { Color, Mesh, Object3D, Object3DEventMap } from "three";
import gsap from "gsap";
import type CustomShaderMaterial from "three-custom-shader-material/vanilla";

/**
 * 
 * @param group with the cover object inside
 * @returns intro timeline for hero in index page
 * @summary takes in the group made of eyeglass and cover for 
 * the index page and creates the intro using the ref to the 3d objects
 */
export function createIntroTimeline(group: Object3D<Object3DEventMap>, coverObjRef: Object3D) {
    try {
        const tl = gsap.timeline({
            paused: true
        });
        /** time used for 3d initial animation */

        //FIRST TRANSLATION
        tl.to(group.position, {
            y: 0.25,
            duration: 2,
            ease: 'power2.out'
        }, "first_translation");

        //ROTATE DURING TRANSLATION
        tl.to(group.rotation, {
            x: -Math.PI * 0.15, //29 deg
            duration: 1,
            ease: 'power2.inOut'
        }, "first_translation+=0.8")

        //ANIMATE OPACITY AND COLOR UPDATE ON COVER
        tl.to(
            { progress: 0 },
            {
                progress: 1,
                duration: 3,
                ease: 'sine.inOut',
                onUpdate() {
                    const t = this.targets()[0].progress;
                    coverObjRef!.traverse(child => {
                        if ((child as any)?.isMesh) {
                            ((child as Mesh).material as CustomShaderMaterial).uniforms.u_opacity.value = t;
                            ((child as Mesh).material as CustomShaderMaterial).uniforms.u_progress.value = t;
                        }
                    })
                },
                onComplete() {
                    //after animation is completed switch target color to current and reset progress to 0
                    coverObjRef!.traverse(child => {
                        if ((child as any)?.isMesh) {
                            const meshUniforms = ((child as Mesh).material as CustomShaderMaterial).uniforms;
                            meshUniforms.u_currentColor.value = (meshUniforms.u_targetColor.value as Color).clone();
                            meshUniforms.u_progress.value = 0;
                        }
                    })
                }
            },
            "first_translation+0.1"
        )

        //POST TRANSLATION PULSE ZOOM
        tl.to(group.scale, {
            x: 0.9,
            y: 0.9,
            z: 0.9,
            duration: 0.75,
            yoyo: true,
            // gsap count repetition after first animation, so 3 is 
            // default (first itaration) -> to (rep 1) -> default (rep 2)-> to (rep 3)-> default
            repeat: 1,
            ease: 'sine.inOut'
        }, "first_translation+0.1")
            .add("after_pulse");

        //ROTATE TO PLACE
        tl.to(group.rotation, {
            y: -Math.PI * 0.4, //72 deg
            duration: 1,
            ease: 'power2.inOut'
        }, "after_pulse");
        tl.to(group.rotation, {
            x: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, "after_pulse+=0.2");

        return tl;
    } catch (error) {
        throw error;
    }
}