import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../../../../const";
import { applyColorToCoverUniform } from "../utils/apply-color-to-cover-uniform";
import type { IHeroEyeglassEntity } from "../entities/hero-eyeglass";

/**
 * @param heroEyeglassEntity 
 * @returns function to use inside an eventlistner
 * @summary return the function to fire when the change color event listener fires outside the intro
 */
export function getInteractiveColorChangeEventHandler(heroEyeglassEntity: IHeroEyeglassEntity) {
    return () => {
        const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
        if (!colorCssKey) return;

        const html = document.documentElement;
        const colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);

        applyColorToCoverUniform(heroEyeglassEntity.directRefs.cover, colorRgb);

        //reset only if the update timeline finished, else just swap the color
        if (heroEyeglassEntity.timelines.update.shouldAnimate === false)
            heroEyeglassEntity.timelines.update.play(true);
    }
}