window.addEventListener('load', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const attrAnimationName = entry.target.attributes.getNamedItem('anim-on-scroll');
                const attrAnimationDelay = entry.target.attributes.getNamedItem('anim-on-scroll-delay');
                const delay = 0.1;
                //we do parse float and use 0 as a string because attributes values are strings
                const delayIncrease = parseFloat(attrAnimationDelay?.value ?? '0');
                (entry.target as HTMLElement).style.animation = `${attrAnimationName!.value} 0.25s ease-out ${delay + delayIncrease + 's'} forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    const elemToAnim = document.querySelectorAll('[anim-on-scroll]');
    elemToAnim.forEach(elemToAnim => {
        observer.observe(elemToAnim)
    })
})