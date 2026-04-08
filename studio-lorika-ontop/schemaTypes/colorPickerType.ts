import { defineField, defineType } from "sanity"

const GROUPS = {
    LANG: 'lang',
    ACCESSIBILITY: 'accessibility',
    COLORS: 'colors'
}

export const colorPickerType = defineType({
    name: 'colorPicker',
    type: 'document',
    title: 'Color picker',
    groups: [
        { name: GROUPS.LANG, title: "Language" },
        { name: GROUPS.ACCESSIBILITY, title: "Accessibility" },
        { name: GROUPS.COLORS, title: "Colors" },
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

        //ACCESSIBILITY
        defineField({
            name: 'groupAriaLabel',
            type: 'string',
            title: 'Group Aria Label',
            validation: (rule) => rule.required(),
            group: GROUPS.ACCESSIBILITY
        }),

        //COLORS
        defineField({
            name: 'RAL2008Label',
            type: 'string',
            title: 'RAL2008 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL3002Label',
            type: 'string',
            title: 'RAL3002 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL4006Label',
            type: 'string',
            title: 'RAL4006 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL9022Label',
            type: 'string',
            title: 'RAL9022 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL6037Label',
            type: 'string',
            title: 'RAL6037 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL1013Label',
            type: 'string',
            title: 'RAL1013 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL5015Label',
            type: 'string',
            title: 'RAL5015 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL1018Label',
            type: 'string',
            title: 'RAL1018 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL1002Label',
            type: 'string',
            title: 'RAL1002 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        }),
        defineField({
            name: 'RAL9005Label',
            type: 'string',
            title: 'RAL9005 Label',
            validation: (rule) => rule.required(),
            group: GROUPS.COLORS
        })
    ]
})