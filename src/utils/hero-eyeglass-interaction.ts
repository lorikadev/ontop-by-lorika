import { AmbientLight, DirectionalLight, EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalMaterial, PerspectiveCamera, Scene, SRGBColorSpace, TextureLoader, Timer, WebGLRenderer, type Object3DEventMap } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createCover3DObject } from "../3d-objects/cover";
import { createEyeglass3DObject } from "../3d-objects/eye-glass";
import { createHero3dTimeline } from "../timelines/hero-3d-timeline";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const canvasElement = document.getElementById("hero-3d-render") as HTMLCanvasElement | undefined;
        if (!canvasElement) {
            console.error('hero-eyeglass-interacton \n canvasElement not found');
            return; //early return to avoid crash
        }

        //SETUP SCENE
        const scene = new Scene();

        //SETUP CAMERA
        const camera = new PerspectiveCamera(20, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 20);
        camera.position.set(0, 0, 9);
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
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.rotateSpeed = 0.5;
        controls.minPolarAngle = -Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI;
        controls.enabled = false;

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

        const gltfLoader = new GLTFLoader();

        //SECTION - COVER
        const coverRef = await createCover3DObject(gltfLoader);
        //!SECTION - COVER

        //SECTION - EYEGLASSES
        const glassesObjRef = await createEyeglass3DObject(gltfLoader);
        //!SECTION - EYEGLASSES

        const group = new Group();
        group.add(coverRef, glassesObjRef);
        group.rotateX(Math.PI * 0.15); //-29 deg
        group.position.set(0, -3, 0);
        scene.add(group);


        //INTRO ANIMATION
        const tl = createHero3dTimeline(group); 
        /** used to stop updating post animation */
        const animationDuration = tl.duration();
        /** time used for 3d initial animation */
        let animationElapsed = 0;
        let isAnimationOver = false;

        //CALC FRAMERATE DATA
        const fps = 120;
        let lastRenderTime = 0;
        const timer = new Timer();
        const timeBetweenFrames = 1000 / fps;

        function updateLogic(deltaTime: number) {
            if (isAnimationOver === false) {
                if (animationElapsed <= animationDuration)
                    animationElapsed += deltaTime;
                else {
                    controls.enabled = true;
                    isAnimationOver = true;
                }
            } else {
                controls.update();
            }
        }

        function updateAnimations(deltaTime: number) {
            if (isAnimationOver === false && animationElapsed <= animationDuration)
                tl.time(animationElapsed);
        }

        //ANIMATION STEP
        function animate() {
            timer.update();
            const currentTime = timer.getElapsed() * 1000;
            const timeSinceLastRender = currentTime - lastRenderTime;

            //GETTING INSIDE IF AND RUNNING RENDERING + LOGIC IF INSIDE A FRAME WINDOW
            if (timeSinceLastRender >= timeBetweenFrames) {
                const deltaTime = timeSinceLastRender / 1000
                lastRenderTime = currentTime;
                updateLogic(deltaTime);
                updateAnimations(deltaTime);
                renderer.render(scene, camera);
            }

            //LOOP THE ANIMATION STEP
            requestAnimationFrame(animate);
        }

        animate();
    } catch (error) {
        console.error(error);
    }
});