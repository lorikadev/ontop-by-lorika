import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "b", "strong", "br",
    "ul", "ol", "li", "small", "img",
    "a"
];

const allowedAttributes: any = {};

allowedTags.forEach(tag => {
    allowedAttributes[tag] = [
        "class", 
        "style", 
        "id", 
        "role", 
        "src",
        "aria-label",
        "aria-label",
        "anim-on-scroll",
        "anim-on-scroll-delay",
        "aria-hidden"
    ];
});

export const cleanHtml = (unsafeHtml: string) => sanitizeHtml(unsafeHtml, {
    allowedTags: [...allowedTags],
    allowedAttributes: allowedAttributes,
});
