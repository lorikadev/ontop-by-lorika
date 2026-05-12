import {
    AmbientLight,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    RawShaderMaterial,
    Scene,
    SRGBColorSpace,
    Timer,
    Uniform,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import vertexShader from './3d-objects/globe/vertex.glsl?raw';
import fragmentShader from './3d-objects/globe/fragment.glsl?raw';
import gsap from 'gsap';

/** uniforms used by the globe shader */
const globe_uniforms = {
    u_tailProgress: new Uniform(0),
    u_headProgress: new Uniform(0)
}

/** timeline used to animate the globe shader */
let tl: gsap.core.Timeline | null = null;

export async function loadWorldInteraction() {
    try {
        const canvasElement = document.getElementById("world-3d-render") as HTMLCanvasElement | undefined;
        const worldWrapper = document.getElementById("world-3d-wrapper") as HTMLDivElement | undefined;

        if (!canvasElement || !worldWrapper) {
            console.error('world-interaction \n canvasElement or worldWrapper not found');
            return;
        }

        const { scene, camera, renderer, controls } = setupScene(canvasElement, worldWrapper);

        // LIGHTS
        const ambientLight = new AmbientLight('#ffffff', 10);
        scene.add(ambientLight);

        let worldObject: Object3D | null = null;
        let isSceneContentLoaded = false;

        // FPS CONTROL
        const timer = new Timer();

        function updateLogic(deltaTime: number) {
            if (worldObject)
                controls.update(deltaTime);
        }

        let animationFrameId: number | null = null;

        function animate() {
            timer.update();
            updateLogic(timer.getDelta());
            renderer.render(scene, camera);

            //LOOP THE ANIMATION STEP
            animationFrameId = requestAnimationFrame(animate);
        }

        animationFrameId = requestAnimationFrame(animate);


        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async entry => {
                //START / RESUME ANIMATION
                if (entry.isIntersecting) {
                    if (!isSceneContentLoaded) {
                        worldObject = await loadWorldAssets(scene);
                        isSceneContentLoaded = true;
                        tl?.play();
                    }

                    if (animationFrameId === null) {
                        timer.connect(document);
                        //reset cumulated time
                        timer.update();
                        animate();
                        tl?.resume();
                    }

                    controls.enabled = true;
                }
                //STOP ANIMATION
                else {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);

                    animationFrameId = null;
                    controls.enabled = false;
                    timer.disconnect();
                    tl?.pause();
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: "300px 0px 300px 0px"
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
 * @param scene 
 * @returns the world object3D
 */
async function loadWorldAssets(scene: Scene) {
    //load timeline
    tl = gsap.timeline();
    tl.to(
        { progress: 0 },
        {
            progress: 1,
            duration: 3,
            ease: 'sine.inOut',
            onUpdate() {
                const t = this.targets()[0].progress;
                globe_uniforms.u_headProgress.value = t
            },
        },
        "head"
    );
    tl.to(
        { progress: 0 },
        {
            progress: 1,
            duration: 3,
            ease: 'sine.inOut',
            onUpdate() {
                const t = this.targets()[0].progress;
                globe_uniforms.u_tailProgress.value = t
            },
            onComplete() {
                globe_uniforms.u_headProgress.value = 0;
                globe_uniforms.u_tailProgress.value = 0;
                tl!.restart();
            }
        },
        "head+=1"
    )

    const loader = new GLTFLoader();
    const world = (await loader.loadAsync('/3d/mondo.glb')).scene;

    world.traverse(obj => {
        if (!(obj as any).isMesh) return;

        const mesh = obj as Mesh;
        switch (obj.name) {
            case 'frecce':
                mesh.material = new RawShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    uniforms: globe_uniforms,
                    transparent: true,
                    depthWrite: false
                })
                break;

            default:

                const material = mesh.material as MeshBasicMaterial;
                const map = material.map;

                if (!map) return;

                map.colorSpace = SRGBColorSpace;
                map.anisotropy = 5;
                material.color.setScalar(1.5);
                break;
        }
    });

    scene.add(world);

    return world;
}

/**
 * @param canvasElement 
 * @param heroWrapper 
 * @returns scene obj, renderer, camera and controls of the scene 
 */
function setupScene(canvasElement: HTMLCanvasElement, wrapper: HTMLDivElement) {
    const scene = new Scene();

    const camera = new PerspectiveCamera(
        30,
        wrapper.clientWidth / wrapper.clientHeight,
        0.1,
        25
    );
    camera.position.set(5, 2, -2.5);
    camera.lookAt(scene.position);

    const renderer = new WebGLRenderer({ canvas: canvasElement, antialias: true });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;

    window.addEventListener('resize', () => {
        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight;

        renderer.setSize(width, height, true);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.enabled = false;

    return { scene, camera, renderer, controls };
}