import { defineField, defineType } from 'sanity'

const GROUPS = {
  LANG: 'lang',
  NAVBAR: 'navbar',
  FOOTER: 'footer',
}

export const siteNavigatorsType = defineType({
  name: 'siteNavigators',
  type: 'document',
  title: 'Site navigators (navbar and footer)',
  groups: [
    { name: GROUPS.LANG, title: 'Language' },
    { name: GROUPS.NAVBAR, title: 'Navbar' },
    { name: GROUPS.FOOTER, title: 'Footer' },
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

    //NAVBAR
    defineField({
      name: 'navbar',
      type: 'object',
      group: GROUPS.NAVBAR,
      fields: [
        //LOGO
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          validation: (rule) => rule.required(),
        }),

        //NAV ITEMS
        defineField({
          name: 'home',
          title: 'Home',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'aboutUs',
          title: 'About us',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'ontopCover',
          title: 'Ontop cover',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'ambassadors',
          title: 'Ambassadors',
          type: 'string',
          validation: (rule) => rule.required(),
        }),

        //CTAs
        defineField({
          name: 'shop',
          title: 'Shop action',
          type: 'string',
          validation: (rule) => rule.required(),
        }),

        defineField({
          name: 'shopAriaLabel',
          title: 'Shop action aria label',
          type: 'string',
          validation: (rule) => rule.required(),
        }),

        defineField({
          name: 'cartAriaLabel',
          title: 'Cart action aria label',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ]
    }),

    //FOOTER
    defineField({
      name: 'footer',
      type: 'object',
      group: GROUPS.FOOTER,
      fields: [
        defineField({
          name: 'leftBlock',
          title: 'Left block',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'centerBlock',
          title: 'Center block',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'rightBlock',
          title: 'Right block',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
      ]
    })
  ],
})