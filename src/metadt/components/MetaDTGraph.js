// Libraries
import React, { Component } from 'react'
import ForceGraph2D from "react-force-graph-2d"
import * as d3 from "d3";
import { connect } from "react-redux";

// Components
import {
    TechnoSpinner, SpinnerContainer, RemoteDataState, Panel, ComponentSize,
} from '@influxdata/clockface'

class MetaDTGraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinnerLoading: RemoteDataState.Loading,
            prunedTree: {
                nodes: [],
                links: [],
            },
            nodesById: {
                nodes: [],
                links: [],
            },
        }
    }

    handleNodeRightClick = (node) => {
        node.collapsed = !node.collapsed;
        this.getPrunedTree();
    }

    async componentDidMount() {
        await this.createGraph();
        this.responsiveConfiguration();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedMetaDT !== this.props.selectedMetaDT) {
            await this.createGraph();
            this.responsiveConfiguration();
        }
    }

    async componentWillUnmount() {
        window.removeEventListener('resize', () => {
            this.setState({
                graphWidth: document.querySelector("#graphDiv").clientWidth - 30
            })
        });
    }

    responsiveConfiguration = () => {
        this.setState({
            graphWidth: document.querySelector("#graphDiv").clientWidth - 30
        })
        window.addEventListener('resize', () => {
            if (document.querySelector("#graphDiv") !== null) {
                this.setState({
                    graphWidth: document.querySelector("#graphDiv").clientWidth - 30
                })
            }
        });
    }

    createGraph = async () => {
        let selectedMetaDT = JSON.parse(JSON.stringify(this.props.selectedMetaDT));
        const nodes = [];
        const links = [];
        let currentItem = selectedMetaDT;
        let tempNode = {};

        tempNode = selectedMetaDT;
        tempNode["id"] = selectedMetaDT.name;
        nodes.push(tempNode);

        if (currentItem["children"] === undefined) {
            return;
        }

        currentItem["children"].forEach(child => {
            createNodesAndLinks(currentItem, child, child.name, true);
        })

        function createNodesAndLinks(parent, child, rootDT, first) {
            tempNode = child;
            tempNode["id"] = `${rootDT}_${child.name}`;
            nodes.push(tempNode);

            links.push({
                source: first ? parent?.name : `${rootDT}_${parent?.name}`,
                target: `${rootDT}_${child?.name}`
            });

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    createNodesAndLinks(child, subChild, rootDT, false);
                })
            }
        }

        const returnData = {
            nodes,
            links
        }

        // Set NodesById for collapse / expand
        const rootId = selectedMetaDT.name;
        const nodesById = Object.fromEntries(
            returnData["nodes"].map((node) => [node.id, node])
        );

        returnData["nodes"].forEach((node) => {
            node["collapsed"] = node.id !== rootId;
            node["childLinks"] = [];
        });

        returnData["links"].forEach((link) => {
            nodesById[link.source]["childLinks"].push(link)
        });

        this.setState({
            data: returnData,
            prunedTree: returnData,
            constantData: returnData,
            nodesById: nodesById,
            spinnerLoading: RemoteDataState.Done
        })

        this.graphRef.zoom(2, 1000);
        this.graphRef.d3Force('collide', d3.forceCollide(5));
    }

    getPrunedTree = () => {
        const { selectedMetaDT } = this.props;
        const rootId = selectedMetaDT.name;
        const nodesById = this.state.nodesById;
        const visibleNodes = [];
        const visibleLinks = [];

        (function traverseTree(node = nodesById[rootId]) {
            visibleNodes.push(node);
            if (node["collapsed"]) return;
            visibleLinks.push(...node["childLinks"]);
            node["childLinks"]
                .map((link) =>
                    typeof link.target === "object" ? link.target : nodesById[link.target]
                )
                .forEach(traverseTree);
        })();

        let visibleData = {
            nodes: visibleNodes,
            links: visibleLinks,
        }

        this.setState({ prunedTree: visibleData });
    };


    nodeCanvasObject = (node, ctx) => {
        const { selectedNode } = this.props;

        if (selectedNode["id"] === node["id"]) {
            ctx.strokeStyle = '#f00';
            ctx.lineWidth = 1;
            ctx.strokeRect(node.x - 4, node.y - 4, 8, 8);
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color
        ctx.fill();
    }

    render() {
        const { spinnerLoading, prunedTree } = this.state;
        const { selectedGraphType } = this.props;

        return (
            <Panel.Body size={ComponentSize.ExtraSmall} id={"graphDiv"}>

                <SpinnerContainer
                    loading={spinnerLoading}
                    spinnerComponent={<TechnoSpinner />}
                />

                <ForceGraph2D
                    ref={element => { this.graphRef = element }}
                    onNodeClick={this.props.handleNodeClick}
                    onNodeRightClick={this.handleNodeRightClick}
                    linkColor={() => "rgb(6, 111, 197)"}
                    linkWidth={3}
                    width={this.state.graphWidth}
                    height={600}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleWidth={3}
                    linkDirectionalArrowRelPos={1}
                    dagMode={selectedGraphType['value']}
                    dagLevelDistance={50}
                    graphData={prunedTree}
                    d3VelocityDecay={0.3}
                    nodeCanvasObject={this.nodeCanvasObject}
                    nodeAutoColorBy={d => d.id % 12}
                />
            </Panel.Body>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedDT: state.dt.selectedDT,
        selectedMetaDT: state.metadt.selectedMetaDT,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaDTGraph);