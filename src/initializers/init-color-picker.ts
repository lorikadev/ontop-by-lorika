import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../const";
import { applyColorCorrections } from "../utils/apply-color-corrections";

/* event used to update complex data that rely on highlight color */
const changedHighlightColorEvent = new Event("changedHighlightColor");

/* 
    At this point, in the localstorage, a var should be setted with name "--highlight-color".
    This var contains the active color var key and when we select one color-label
    we should change the --highlight-color var both in the local storage AND in the css to spread
    the new color over the website

    Currently the var is setted in loadColorHighlight, a script that run before this one.
*/
//click event callback used with color label click event in initColorPickers
const setNewHighlightColor = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;

    //it should not happen...
    if (!target) {
        console.error('setNewHighlightColor - NO TARGET FOUND')
        return;
    }

    //get color css var key from data set
    const targetCssVarKey = target.dataset.colorCssVarKey;
    //it should not happen...
    if (!targetCssVarKey) {
        console.error('setNewHighlightColor - NO data-color-css-var-key FOUND')
        return;
    }

    const html = document.documentElement;
    //apply new highlight color
    html.style
        .setProperty(
            HIGHLIGHT_COLOR_CSS_VAR_KEY,
            getComputedStyle(html)
                .getPropertyValue(targetCssVarKey),
        );

    //save into storage
    localStorage.setItem(HIGHLIGHT_COLOR_CSS_VAR_KEY, targetCssVarKey);

    //dispatch event
    document.dispatchEvent(changedHighlightColorEvent);

    //remove class active from previous actives and apply it to the correct ones
    const colorLabels = document.querySelectorAll('.color-label') as NodeListOf<HTMLElement>;
    colorLabels.forEach(colorLabel => {
        if (colorLabel.dataset.colorCssVarKey !== targetCssVarKey)
            colorLabel.classList.remove('active')
        else
            colorLabel.classList.add('active');
    })

    //corrects the color corrections when using light or dark colors as highlighted color
    applyColorCorrections(targetCssVarKey);
}

/** this function load the initial state and click listeners of all color pickers */
export const initColorPickers = () => {
    const activeColorKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);

    const colorLabels = document.querySelectorAll('.color-label') as NodeListOf<HTMLElement>;
    colorLabels.forEach(colorLabel => {
        //APPLY ACTIVE CLASS IN INITIAL SETUP
        if (colorLabel.dataset.colorCssVarKey === activeColorKey)
            colorLabel.classList.add('active')

        //apply callback to set new active color
        colorLabel.addEventListener('click', (e => { setNewHighlightColor(e) }));
    })
}
