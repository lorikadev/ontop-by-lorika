import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../const";
import { applyColorCorrections } from "../scripts/globals/apply-color-corrections";

/*
    Here we handle the initial set of the highlight color.
    We search in the localstorage for the key of the active color,
    if not found we set it using default color (orange).
*/
export const loadColorHighlight = () => {
    const html = document.documentElement

    let activeColorKey = localStorage.getItem(
        HIGHLIGHT_COLOR_CSS_VAR_KEY,
    );
    
    if (!activeColorKey) return;

    //set the highlight color using the key
    html.style
        .setProperty(
            HIGHLIGHT_COLOR_CSS_VAR_KEY,
            getComputedStyle(html)
                .getPropertyValue(activeColorKey),
        );

    //corrects the color corrections when using light or dark colors as highlighted color
    applyColorCorrections(activeColorKey);
}