document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = '/images/images/ontop-cover/{{RAL}}/';

    //get dom element and check for existence
    const lbItem = document.getElementById("lb-item-4");
    if (!lbItem) {
        console.error("lb-item-4 is missing from page");
        return;
    }

    const updateRal = () => {
        //retrieve current ral or fallback
        let currentRal = localStorage.getItem('--highlight-color');
        currentRal = currentRal ?? '--RAL2008';

        // preload
        const img = new Image();
        const newUrl = `${baseUrl.replace('{{RAL}}', currentRal)}zoomed.webp`;
        img.onload = () => {
            // change image when ready
            lbItem.style.backgroundImage = `url('${newUrl}')`;
        };

        //update url
        img.src = newUrl;
    }

    updateRal();
    document.addEventListener('changedHighlightColor', updateRal);
})