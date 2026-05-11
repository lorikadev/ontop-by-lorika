import Splide from '@splidejs/splide';

const baseUrl = '/images/images/ontop-cover/{{RAL}}/';
const QTA_OF_PHOTO = 3;

/** append images to desktop gallery */
function appendToDesktopGallery(currentRal: string) {
    try {
        //get dom element
        const mainProductImageEl = document.getElementById('product-gallery-main-img');
        const secondaryProductImagesEl = document.getElementById('product-gallery-second-imgs');
        if (!mainProductImageEl || !secondaryProductImagesEl)
            throw new Error('mainProductImageEl or secondaryProductImagesEl is missing');

        //load main image
        const currBaseRal = baseUrl.replace('{{RAL}}', currentRal) + '1.png';
        const mainImgElString = `
            <div class='skeleton'>
                <img id='desktop-product-img-1' src='${currBaseRal}' class="w-100"/>
            </div>
        `;
        mainProductImageEl.insertAdjacentHTML(
            'beforeend',
            mainImgElString
        );

        //load secondary
        for (let i = 2; i <= QTA_OF_PHOTO; i++) {
            const currBaseRal = baseUrl.replace('{{RAL}}', currentRal) + `${i}.png`;
            const secondaryImgElString = `
                <div class='skeleton'>
                    <img id='desktop-product-img-${i}' src='${currBaseRal}'/>
                </div>
            `;
            secondaryProductImagesEl.insertAdjacentHTML(
                'beforeend',
                secondaryImgElString
            );
        }
    } catch (error) {
        console.error(error);
    }
}

/** append images to mobile gallery and thumbnail */
function appendToMobileGallery(currentRal: string) {
    try {
        //get dom element
        const splideListEl = document.querySelector('#mobile-gallery .splide__list');
        const mobileThumbnailEl = document.getElementById('mobile-thumbnails');
        if (!mobileThumbnailEl || !splideListEl)
            throw new Error('splideListEl or mobileThumbnailEl is missing');

        //load images
        for (let i = 1; i <= QTA_OF_PHOTO; i++) {
            const currBaseRal = baseUrl.replace('{{RAL}}', currentRal) + `${i}.png`;

            //append to main splide gallery
            const liSplideElString = `
                <li class="splide__slide w-100">
                    <img id='mobile-product-img-${i}' src='${currBaseRal}' class="w-100"/>
                </li>
            `;
            splideListEl.insertAdjacentHTML(
                'beforeend',
                liSplideElString
            );

            //append to spline thumbnails
            const liThumbnailElString = `
                <li class="thumbnail">
                    <img id='mobile-product-img-thumbnail-${i}' src='${currBaseRal}'/>
                </li>
            `;
            mobileThumbnailEl.insertAdjacentHTML(
                'beforeend',
                liThumbnailElString
            );
        }
    } catch (error) {
        console.error(error);
    }
}

/** load images at page start */
function initImages() {
    //retrieve current ral or fallback
    let currentRal = localStorage.getItem('--highlight-color');
    currentRal = currentRal ?? '--RAL2008';

    appendToDesktopGallery(currentRal);
    appendToMobileGallery(currentRal);
}

/** load splide for mobile gallery */
function mountSplide() {
    //init splide object
    let splide = new Splide("#mobile-gallery", {
        pagination: false,
    });

    let thumbnails = document.getElementsByClassName("thumbnail");
    let activeThumbnail: Element | null = null;

    //init thumbnails navigation
    for (let i = 0; i < thumbnails.length; i++) {
        initThumbnail(thumbnails[i], i);
    }

    /**
     * @thumbnail thumbnail html element where the event get attached
     * @index indec representing the thumbnail original photo position in the gallery
     * attach splide navigation to thumbnails
     */
    function initThumbnail(thumbnail: Element, index: number) {
        thumbnail.addEventListener("click", function () {
            splide.go(index);
        });
    }

    //update active thumbnail on splide gallery updates
    splide.on("mounted move", function () {
        let thumbnail = thumbnails[splide.index];

        if (thumbnail) {
            if (activeThumbnail) {
                activeThumbnail.classList.remove("is-active");
            }

            thumbnail.classList.add("is-active");
            activeThumbnail = thumbnail;
        }
    });

    //start splide gallery
    splide.mount();
}

//INIT IMAGES AND LOAD SPLIDE
initImages();
mountSplide();

//add listener to change photo src with color picker selected color 
document.addEventListener('changedHighlightColor', (_: any) => {
    try {
        //retrieve current ral or fallback
        let currentRal = localStorage.getItem('--highlight-color');
        currentRal = currentRal ?? '--RAL2008';

        //desktop images
        for (let i = 1; i <= QTA_OF_PHOTO; i++) {
            const desktopImgEl = document.getElementById(`desktop-product-img-${i}`) as HTMLImageElement | null;

            if (!desktopImgEl)
                throw new Error(`html el with id desktop-product-img-${i} is missing`);

            desktopImgEl.src =
                baseUrl.replace('{{RAL}}', currentRal) + `${i}.png`;
        }

        //mobile gallery images
        for (let i = 1; i <= QTA_OF_PHOTO; i++) {
            const mobileImgEl = document.getElementById(`mobile-product-img-${i}`) as HTMLImageElement | null;

            if (!mobileImgEl)
                throw new Error(`html el with id mobile-product-img-${i} is missing`);

            mobileImgEl.src =
                baseUrl.replace('{{RAL}}', currentRal) + `${i}.png`;
        }

        //mobile thumbnails
        for (let i = 1; i <= QTA_OF_PHOTO; i++) {
            const mobileThumbnailImgEl = document.getElementById(
                `mobile-product-img-thumbnail-${i}`
            ) as HTMLImageElement | null;

            if (!mobileThumbnailImgEl)
                throw new Error(`html el with id mobile-product-img-thumbnail-${i} is missing`);

            if (mobileThumbnailImgEl) {
                mobileThumbnailImgEl.src =
                    baseUrl.replace('{{RAL}}', currentRal) + `${i}.png`;
            }
        }
    } catch (error) {
        console.error(error);
    }
});