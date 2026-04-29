import { loadColorHighlight } from "./load-color-highlight";
import { initColorPickers } from "./init-color-picker";
import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../const";

//NOTE  this early setup is made to be sure that all the functions that need to use activeColorKey can find it
//      the if is made to not overwrite the color key if already setted
let activeColorKey = localStorage.getItem(
    HIGHLIGHT_COLOR_CSS_VAR_KEY,
);
if (!activeColorKey) {
    activeColorKey = "--RAL2008";
    //set active key in the localstorage
    localStorage.setItem(HIGHLIGHT_COLOR_CSS_VAR_KEY, "--RAL2008");
}

window.addEventListener("load", () => {
    loadColorHighlight();
    initColorPickers();
});