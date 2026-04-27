import type { Object3D } from "three";
import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../../../../const";
import { applyColorToCoverUniform } from "../utils/apply-color-to-cover-uniform";

/**
 * @param cover3DObjRef 
 * @returns function to use inside an eventlistner
 * @summary return the function to fire when the change color event listener fires during the intro
 */
export function getIntroColorChangeEventHandler(cover3DObjRef: Object3D) {
    return () => {
        const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
        if (!colorCssKey) return;

        const html = document.documentElement;
        const colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);

        applyColorToCoverUniform(cover3DObjRef, colorRgb);
    }
}