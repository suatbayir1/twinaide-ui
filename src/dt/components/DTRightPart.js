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

class DTRightPart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinnerLoading: RemoteDataState.Loading
        }
    }

    async componentDidMount() {
        await this.createScene();
        await this.responsiveConfiguration();
        await this.addVisualFilesToScene();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedDT !== this.props.selectedDT) {
            await SceneManager.removeAllObjectFromScene(scene, camera, renderer);
            await this.addVisualFilesToScene();
        }

        if (prevProps.selectedNode !== this.props.selectedNode) {
            this.filterSceneBySelectedNode();
        }
    }

    async componentWillUnmount() {
        window.removeEventListener('resize', () => {
            renderer.setSize(document.querySelector("#visualizeGraph").clientWidth - 30, document.querySelector("#visualizeGraph").clientHeight - 30);
        });
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
        let currentItem = JSON.parse(JSON.stringify(this.props.selectedDT));

        if (currentItem.visual) {
            sceneManager.addColladaFile(currentItem.visual);
        }

        if (currentItem["children"] === undefined) {
            return;
        }

        currentItem["children"].forEach(child => {
            createNodesAndLinks(child);
        })

        function createNodesAndLinks(child) {
            if (child.visual) {
                sceneManager.addColladaFile(child.visual);
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    createNodesAndLinks(subChild);
                })
            }
        }
    }

    filterSceneBySelectedNode = () => {
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
        selectedDT: state.dt.selectedDT,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTRightPart);