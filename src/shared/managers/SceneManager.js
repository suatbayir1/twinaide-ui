// Libraries
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

// Constants
var THREE = require("three");
var OrbitControls = require("three-orbit-controls")(THREE);
var dae;


class SceneManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    static createScene = () => {
        return new THREE.Scene();
    }

    static createCamera = (fov, aspect, near, far) => {
        return new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    static createRenderer = (pixelRatio, width, height) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height);
        return renderer;
    }

    static removeAllObjectFromScene = async (scene, camera, renderer) => {
        if (scene !== undefined) {
            let obj;
            for (var i = scene.children.length - 1; i >= 0; i--) {
                console.log(scene.children[i]?.type)
                if (["GridHelper", "HemisphereLight", "DirectionalLight"].includes(scene.children[i]?.type)) {
                    continue;
                }
                obj = scene.children[i];
                obj.material = undefined;
                obj.geometry = undefined;
                await scene.remove(obj);
            }
            await renderer.render(scene, camera);
            return true;
        }
        return false;
    }

    setVisibleNodes = async (names) => {
        if (this.scene !== undefined) {
            for (var i = this.scene.children.length - 1; i >= 0; i--) {
                if (["GridHelper", "HemisphereLight", "DirectionalLight"].includes(this.scene.children[i]?.type)) {
                    continue;
                }

                if (!names.includes(this.scene.children[i].name)) {
                    this.scene.children[i].visible = false;
                } else {
                    this.scene.children[i].visible = true;
                }
            }
            this.renderer.render(this.scene, this.camera);
        }
    }

    setCameraPosition = (x, y, z) => {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
    }

    setCameraRotation = (x, y, z) => {
        this.camera.rotation.x = -0.2;
        this.camera.rotation.y = 0.8;
        this.camera.rotation.z = 0.2;
    }

    createOrbitControl = (camera, dom) => {
        let controls = new OrbitControls(camera, dom);
        controls.enableZoom = true;
        controls.zoomSpeed = 0.5;
        controls.update();

        return controls;
    }

    addGridToScene = (size, divisions, color1, color2) => {
        const grid = new THREE.GridHelper(size, divisions, color1, color2);
        this.scene.add(grid);
        // this.scene.background = new THREE.Color(0xc8c8c8);
    }

    addLightToScene = (skyColor, groundColor) => {
        const light = new THREE.HemisphereLight(skyColor, groundColor);
        this.scene.add(light);

        // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        // hemiLight.position.set(20, 20, 10);
        // this.scene.add(hemiLight);
        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-10, 20, 6);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 500;
        this.scene.add(dirLight);
    }

    addColladaFile = async (object, wireframe) => {
        const loader = new ColladaLoader();
        const filepath = `${process.env.REACT_APP_DT_VISUAL_FILES_URL}/${object.fileNameWithExtension}`;

        let vm = this;
        await loader.load(filepath, async function (collada) {
            dae = collada.scene;
            await dae.traverse(async function (child) {
                if (child.isMesh) {
                    child.material.flatShading = true;

                    if (object["color"] !== undefined) {
                        await child.material.color.set(object.color || "#ffffff");
                    }
                }
            });

            dae.position.x = object.positionX || 0;
            dae.position.y = object.positionY || 0;
            dae.position.z = object.positionZ || 0;
            dae.scale.x = object.scaleX || 1;
            dae.scale.y = object.scaleY || 1;
            dae.scale.z = object.scaleZ || 1;
            dae.name = object.fileNameWithExtension;

            await dae.updateMatrix();

            await Object.keys(collada.library.materials).forEach(material => {
                collada.library.materials[material].build.wireframe = wireframe;
            })

            await vm.scene.add(dae);
            await vm.renderer.render(vm.scene, vm.camera);
        });
        await this.renderer.render(this.scene, this.camera);
    }

    addGlbFile = async (object, wireframe) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath("../../node_modules/three/examples/js/libs/draco/");
        loader.setDRACOLoader(dracoLoader);

        const filepath = `${process.env.REACT_APP_DT_VISUAL_FILES_URL}/${object.fileNameWithExtension}`;

        let vm = this;
        await loader.load(filepath,
            async function (gltf) {
                gltf.scene.traverse((o) => {
                    if (o.isMesh) {
                        o.material.emissive = new THREE.Color(object.color);
                        // o.material.emissive = new THREE.Color(0xc8c8c8);
                        o.castShadow = true;
                        o.receiveShadow = true;
                        o.geometry.computeVertexNormals(); // FI
                    }
                });

                gltf.scene.scale.set(
                    object.scaleX || 0,
                    object.scaleY || 0,
                    object.scaleZ || 0
                );

                gltf.scene.position.set(
                    object.positionX || 0,
                    object.positionY || 0,
                    object.positionZ || 0
                )

                gltf.scene.name = object.fileNameWithExtension;

                await vm.scene.add(gltf.scene);
                await vm.renderer.render(vm.scene, vm.camera);
            },
            function (_) {
            },

            function (_) {
            }
        );
        await this.renderer.render(this.scene, this.camera);
    }
}

export default SceneManager;