/**
 * 
 * @param cssColorVarKey css color var key that get applied
 * @summary gets all the html elements that uses the setted color as background
 * and switches the text color to dark when the color is light and the opposite when it's dark
 */
export const applyColorCorrections = (cssColorVarKey: string) => {
    //SECTION - ELEMENTS TO CORRECT
    const navCtaShop = document.getElementById('nav-cta-shop') as HTMLAnchorElement;
    const navCtaCartSvg = document.querySelector('#nav-cta-cart>svg') as SVGAElement;
    const primaryButtons = [
        ...document.querySelectorAll('button.primary'),
        ...document.querySelectorAll('.button.primary'),
    ] as HTMLElement[];
    const highlightedContainers = document.querySelectorAll('.highlighted-container') as NodeListOf<HTMLElement>;
    //!SECTION - ELEMENTS TO CORRECT

    // handle border (jet black need a border to be seen over dark bg)
    const border = '1px solid rgb(46, 46, 46)';
    const usedBorder = cssColorVarKey === "--jet-black" ? border : '';

    navCtaShop.style.border = usedBorder;
    primaryButtons.forEach(pb => pb.style.border = usedBorder);
    highlightedContainers.forEach(hc => hc.style.border = usedBorder);

    // LIGHT COLORS
    if (
        cssColorVarKey === "--pearl-white" ||
        cssColorVarKey === "--zinc-yellow" ||
        cssColorVarKey === "--sand-yellow" ||
        cssColorVarKey === "--pearl-light-grey"
    ) {
        navCtaShop.style.color = 'var(--dark-text-color)';
        navCtaCartSvg.style.fill = 'var(--dark-text-color)';

        primaryButtons.forEach(pb => pb.style.color = 'var(--dark-text-color)');
        highlightedContainers.forEach(hc => hc.style.color = 'var(--dark-text-color)');

    }
    // DARK COLORS
    else {
        navCtaShop.style.color = 'var(--light-text-color)';
        navCtaCartSvg.style.fill = 'var(--light-text-color)';

        primaryButtons.forEach(pb => pb.style.color = 'var(--light-text-color)');
        highlightedContainers.forEach(hc => hc.style.color = 'var(--light-text-color)');

        // jet black need border to be seen over dark bg
        if (cssColorVarKey === "--jet-black") {
            navCtaShop.style.border = border;
            primaryButtons.forEach(pb => pb.style.border = border);
            highlightedContainers.forEach(hc => hc.style.border = border);
        }
    }
}