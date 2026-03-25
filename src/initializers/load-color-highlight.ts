/*
    Here we handle the initial set of the highlight color.
    We search in the localstorage for the key of the active color,
    if not found we set it using default color (orange).
*/
export const loadColorHighlight = () => {
    const HIGHLIGHT_COLOR_CSS_VAR_KEY = "--highlight-color";
    const html = document.documentElement

    let activeColorKey = localStorage.getItem(
        HIGHLIGHT_COLOR_CSS_VAR_KEY,
    );
    if (!activeColorKey) {
        activeColorKey = "--orange";
        //set active key in the localstorage
        localStorage.setItem(HIGHLIGHT_COLOR_CSS_VAR_KEY, "--orange");
    }

    //set the highlight color using the key
    html.style
        .setProperty(
            HIGHLIGHT_COLOR_CSS_VAR_KEY,
            getComputedStyle(html)
                .getPropertyValue(activeColorKey),
        );

    //check for light colors to change text colors in navbar
    const navCtaShop = document.getElementById('nav-cta-shop') as HTMLAnchorElement;
    const navCtaCartSvg = document.querySelector('#nav-cta-cart>svg') as SVGAElement;

    switch (activeColorKey) {
        case "--yellow":
        case "--ivory":
            navCtaShop.style.color = 'var(--dark-text-color)';
            navCtaCartSvg.style.fill = 'var(--dark-text-color)';
            break;
        default:
            navCtaShop.style.color = 'var(--light-text-color)';
            navCtaCartSvg.style.fill = 'var(--light-text-color)';
            break;
    }
}