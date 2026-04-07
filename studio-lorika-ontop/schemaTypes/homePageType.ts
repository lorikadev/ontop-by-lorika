import { defineField, defineType } from 'sanity'

const GROUPS = {
    LANG: 'lang',
    HERO: 'hero',
    LIGHT: 'lightSection',
    DARK: 'darkSection',
}

export const homePageType = defineType({
    name: 'homePage',
    type: 'document',
    title: 'Home Page',
    groups: [
        { name: GROUPS.LANG, title: 'Language' },
        { name: GROUPS.HERO, title: 'Hero Section' },
        { name: GROUPS.LIGHT, title: 'Light Section' },
        { name: GROUPS.DARK, title: 'Dark Section' },
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
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'text',
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'mobileAds',
            title: 'Mobile Ads Text',
            type: 'string',
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'buyNowLabel',
            title: 'Buy Now Label',
            type: 'string',
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'buyNowAriaLabel',
            title: 'Buy Now Aria Label',
            type: 'string',
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'discoverLabel',
            title: 'Discover Label',
            type: 'string',
            group: GROUPS.HERO,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'discoverAriaLabel',
            title: 'Discover Aria Label',
            type: 'string',
            group: GROUPS.HERO,
        }),

        // LIGHT SECTION
        defineField({
            name: 'sectionLightAriaLabel',
            title: 'Light Section Aria Label',
            type: 'string',
            group: GROUPS.LIGHT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'productPhotoAriaLabel',
            title: 'Product Photo Aria Label',
            type: 'string',
            group: GROUPS.LIGHT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'productPhotoAndModelsAriaLabel',
            title: 'Product Photo and Models Aria Label',
            type: 'string',
            group: GROUPS.LIGHT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lItem1Image',
            title: 'Light Item 1 Image',
            type: 'image',
            group: GROUPS.LIGHT,
        }),
        defineField({
            name: 'lItem2Content',
            title: 'Light Item 2 Content',
            type: 'text',
            group: GROUPS.LIGHT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lItem3Image',
            title: 'Light Item 3 Image',
            type: 'image',
            group: GROUPS.LIGHT,
        }),
        defineField({
            name: 'lItem4Image',
            title: 'Light Item 4 Image',
            type: 'image',
            group: GROUPS.LIGHT,
        }),
        defineField({
            name: 'lItem5Content',
            title: 'Light Item 5 Content',
            type: 'text',
            group: GROUPS.LIGHT,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lItem6Content',
            title: 'Light Item 6 Content',
            type: 'text',
            group: GROUPS.LIGHT,
        }),
        defineField({
            name: 'lightSubHeroImage',
            title: 'Sub Hero Image',
            type: 'image',
            group: GROUPS.LIGHT,
        }),

        // DARK SECTION
        defineField({
            name: 'sectionDarkAriaLabel',
            title: 'Dark Section Aria Label',
            type: 'string',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'logoAriaLabel',
            title: 'Logo Aria Label',
            type: 'string',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'dItem2Content',
            title: 'Dark Item 2 Content',
            type: 'text',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'dItem3Content',
            title: 'Dark Item 3 Content',
            type: 'text',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'dItem4Image',
            title: 'Dark Item 4 Image',
            type: 'image',
            group: GROUPS.DARK,
        }),
        defineField({
            name: 'dItem5Content',
            title: 'Dark Item 5 Content',
            type: 'text',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'joinUsLabel',
            title: 'Join Us Label',
            type: 'string',
            group: GROUPS.DARK,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'joinUsAriaLabel',
            title: 'Join Us Aria Label',
            type: 'string',
            group: GROUPS.DARK,
        }),
        defineField({
            name: 'darkSubHeroImage',
            title: 'Sub Hero Image',
            type: 'image',
            group: GROUPS.DARK,
        }),
    ],
})