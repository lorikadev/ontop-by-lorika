import { defineField, defineType } from "sanity";

const GROUPS = {
    LANG: 'lang',
    GALLERY: "gallery",
    INFO: "info",
};

export const ontopCoverType = defineType({
    name: "ontopCover",
    title: "Ontop Cover",
    type: "document",

    groups: [
        { name: GROUPS.LANG, title: 'Language' },
        { name: GROUPS.GALLERY, title: "gallery" },
        { name: GROUPS.INFO, title: "info" },
    ],

    fields: [
        //LANG
        defineField({
            name: 'lang',
            type: 'string',
            title: 'Language',
            options: {
                list: [
                    { title: 'Italiano', value: 'it' },
                    { title: 'English', value: 'en' },
                ]
            },
            validation: (rule) => rule.required(),
            group: GROUPS.LANG
        }),

        //GALLERY
        defineField({
            name: 'gallerySectionAriaLabel',
            type: 'string',
            title: 'Gallery section aria label',
            validation: (rule) => rule.required(),
            group: GROUPS.GALLERY
        }),
        defineField({
            name: 'mainPhoto',
            type: 'object',
            fields: [
                {
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    validation: (rule) => rule.required(),
                },
                {
                    name: 'alternativeText',
                    title: 'Alternative text',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }
            ],
            group: GROUPS.GALLERY
        }),
        defineField({
            name: 'secondaryPhotos',
            type: 'array',
            title: 'Product secondary photos',
            group: GROUPS.GALLERY,
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'image',
                        title: 'Image',
                        type: 'image',
                        validation: (rule) => rule.required(),
                    },
                    {
                        name: 'alternativeText',
                        title: 'Alternative text',
                        type: 'string',
                        validation: (rule) => rule.required(),
                    }
                ]
            }]
        }),

        //INFO
        defineField({
            name: 'productInfoSectionAriaLabel',
            type: 'string',
            title: 'Product info section aria label',
            validation: (rule) => rule.required(),
            group: GROUPS.INFO
        }),
        defineField({
            name: 'infos',
            type: 'array',
            title: 'Product\'s info',
            group: GROUPS.INFO,
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'title',
                        title: 'Title',
                        type: 'string',
                        validation: (rule) => rule.required(),
                    },
                    {
                        name: 'htmlContent',
                        title: 'Html content',
                        type: 'text',
                        validation: (rule) => rule.required(),
                    }
                ]
            }]
        }),
        defineField({
            name: 'buyNowCta',
            type: 'object',
            title: 'Buy now button',
            fields: [
                {
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                    validation: (rule) => rule.required(),
                },
                {
                    name: 'ariaLabel',
                    title: 'aria label',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }
            ],
            group: GROUPS.INFO
        }),
    ],
});