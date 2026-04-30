import { AmbientLight, DirectionalLight, EquirectangularReflectionMapping, PerspectiveCamera, Scene, SRGBColorSpace, TextureLoader, Timer, WebGLRenderer } from "three";
import { createHeroEyeglassEntity, type IHeroEyeglassEntity } from "./entities/hero-eyeglass";
import { getIntroColorChangeEventHandler } from "./event-handler/intro-color-change";
import { getInteractiveColorChangeEventHandler } from "./event-handler/interactive-color-change";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export async function loadHeroEyeglassInteraction() {
    try {
        const heroWrapper = document.getElementById("hero-wrapper") as HTMLDivElement | undefined
        const canvasElement = document.getElementById("hero-3d-render") as HTMLCanvasElement | undefined;
        if (!canvasElement || !heroWrapper) {
            console.error('hero-eyeglass-interacton \n canvasElement or heroWrapper not found');
            return;
        }

        const { scene, camera, renderer, controls } = setupScene(canvasElement, heroWrapper);

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

        let heroEyeglassEntity: IHeroEyeglassEntity | null = null;
        let introColorChangeEventHandler: (() => void) | null = null;

        //CALC FRAMERATE DATA
        const timer = new Timer();

        function updateLogic(deltaTime: number) {
            if (heroEyeglassEntity)
                handleHeroEyeglassInteraction(heroEyeglassEntity, deltaTime, introColorChangeEventHandler, controls);
        }

        let animationFrameId: number | null = null;

        //ANIMATION STEP
        function animate() {
            timer.update();

            updateLogic(timer.getDelta());
            renderer.render(scene, camera);

            //LOOP THE ANIMATION STEP
            animationFrameId = requestAnimationFrame(animate);
        }

        let isSceneContentLoaded = false;

        //NOTE - this stops the rendering when the user is far from seeing it, enables it back when near or in front 
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async entry => {
                //START / RESUME ANIMATION
                if (entry.isIntersecting) {
                    if (animationFrameId === null) {
                        timer.connect(document);
                        //reset cumulated time
                        timer.update();
                        animate();
                        if (heroEyeglassEntity?.timelines.intro.isAnimationOver)
                            controls.enabled = true;
                    }
                    //load scene once render is setted and we are watching the scene or near it
                    if (isSceneContentLoaded === false) {
                        heroEyeglassEntity = await loadHeroEyeglassAssets(heroEyeglassEntity, scene);
                        isSceneContentLoaded = true;
                    }
                } 
                //STOP ANIMATION
                else {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                    controls.enabled = false;
                    timer.disconnect();
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: "300px 0px 300px 0px"
        });

        observer.observe(canvasElement);
    } catch (error) {
        console.error(error);
    }
}

/**
 * @param heroEyeglassEntity 
 * @param scene 
 * @returns the eyeglass entity
 * @notes this function sets the changedHighlightColor event listening and the intro timeline start
 */
async function loadHeroEyeglassAssets(heroEyeglassEntity: IHeroEyeglassEntity | null, scene: Scene) {
    heroEyeglassEntity = await createHeroEyeglassEntity();
    scene.add(heroEyeglassEntity.groupRef);
    heroEyeglassEntity.timelines.intro.play(true);
    //load event listener to change color during intro
    const introColorChangeEventHandler = getIntroColorChangeEventHandler(heroEyeglassEntity.directRefs.cover);
    document.addEventListener('changedHighlightColor', introColorChangeEventHandler);
    return heroEyeglassEntity;
}

/**
 * @param canvasElement 
 * @param heroWrapper 
 * @returns scene obj, renderer, camera and controls of the scene 
 */
function setupScene(canvasElement: HTMLCanvasElement, heroWrapper: HTMLDivElement) {
    //SETUP SCENE
    const scene = new Scene();

    //SETUP CAMERA
    const camera = new PerspectiveCamera(20, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 25);
    camera.position.set(0, 0, 9);
    camera.lookAt(scene.position);

    //SETUP RENDERER
    const renderer = new WebGLRenderer({ canvas: canvasElement, antialias: true });
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMappingExposure = 1.8;
    renderer.render(scene, camera);

    //RESIZE HANDLING
    window.addEventListener('resize', () => {
        const width = heroWrapper.clientWidth;

        let height = heroWrapper.clientHeight;
        if (width <= 1200) {
            height = (width / 10) * 9;
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
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.enabled = false;

    return {
        scene,
        camera,
        renderer,
        controls
    }
}

/**
 * 
 * @param heroEyeglassEntity 
 * @param deltaTime 
 * @param introColorChangeEventHandler 
 * @param controls 
 * @summary handles the eyeglass interaction, from the intro animation to the update animation and controls's update
 */
function handleHeroEyeglassInteraction(heroEyeglassEntity: IHeroEyeglassEntity, deltaTime: number, introColorChangeEventHandler: (() => void) | null, controls: OrbitControls) {
    //CHECK IF INTRO ANIMATION SHOULD BE ANIMATED AND IS NOT OVER
    if (heroEyeglassEntity.timelines.intro.shouldAnimate
        && heroEyeglassEntity.timelines.intro.isAnimationOver === false) {

        heroEyeglassEntity.timelines.intro.update(deltaTime);

        //CHECK IF AFTER UPDATE ANIMATION IS OVER 
        if (heroEyeglassEntity.timelines.intro.isAnimationOver) {

            //add event listener to change color of cover from colorpicker click
            document.removeEventListener('changedHighlightColor', introColorChangeEventHandler!);
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
