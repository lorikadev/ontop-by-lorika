import { AmbientLight, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SRGBColorSpace, Timer, WebGLRenderer } from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const worldWrapper = document.getElementById("world-3d-wrapper") as HTMLDivElement | undefined
        const canvasElement = document.getElementById("world-3d-render") as HTMLCanvasElement | undefined;
        if (!canvasElement || !worldWrapper) {
            console.error('world-interacton \n canvasElement or heroWrworldWrapperapper not found');
            return; //early return to avoid crash
        }

        //SETUP SCENE
        const scene = new Scene();

        //SETUP CAMERA
        const camera = new PerspectiveCamera(30, worldWrapper.clientWidth / worldWrapper.clientHeight, 0.1, 25);
        camera.position.set(2.5, 2, -2.5);
        camera.lookAt(scene.position);

        const loader = new GLTFLoader();
        const globo = (await loader.loadAsync('/3d/mondo.glb')).scene;
        globo.traverse(obj => {
            if (!(obj as any).isMesh) return;
            const map = ((obj as Mesh).material as MeshBasicMaterial).map;
            if (!map) return
            map.colorSpace = SRGBColorSpace;
            map.anisotropy = 5;
            ((obj as Mesh).material as MeshBasicMaterial).color.setScalar(1.5);
        });
        scene.add(globo);

        //SETUP RENDERER
        const renderer = new WebGLRenderer({ canvas: canvasElement, antialias: true });
        renderer.setSize(worldWrapper.clientWidth, worldWrapper.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = SRGBColorSpace;

        //RESIZE HANDLING
        window.addEventListener('resize', () => {
            const width = worldWrapper.clientWidth;
            const height = worldWrapper.clientHeight;

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
        controls.autoRotate = true;
        controls.minPolarAngle = Math.PI * 0.15;
        controls.maxPolarAngle = Math.PI * 0.85;

        //SECTION - LIGHTS
        const ambientLight = new AmbientLight('#ffffff', 10);
        scene.add(ambientLight);
        //!SECTION - LIGHTS

        //CALC FRAMERATE DATA
        const fps = 120;
        let lastRenderTime = 0;
        const timer = new Timer();
        const timeBetweenFrames = 1000 / fps;

        function updateLogic(deltaTime: number) {
            controls.update();
        }

        let animationFrameId: number | null = null;

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
            animationFrameId = requestAnimationFrame(animate);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timer.connect(document);
                    controls.enabled = true;
                    animate();
                } else {
                    if (animationFrameId)
                        cancelAnimationFrame(animationFrameId);
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
});