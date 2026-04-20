import { defineField, defineType } from "sanity";

const GROUPS = {
    LANG: 'lang',
    HERO: "hero",
    WHAT: "whatAreWe",
    BEHIND: "behind",
    FIRST: "firstProduct",
    OVER: "overProduct",
};

export const aboutUsType = defineType({
    name: "aboutUs",
    title: "About Us",
    type: "document",

    groups: [
        { name: GROUPS.LANG, title: 'Language' },
        { name: GROUPS.HERO, title: "Hero" },
        { name: GROUPS.WHAT, title: "What Are We" },
        { name: GROUPS.BEHIND, title: "Behind" },
        { name: GROUPS.FIRST, title: "First Product" },
        { name: GROUPS.OVER, title: "Over Product" },
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

        // HERO
        defineField({
            name: "heroTitle",
            title: "Title",
            type: "text",
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "heroContent",
            title: "Content",
            type: "text",
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "heroVideoDesktop",
            title: "Video shown in desktop view",
            type: "file",
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "heroVideoMobile",
            title: "Video shown in mobile view",
            type: "file",
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),

        // WHAT
        defineField({
            name: "leftBlockContent",
            title: "Left Block Content",
            type: "text",
            group: GROUPS.WHAT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "rightBlockContent",
            title: "Right Block Content",
            type: "text",
            group: GROUPS.WHAT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "rightBlockLogo",
            title: "Right Block Logo",
            type: "image",
            group: GROUPS.WHAT,
        }),

        // BEHIND
        defineField({
            name: "behindContent",
            title: "Content",
            type: "text",
            group: GROUPS.BEHIND,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "behindContentBackground",
            title: "Content background",
            type: "image",
            group: GROUPS.BEHIND,
            validation: (rule) => rule.required(),
        }),

        // FIRST PRODUCT
        defineField({
            name: "firstProductContent",
            title: "Content",
            type: "text",
            group: GROUPS.FIRST,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "firstProductContentBackground",
            title: "Content background",
            type: "image",
            group: GROUPS.FIRST,
            validation: (rule) => rule.required(),
        }),

        // OVER THE PRODUCT
        defineField({
            name: "overTheProductContent",
            title: "Content",
            type: "text",
            group: GROUPS.OVER,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "overTheProductContentBackgroundLeft",
            title: "Content background left",
            type: "image",
            group: GROUPS.OVER,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "overTheProductContentBackgroundRight",
            title: "Content background right",
            type: "image",
            group: GROUPS.OVER,
            validation: (rule) => rule.required(),
        }),
    ],
});