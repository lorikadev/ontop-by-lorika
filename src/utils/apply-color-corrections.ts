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
    ] as HTMLElement[]
    //!SECTION - ELEMENTS TO CORRECT

    switch (cssColorVarKey) {
        //LIGHT COLORS
        case "--yellow":
        case "--ivory":
            navCtaShop.style.color = 'var(--dark-text-color)';
            navCtaCartSvg.style.fill = 'var(--dark-text-color)';
            primaryButtons.forEach(pb => pb.style.color = 'var(--dark-text-color)');
            break;
        //DARK COLORS
        default:
            navCtaShop.style.color = 'var(--light-text-color)';
            navCtaCartSvg.style.fill = 'var(--light-text-color)';
            primaryButtons.forEach(pb => pb.style.color = 'var(--light-text-color)');
            break;
    }
}