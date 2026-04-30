import {
    AmbientLight,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    Timer,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
        const fps = 120;
        let lastRenderTime = 0;
        const timer = new Timer();
        const timeBetweenFrames = 1000 / fps;

        function updateLogic(deltaTime: number) {
            if (worldObject)
                controls.update(deltaTime);
        }

        let animationFrameId: number | null = null;

        function animate() {
            timer.update();

            const currentTime = timer.getElapsed() * 1000;
            const timeSinceLastRender = currentTime - lastRenderTime;

            if (timeSinceLastRender >= timeBetweenFrames) {
                const deltaTime = timeSinceLastRender / 1000;
                lastRenderTime = currentTime;

                updateLogic(deltaTime);
                renderer.render(scene, camera);
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async entry => {
                if (entry.isIntersecting) {
                    if (animationFrameId === null) {
                        timer.connect(document);
                        controls.enabled = true;
                        animate();
                    }

                    if (!isSceneContentLoaded) {
                        worldObject = await loadWorldAssets(scene);
                        isSceneContentLoaded = true;
                    }
                } else {
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
 * @param scene 
 * @returns the world object3D
 */
async function loadWorldAssets(scene: Scene) {
    const loader = new GLTFLoader();
    const world = (await loader.loadAsync('/3d/mondo.glb')).scene;

    world.traverse(obj => {
        if (!(obj as any).isMesh) return;

        const mesh = obj as Mesh;
        const material = mesh.material as MeshBasicMaterial;
        const map = material.map;

        if (!map) return;

        map.colorSpace = SRGBColorSpace;
        map.anisotropy = 5;
        material.color.setScalar(1.5);
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
        canvasElement.clientWidth / canvasElement.clientHeight,
        0.1,
        25
    );
    camera.position.set(2.5, 2, -2.5);
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