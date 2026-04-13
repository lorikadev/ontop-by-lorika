window.addEventListener('load', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const attr = entry.target.attributes.getNamedItem('anim-on-scroll');
                (entry.target as HTMLElement).style.animation = `${attr!.value} 0.25s ease-out 0.1s forwards`;
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