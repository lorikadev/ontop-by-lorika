import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { getFileAsset } from '@sanity/asset-utils'

export const client = createClient({
    projectId: 'ta37clzz',
    dataset: 'production',
    apiVersion: '2026-04-02',
    useCdn: false
})

const builder = createImageUrlBuilder(client)
export const imageUrlFor = (source: string) => builder.image(source)

export const videoUrlFor = (source: any) =>
    getFileAsset(source, {
        projectId: client.config().projectId!,
        dataset: client.config().dataset!,
    }).url