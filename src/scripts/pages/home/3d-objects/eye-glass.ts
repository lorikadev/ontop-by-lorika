import { Group, type Object3DEventMap, MeshPhysicalMaterial, Color, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

/**
 * creates one instance of an eyeglass 3d object.
 * @param gltfLoaderRef 
 * @returns instance of an eyeglass 3d object
 */
export async function createEyeglass3DObject(gltfLoaderRef: GLTFLoader): Promise<Group<Object3DEventMap>> {
    const onLoadData = await gltfLoaderRef.loadAsync(
        '/3d/eyeglass.glb'
    );

    const glassesObjRef = onLoadData.scene;
    glassesObjRef.name = 'eyeglass';

    //https://physicallybased.info/
    glassesObjRef.traverse(child => {
        if ((child as any)?.isMesh) {
            switch (child.name) {
                case "camera":
                    (child as Mesh).material = new MeshPhysicalMaterial({
                        color: new Color('#454545'),
                        metalness: 1,
                        roughness: 0.3,
                        envMapIntensity: 1.2,
                        reflectivity: 1
                    });
                    break;
                case "obiettivo":
                case "giunture":
                    (child as Mesh).material = new MeshPhysicalMaterial({
                        color: new Color(0.91, 0.92, 0.92),
                        metalness: 1,
                        roughness: 0.2,
                        envMapIntensity: 1.3
                    });
                    break;
                case "vetrino":
                    (child as Mesh).material = new MeshPhysicalMaterial({
                        color: new Color('#7f8388'),
                        metalness: 0,
                        roughness: 0,
                        transmission: 1,
                        opacity: 0.3,
                        attenuationColor: new Color('#7f8388'),
                        attenuationDistance: 1.5,
                    });
                    break;
                case "lenti":
                    (child as Mesh).material = new MeshPhysicalMaterial({
                        color: new Color('#404245'),
                        metalness: 0,
                        roughness: 0,
                        transmission: 1,
                        attenuationColor: new Color('#404245'),
                        attenuationDistance: 1.5,
                    });
                    break;
                default:
                    (child as Mesh).material = new MeshPhysicalMaterial({
                        color: '#000000',
                        metalness: 0,
                        ior: 1.5,
                        roughness: 0.25,
                        envMapIntensity: 1.8
                    });
                    break;
            }
        }
    })

    return glassesObjRef;
}