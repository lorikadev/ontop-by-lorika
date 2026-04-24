import { Group, type Object3DEventMap, MeshPhysicalMaterial, Color, Mesh, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * creates one instance of a cover 3d object.
 * @param sceneRef 
 * @param gltfLoaderRef 
 * @returns instance of a cover 3d object
 */
export async function createCover3DObject(gltfLoaderRef: GLTFLoader): Promise<Group<Object3DEventMap>> {
    const onLoadData = await gltfLoaderRef.loadAsync(
        '/3d/cover.glb'
    );

    const coverObjRef = onLoadData.scene;

    //GET COLOR TO APPLY TO COVER
    const html = document.documentElement;
    //apply new highlight color
    const HIGHLIGHT_COLOR_CSS_VAR_KEY = "--highlight-color";
    const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
    if (!colorCssKey)
        throw new Error('addCover3DObjectToScene \n colorCssKey not found');
    let colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);


    //https://physicallybased.info/
    const coverMaterial = new MeshPhysicalMaterial({
        color: new Color(colorRgb),
        attenuationColor: new Color(colorRgb),
        attenuationDistance: 1.5,
        metalness: 0,
        ior: 1.585,
        roughness: 0.02,
        clearcoat: 0.2,
    });

    coverObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            child.receiveShadow = true;
            child.castShadow = true;
            (child as Mesh).material = coverMaterial;
        }
    })

    //add event listener to change color of cover
    document.addEventListener('changedHighlightColor', (e) => {
        const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
        if (!colorCssKey) {
            console.error('hero-eyeglass-interacton \n colorCssKey not found');
            return; //early return to avoid crash
        }
        let colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);
        coverMaterial.color.set(colorRgb);
        coverMaterial.attenuationColor.set(colorRgb);
    })

    return coverObjRef;
}