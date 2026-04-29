import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
    projectId: 'ta37clzz',
    dataset: 'production',
    apiVersion: '2026-04-02',
    useCdn: false
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)