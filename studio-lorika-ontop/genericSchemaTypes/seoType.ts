import { defineField } from "sanity";

export const SEO_GROUP = 'seo';
export const SEO_TITLE = 'Seo';

export const seoFields = defineField({
    name: "seo",
    title: "SEO",
    type: "object",
    group: SEO_GROUP,
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (rule) => rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
            rows: 3,
            validation: (rule) => rule.required(),
        },
        {
            name: "robots",
            title: "Robots",
            type: "string",
            options: {
                list: [
                    { title: "index, follow", value: "index, follow" },
                    { title: "noindex, follow", value: "noindex, follow" },
                    { title: "index, nofollow", value: "index, nofollow" },
                    { title: "noindex, nofollow", value: "noindex, nofollow" },
                ],
                layout: "dropdown",
            },
            validation: (rule) => rule.required(),
        },
        {
            name: "shareImage",
            title: "Share thumbnail",
            type: "image",
            validation: (rule) => rule.required(),
        },
        {
            name: "ogType",
            title: "Open Graph Type",
            type: "string",
            options: {
                list: [
                    { title: "Website", value: "website" },
                ],
                layout: "dropdown",
            },
            initialValue: "website",
            validation: (rule) => rule.required(),
        },
        {
            name: "ogSiteName",
            title: "Open Graph Site Name",
            type: "string",
            validation: (rule) => rule.required(),
        },
        {
            name: "twitterCard",
            title: "Twitter Card",
            type: "string",
            options: {
                list: [
                    { title: "Summary Large Image", value: "summary_large_image" },
                    { title: "Summary Image", value: "summary" },
                ],
                layout: "dropdown",
            },
            initialValue: "summary_large_image",
            validation: (rule) => rule.required(),
        },
    ],
    validation: (rule) => rule.required(),
});