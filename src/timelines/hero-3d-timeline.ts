import type { Object3D } from "three";
import gsap from "gsap";

export function createHero3dTimeline(object: Object3D) {
    const tl = gsap.timeline({
        paused: true
    });
    /** time used for 3d initial animation */

    //FIRST TRANSLATION
    tl.to(object.position, {
        y: 0,
        duration: 2,
        ease: 'power2.out'
    }, "first_translation");

    //ROTATE DURING TRANSLATION
    tl.to(object.rotation, {
        x: -Math.PI * 0.15, //29 deg
        duration: 1,
        ease: 'power2.inOut'
    }, "first_translation+=0.8")

    //POST TRANSLATION PULSE ZOOM
    tl.to(object.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 0.75,
        yoyo: true,
        // gsap count repetition after first animation, so 3 is 
        // default (first itaration) -> to (rep 1) -> default (rep 2)-> to (rep 3)-> default
        repeat: 3,
        ease: 'sine.inOut'
    }, "first_translation+0.1")
        .add("after_pulse");

    //ROTATE TO PLACE
    tl.to(object.rotation, {
        y: -Math.PI * 0.4, //72 deg
        duration: 1,
        ease: 'power2.inOut'
    }, "after_pulse");
    tl.to(object.rotation, {
        x: 0,
        duration: 0.8,
        ease: 'power2.inOut'
    }, "after_pulse+=0.2");

    return tl;
}