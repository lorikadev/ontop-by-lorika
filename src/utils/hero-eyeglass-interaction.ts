import { AmbientLight, Color, DirectionalLight, EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Scene, SRGBColorSpace, TextureLoader, Timer, WebGLRenderer, type Object3DEventMap } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvasElement = document.getElementById("hero-3d-render") as HTMLCanvasElement | undefined;
    if (!canvasElement) {
        console.error('hero-eyeglass-interacton \n canvasElement not found');
        return; //early return to avoid crash
    }

    //SETUP SCENE
    const scene = new Scene();

    //SETUP CAMERA
    const camera = new PerspectiveCamera(20, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 20);
    camera.position.set(0, 0, 6);
    camera.lookAt(scene.position);

    //SETUP RENDERER
    const renderer = new WebGLRenderer({ canvas: canvasElement, antialias: true });
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMappingExposure = 1.8;
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);

    //RESIZE HANDLING
    window.addEventListener('resize', () => {
        camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    })

    //ORBIT CONTROLS SETUP
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.panSpeed = 0.75;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.minPolarAngle = -Math.PI * 0.5;
    controls.maxPolarAngle = Math.PI;

    //SECTION - LIGHTS
    const ambientLight = new AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    const keyLight = new DirectionalLight('#ffffff', 0.8);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new DirectionalLight('#ffffff', 0.4);
    rimLight.position.set(0, 2, -6);
    scene.add(rimLight);
    //!SECTION - LIGHTS

    //SECTION - HDR
    const textureLoader = new TextureLoader();
    textureLoader.load('/3d/hdr.jpg', (hdr) => {
        hdr.mapping = EquirectangularReflectionMapping;
        scene.environment = hdr;
        scene.environmentRotation.set(0, 0.6, 0);
    });
    //!SECTION - HDR

    //SECTION - COVER
    const html = document.documentElement;
    //apply new highlight color
    const HIGHLIGHT_COLOR_CSS_VAR_KEY = "--highlight-color";
    const colorCssKey = localStorage.getItem(HIGHLIGHT_COLOR_CSS_VAR_KEY);
    if (!colorCssKey) {
        console.error('hero-eyeglass-interacton \n colorCssKey not found');
        return; //early return to avoid crash
    }
    let colorRgb = getComputedStyle(html).getPropertyValue(colorCssKey);
    let coverObjRef: null | Group<Object3DEventMap> = null;
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

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        '/3d/cover.glb',
        (onLoadData) => {
            console.log(onLoadData)
            coverObjRef = onLoadData.scene;

            //set position
            coverObjRef.position.set(0, 0, 0);

            coverObjRef.traverse(child => {
                if ((child as any)?.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                    (child as Mesh).material = coverMaterial;
                }
            })
            scene.add(coverObjRef);
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
            //add event listener to change color of cover
        },
        (onProgressData) => {
            console.log("PROGRESS", onProgressData)
        },
        (onErrorData) => {
            console.error(onErrorData)
        }
    );
    //!SECTION - COVER

    //SECTION - EYEGLASSES
    let glassesObjRef: null | Group<Object3DEventMap> = null;
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
    gltfLoader.load(
        '/3d/glasses.glb',
        (onLoadData) => {
            console.log(onLoadData)
            glassesObjRef = onLoadData.scene;

            //set position
            glassesObjRef.position.set(0, 0, 0);

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
            scene.add(glassesObjRef);
        },
        (onProgressData) => {
            console.log("PROGRESS", onProgressData)
        },
        (onErrorData) => {
            console.error(onErrorData)
        }
    );
    //!SECTION - EYEGLASSES

    //CALC FRAMERATE DATA
    const fps = 120;
    let lastRenderTime = 0;
    const timer = new Timer();
    const timeBetweenFrames = 1000 / fps;

    //ANIMATION STEP
    const animate = () => {
        timer.update();
        const currentTime = timer.getElapsed() * 1000;
        const timeSinceLastRender = currentTime - lastRenderTime;

        //GETTING INSIDE IF AND RUNNING RENDERING + LOGIC IF INSIDE A FRAME WINDOW
        if (timeSinceLastRender >= timeBetweenFrames) {
            // const deltaTime = timeSinceLastRender / 1000
            lastRenderTime = currentTime;
            controls.update();
            renderer.render(scene, camera);
        }

        //LOOP THE ANIMATION STEP
        requestAnimationFrame(animate);
    }

    animate();
});