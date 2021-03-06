// Libraries
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

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
                if (["GridHelper", "HemisphereLight"].includes(scene.children[i]?.type)) {
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
                if (["GridHelper", "HemisphereLight"].includes(this.scene.children[i]?.type)) {
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
    }

    addLightToScene = (skyColor, groundColor) => {
        const light = new THREE.HemisphereLight(skyColor, groundColor);
        this.scene.add(light);
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
}

export default SceneManager;