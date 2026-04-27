import { MeshPhysicalMaterial, Color, Mesh, Uniform, Vector2, Vector3, Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';
import { HIGHLIGHT_COLOR_CSS_VAR_KEY } from "../../../../../const";

/**
 * creates one instance of a cover 3d object.
 * @param sceneRef 
 * @param gltfLoaderRef 
 * @returns instance of a cover 3d object
 */
export async function createCover3DObject(gltfLoaderRef: GLTFLoader): Promise<Object3D> {
    const onLoadData = await gltfLoaderRef.loadAsync(
        '/3d/cover_joined.glb'
    );

    const coverObjRef = onLoadData.scene;
    coverObjRef.name = 'cover';

    //GET COLOR TO APPLY TO COVER
    const html = document.documentElement;
    //apply new highlight color
    const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
    if (!colorCssKey)
        throw new Error('addCover3DObjectToScene \n colorCssKey not found');
    let colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);

    //CUSTOM SHADER MATERIAL
    const uniforms = {
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_size: {
            value: new Vector2(
                0,
                0
            )
        },
        u_opacity: new Uniform(0),
        u_currentColor: { value: new Color('black') },
        u_targetColor: { value: new Color(colorRgb) },
    };

    const coverMaterial = new CustomShaderMaterial({
        // CSM
        baseMaterial: MeshPhysicalMaterial,
        vertexShader,
        fragmentShader,
        uniforms,

        // MeshPhysicalMaterial
        //https://physicallybased.info/
        metalness: 0,
        ior: 1.585,
        roughness: 0.02,
        clearcoat: 0.2,
        transparent: true,
    })

    coverObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            child.receiveShadow = true;
            child.castShadow = true;

            const geometry = (child as Mesh).geometry;
            geometry.computeBoundingBox();
            if (!geometry.boundingBox) throw new Error('bouding box not found');

            const geometryBB = geometry.boundingBox;
            const geometrySize = new Vector3();
            geometryBB.getSize(geometrySize);

            //NOTE the uniform is one but the geometries are 3, should check if we can unify (doubt)
            uniforms.u_size.value.set(geometrySize.x, geometrySize.y);
            (child as Mesh).material = coverMaterial;
        }
    })

    return coverObjRef;
}