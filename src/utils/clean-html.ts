import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "b", "strong", "br",
    "ul", "ol", "li", "small", "img"
];

const allowedAttributes: any = {};

allowedTags.forEach(tag => {
    allowedAttributes[tag] = ["class", "style", "id", "role", "aria-label"];
});

export const cleantHtml = (unsafeHtml: string) => sanitizeHtml(unsafeHtml, {
    allowedTags: [...allowedTags],
    allowedAttributes: {
        span: ["class", "style"],
        p: ["class", "style"],
        h1: ["class", "style"],
        h2: ["class", "style"],
        h3: ["class", "style"],
        h4: ["class", "style"],
        h5: ["class", "style"],
        h6: ["class", "style"],
    },
});
