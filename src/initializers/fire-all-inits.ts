import { loadColorHighlight } from "./load-color-highlight";
import { initColorPickers } from "./init-color-picker";

window.addEventListener("load", () => {
    loadColorHighlight();
    initColorPickers();
});