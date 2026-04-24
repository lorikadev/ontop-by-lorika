import { Scene, Group, type Object3DEventMap, MeshPhysicalMaterial, Color, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * creates one instance of an eyeglass 3d object.
 * @param gltfLoaderRef 
 * @returns instance of an eyeglass 3d object
 */
export async function createEyeglass3DObject(gltfLoaderRef: GLTFLoader): Promise<Group<Object3DEventMap>> {
    const onLoadData = await gltfLoaderRef.loadAsync(
        '/3d/glasses.glb'
    );

    const glassesObjRef = onLoadData.scene;

    //https://physicallybased.info/
    const glassesPlasticMaterial = new MeshPhysicalMaterial({
        color: '#000000',
        metalness: 0,
        ior: 1.5,
        roughness: 0.25,
        envMapIntensity: 1.8
    });
    const jointMaterial = new MeshPhysicalMaterial({
        color: new Color(0.91, 0.92, 0.92),
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.2
    });
    const cameraMaterial = new MeshPhysicalMaterial({
        color: new Color('#454545'),
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.2,
        reflectivity: 1
    });
    const lensMaterial = new MeshPhysicalMaterial({
        color: new Color('#404245'),
        metalness: 0,
        roughness: 0.1,
        transmission: 1,
        ior: 1.5,
        attenuationColor: new Color('#404245'),
        attenuationDistance: 1.5,
        envMapIntensity: 1.5
    });

    glassesObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            switch (child.name) {
                case "camera":
                    (child as Mesh).material = cameraMaterial;
                    break;
                case "joint":
                    (child as Mesh).material = jointMaterial;
                    break;
                case "lens":
                    (child as Mesh).material = lensMaterial;
                    break;
                default:
                    (child as Mesh).material = glassesPlasticMaterial;
                    break;
            }
        }
    })

    return glassesObjRef;
}