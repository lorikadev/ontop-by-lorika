import { AmbientLight, DirectionalLight, EquirectangularReflectionMapping, PerspectiveCamera, Scene, SRGBColorSpace, TextureLoader, Timer, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createHeroEyeglassEntity } from "./entities/hero-eyeglass";
import { getIntroColorChangeEventHandler } from "./event-handler/intro-color-change";
import { getInteractiveColorChangeEventHandler } from "./event-handler/interactive-color-change";

document.addEventListener("DOMContentLoaded", async () => {
    try {

        const heroWrapper = document.getElementById("hero-wrapper") as HTMLDivElement | undefined
        const canvasElement = document.getElementById("hero-3d-render") as HTMLCanvasElement | undefined;
        if (!canvasElement || !heroWrapper) {
            console.error('hero-eyeglass-interacton \n canvasElement or heroWrapper not found');
            return; //early return to avoid crash
        }

        //SETUP SCENE
        const scene = new Scene();

        //SETUP CAMERA
        const camera = new PerspectiveCamera(20, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 25);
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
            const width = heroWrapper.clientWidth;

            let height = heroWrapper.clientHeight;
            if (width <= 1200) {
                height = (width / 5) * 4;
            }

            renderer.setSize(width, height, true);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
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

        const heroEyeglassEntity = await createHeroEyeglassEntity();
        scene.add(heroEyeglassEntity.groupRef);
        heroEyeglassEntity.timelines.intro.play(true);

        //load event listener to change color during intro
        const introColorChangeEventHandler = getIntroColorChangeEventHandler(heroEyeglassEntity.directRefs.cover);
        document.addEventListener('changedHighlightColor', introColorChangeEventHandler);

        //CALC FRAMERATE DATA
        const fps = 120;
        let lastRenderTime = 0;
        const timer = new Timer();
        const timeBetweenFrames = 1000 / fps;

        function updateLogic(deltaTime: number) {
            //CHECK IF INTRO ANIMATION SHOULD BE ANIMATED AND IS NOT OVER
            if (heroEyeglassEntity.timelines.intro.shouldAnimate
                && heroEyeglassEntity.timelines.intro.isAnimationOver === false) {

                heroEyeglassEntity.timelines.intro.update(deltaTime);

                //CHECK IF AFTER UPDATE ANIMATION IS OVER 
                if (heroEyeglassEntity.timelines.intro.isAnimationOver) {

                    //add event listener to change color of cover from colorpicker click
                    document.removeEventListener('changedHighlightColor', introColorChangeEventHandler);
                    const interactiveColorChangeEventHandler = getInteractiveColorChangeEventHandler(heroEyeglassEntity);
                    document.addEventListener('changedHighlightColor', interactiveColorChangeEventHandler);

                    //enables controls
                    controls.enabled = true;
                }
            }
            //WHEN INTRO IS OVER UPDATE CONTROLS NORMALLY
            else
                controls.update();

            if (heroEyeglassEntity.timelines.update.shouldAnimate &&
                heroEyeglassEntity.timelines.update.isAnimationOver === false) {
                heroEyeglassEntity.timelines.update.update(deltaTime);
            }
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