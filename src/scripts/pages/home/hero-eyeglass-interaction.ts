import {
    AmbientLight,
    DirectionalLight,
    EquirectangularReflectionMapping,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Timer,
    WebGLRenderer
} from "three";

import { createHeroEyeglassEntity, type IHeroEyeglassEntity } from "./entities/hero-eyeglass";
import { getIntroColorChangeEventHandler } from "./event-handler/intro-color-change";
import { getInteractiveColorChangeEventHandler } from "./event-handler/interactive-color-change";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { nextFrame } from "../../globals/next-frame";

export function loadHeroEyeglassInteraction() {
    try {
        const heroWrapper = document.getElementById("hero-wrapper") as HTMLDivElement | null;
        const canvasElement = document.getElementById("hero-3d-render") as HTMLCanvasElement | null;

        if (!canvasElement || !heroWrapper) {
            console.error('hero-eyeglass-interaction: missing elements');
            return;
        }

        const { scene, camera, renderer, controls } = setupScene(canvasElement, heroWrapper);

        // LIGHTS
        scene.add(new AmbientLight('#ffffff', 1));

        const keyLight = new DirectionalLight('#ffffff', 0.6);
        keyLight.position.set(3.2, -0.2, 5);
        scene.add(keyLight);

        const rimLight = new DirectionalLight('#ffffff', 0.4);
        rimLight.position.set(-1, 0, -6);
        scene.add(rimLight);

        new TextureLoader().load('/3d/hdr.jpg', (hdr) => {
            hdr.mapping = EquirectangularReflectionMapping;
            scene.environment = hdr;
            scene.environmentRotation.set(0, 0.6, 0);
        });

        let heroEyeglassEntity: IHeroEyeglassEntity | null = null;
        let introColorChangeEventHandler: (() => void) | null = null;

        const timer = new Timer();
        let animationFrameId: number | null = null;

        function updateLogic(deltaTime: number) {
            if (heroEyeglassEntity) {
                handleHeroEyeglassInteraction(
                    heroEyeglassEntity,
                    deltaTime,
                    introColorChangeEventHandler,
                    controls
                );
            }
        }

        function animate() {
            timer.update();
            updateLogic(timer.getDelta());
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        }

        let entityPromise: Promise<IHeroEyeglassEntity> | null = null;

        // Use requestIdleCallback when available to run 3D interaction loading after the browser loaded the page.
        if ("requestIdleCallback" in window) {
            entityPromise = createHeroEyeglassEntity();

        } else {
            // Fallback for browsers (e.g. Safari) uses requestAnimationFrame + setTimeout:
            // - requestAnimationFrame waits for the next frame (after layout/paint)
            // - setTimeout(..., 0) defers execution to the next macrotask
            // This ensures the work runs right after the initial render, without blocking it.
            requestAnimationFrame(() => {
                entityPromise = createHeroEyeglassEntity();
            });
        }

        let isSceneReady = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {

                if (entry.isIntersecting) {
                    // LOAD + ATTACH SOLO QUANDO SERVE
                    if (!isSceneReady && entityPromise) {
                        heroEyeglassEntity = await entityPromise;

                        await nextFrame();

                        // add as invisible
                        heroEyeglassEntity.groupRef.visible = false;
                        scene.add(heroEyeglassEntity.groupRef);

                        await nextFrame();

                        // warmup shader
                        renderer.compile(scene, camera);

                        await nextFrame();

                        heroEyeglassEntity!.groupRef.visible = true;

                        await nextFrame();

                        // EVENTS
                        introColorChangeEventHandler =
                            getIntroColorChangeEventHandler(heroEyeglassEntity!.directRefs.cover);

                        document.addEventListener(
                            'changedHighlightColor',
                            introColorChangeEventHandler
                        );

                        heroEyeglassEntity!.timelines.intro.play(true);
                        isSceneReady = true;
                    }

                    if (heroEyeglassEntity?.timelines.intro.isAnimationOver) {
                        controls.enabled = true;
                    }

                    // START LOOP
                    if (animationFrameId === null) {
                        timer.connect(document);
                        timer.update();
                        animate();
                    }
                } else {
                    // STOP LOOP
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                    }
                    animationFrameId = null;
                    controls.enabled = false;
                    timer.disconnect();
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: "300px 0px"
        });


        // Use requestIdleCallback when available to run 3D interaction loading after the browser loaded the page.
        if ("requestIdleCallback" in window) {
            observer.observe(canvasElement);
        } else {
            // Fallback for browsers (e.g. Safari) uses requestAnimationFrame + setTimeout:
            // - requestAnimationFrame waits for the next frame (after layout/paint)
            // - setTimeout(..., 0) defers execution to the next macrotask
            // This ensures the work runs right after the initial render, without blocking it.
            requestAnimationFrame(() => {
                observer.observe(canvasElement);

            });
        }
    } catch (error) {
        console.error(error);
    }
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
