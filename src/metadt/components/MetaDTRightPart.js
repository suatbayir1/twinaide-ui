// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Panel, ComponentSize, RemoteDataState
} from '@influxdata/clockface'

// Managers
import SceneManager from '../../shared/managers/SceneManager';

// Scene Helpers
var camera, controls, scene, renderer;

class MetaDTRightPart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinnerLoading: RemoteDataState.Loading
        }
    }

    async componentDidMount() {
        console.log("mount")
        await this.createScene();
        await this.responsiveConfiguration();
        await this.addVisualFilesToScene();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("update");
        if (prevProps.selectedMetaDT !== this.props.selectedMetaDT) {
            console.log("update")
            console.log(scene);
            setTimeout(async () => {
                await SceneManager.removeAllObjectFromScene(scene, camera, renderer);
                await this.addVisualFilesToScene();
            }, 1000)

        }

        if (prevProps.selectedNode !== this.props.selectedNode) {
            this.filterSceneBySelectedNode();
        }
    }

    async componentWillUnmount() {
        window.removeEventListener('resize', () => {
            renderer.setSize(document.querySelector("#visualizeGraph").clientWidth - 30, document.querySelector("#visualizeGraph").clientHeight - 30);
        });

        console.log("unmount");
        await SceneManager.removeAllObjectFromScene(scene, camera, renderer);
    }

    responsiveConfiguration = () => {
        renderer.setSize(document.querySelector("#visualizeGraph").clientWidth - 30, document.querySelector("#visualizeGraph").clientHeight - 30);
        renderer.render(scene, camera);

        window.addEventListener('resize', () => {
            if (document.querySelector("#visualizeGraph") !== null) {
                renderer.setSize(document.querySelector("#visualizeGraph").clientWidth - 30, document.querySelector("#visualizeGraph").clientHeight - 30);
            }
        });
    }

    createScene() {
        scene = SceneManager.createScene();
        camera = SceneManager.createCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = SceneManager.createRenderer(window.devicePixelRatio, 555, 650);

        const sceneManager = new SceneManager(scene, camera, renderer);
        sceneManager.setCameraPosition(7.6, 5.3, 6.7)
        sceneManager.setCameraRotation(-0.2, 0.8, 0.2);

        document.getElementById("visualizeArea").appendChild(renderer.domElement);

        controls = sceneManager.createOrbitControl(camera, renderer.domElement);
        controls.addEventListener("change", () => {
            renderer.render(scene, camera);
        });

        sceneManager.addGridToScene(20, 20, 0x888888, 0x444444);
        sceneManager.addLightToScene(0xffeeee, 0x111122);

        renderer.render(scene, camera);
    }

    addVisualFilesToScene = async () => {
        const sceneManager = new SceneManager(scene, camera, renderer);
        let currentItem = JSON.parse(JSON.stringify(this.props.selectedMetaDT));
        console.log("currentItem", currentItem);

        if (currentItem.visual) {
            await sceneManager.addColladaFile(currentItem.visual);
        }

        if (currentItem["children"] === undefined) {
            return;
        }

        currentItem["children"].forEach(async child => {
            await createNodesAndLinks(child);
        })

        async function createNodesAndLinks(child) {
            if (child.visual) {
                await sceneManager.addColladaFile(child.visual);
            }

            if (child["children"]) {
                child["children"].forEach(async subChild => {
                    await createNodesAndLinks(subChild);
                })
            }
        }
    }

    filterSceneBySelectedNode = () => {
        console.log("filter")
        const { selectedNode } = this.props;
        const names = [];

        if (selectedNode.visual) {
            names.push(selectedNode.visual.fileNameWithExtension);
        }

        if (selectedNode.children) {
            selectedNode.children.forEach(child => {
                iterateNodes(child);
            })
        }

        function iterateNodes(child) {
            if (child.visual) {
                names.push(child.visual.fileNameWithExtension)
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    iterateNodes(subChild);
                })
            }
        }

        const sceneManager = new SceneManager(scene, camera, renderer);
        sceneManager.setVisibleNodes(names);
    }

    render() {
        return (
            <Panel>
                <Panel.Body size={ComponentSize.ExtraSmall} id={"visualizeGraph"}>
                    <div id="visualizeArea"></div>
                </Panel.Body>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedMetaDT: state.metadt.selectedMetaDT,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaDTRightPart);