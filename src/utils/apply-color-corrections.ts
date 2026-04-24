/**
 * 
 * @param cssColorVarKey css color var key that get applied
 * @summary gets all the html elements that uses the setted color as background
 * and switches the text color to dark when the color is light and the opposite when it's dark
 */
export const applyColorCorrections = (cssColorVarKey: string) => {
    //SECTION - ELEMENTS TO CORRECT
    const navCtaShop = document.querySelectorAll('.nav-cta-shop') as NodeListOf<HTMLAnchorElement>;
    const navCtaCartSvg = document.querySelectorAll('.nav-cta-cart>svg') as NodeListOf<SVGAElement>;
    const primaryButtons = [
        ...document.querySelectorAll('button.primary'),
        ...document.querySelectorAll('.button.primary'),
    ] as HTMLElement[];
    const highlightedContainers = document.querySelectorAll('.highlighted-container') as NodeListOf<HTMLElement>;
    //!SECTION - ELEMENTS TO CORRECT

    // handle border (jet black need a border to be seen over dark bg)
    const border = '1px solid rgb(46, 46, 46)';
    const usedBorder = cssColorVarKey === "--jet-black" ? border : '';

    navCtaShop.forEach(ncs => ncs.style.border = usedBorder);
    primaryButtons.forEach(pb => pb.style.border = usedBorder);
    highlightedContainers.forEach(hc => hc.style.border = usedBorder);

    // LIGHT COLORS
    if (
        cssColorVarKey === "--RAL1013" ||
        cssColorVarKey === "--RAL1018" ||
        cssColorVarKey === "--RAL1002"
    ) {
        navCtaShop.forEach(ncs => ncs.style.border = 'var(--dark-text-color)');
        navCtaCartSvg.forEach(nccs => nccs.style.border = 'var(--dark-text-color)');

        primaryButtons.forEach(pb => pb.style.color = 'var(--dark-text-color)');
        highlightedContainers.forEach(hc => hc.style.color = 'var(--dark-text-color)');

    }
    // DARK COLORS
    else {
        navCtaShop.forEach(ncs => ncs.style.border = 'var(--light-text-color)');
        navCtaCartSvg.forEach(nccs => nccs.style.border = 'var(--light-text-color)');

        primaryButtons.forEach(pb => pb.style.color = 'var(--light-text-color)');
        highlightedContainers.forEach(hc => hc.style.color = 'var(--light-text-color)');

        // jet black need border to be seen over dark bg
        if (cssColorVarKey === "--RAL9005") {
            navCtaShop.forEach(ncs => ncs.style.border = border);
            primaryButtons.forEach(pb => pb.style.border = border);
            highlightedContainers.forEach(hc => hc.style.border = border);
        }
    }
}