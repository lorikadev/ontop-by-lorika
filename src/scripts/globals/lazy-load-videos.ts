/**
 * 
 * @param videoSelector html selector used in querySelectorAll
 * @summary appen an observer to the element found with videoSelector and checks for data-src-desktop and data-src-mobile to lazy load
 * the correct video 
 */
export function lazyLoadVideos(videoSelector: string, rootMargin: string = "300px") {
    const videos = document.querySelectorAll(videoSelector);

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const isMobile = window.matchMedia('(max-width: 700px)').matches;

                const videoSrc = isMobile ?
                    (entry.target as HTMLElement).dataset.srcDesktop
                    :
                    (entry.target as HTMLElement).dataset.srcMobile

                if (videoSrc) {
                    const source = document.createElement('source');
                    source.src = videoSrc;
                    source.type = "video/mp4";
                    source.ariaHidden = "true";

                    (entry.target as HTMLElement).appendChild(source)
                }

                observer.unobserve(entry.target);
            }
        })
    }, {
        rootMargin: rootMargin
    })

    videos.forEach(video => {
        observer.observe(video)
    })
}