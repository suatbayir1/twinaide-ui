// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import ReactJson from 'react-json-view'

// Components
import {
    Overlay, Form, Button, ComponentColor, ButtonType, ComponentStatus, IconFont,
    Dropdown, Grid, Columns, DapperScrollbars, Alert,
} from '@influxdata/clockface';

// Actions
import { fetchCreateDT, setImportDTFromTwinbaseOverlay, fetchGetDTsFromTwinbase } from "../../store/index";

// Managers
import TwinbaseManager from '../../shared/managers/TwinbaseManager';

class ImportDTFromTwinbase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDT: {},
            metadataOfSelectedDT: {},
            createdDT: {},
        }
    }

    async componentDidMount() {
        this.props.fetchGetDTsFromTwinbase();
    }

    fetchMetaDataOfSelectedDT = async () => {
        const { selectedDT } = this.state;

        let metadata = await TwinbaseManager.fetchMetadataOfDT(selectedDT.url);
        var createdDT = await (({ relations, ...o }) => o)(metadata)
        createdDT["name"] = metadata.name.replace(" ", "_");
        createdDT["displayName"] = metadata.name;
        createdDT["type"] = "Factory";
        createdDT["version"] = "1.0";
        createdDT["privacy"] = "public";
        var vm = this;

        if (metadata.relations) {
            for (const relation of metadata.relations) {
                if (relation.relationType === "child") {
                    await fetchChilds(metadata["dt-id"], relation["dt-id"])
                }
            }
        }

        async function fetchChilds(parentID, childID) {
            let childDoc = await TwinbaseManager.fetchMetadataByID({ "dt-id": childID });
            let childJSON = JSON.parse(childDoc.data.data);

            await setChildToParent(createdDT, parentID, childJSON);

            if (childJSON.relations) {
                for (let relation of childJSON.relations) {
                    if (relation.relationType === "child") {
                        await fetchChilds(childJSON["dt-id"], relation["dt-id"])
                    }
                }
            }
        }

        async function setChildToParent(currentItem, parentID, childJSON) {
            if (currentItem["dt-id"] === parentID) {
                if (currentItem.children === undefined) {
                    currentItem["children"] = [];
                }
                var clone = await (({ relations, ...o }) => o)(childJSON)
                clone["name"] = childJSON.name.replace(" ", "_");
                clone["displayName"] = childJSON.name;
                await currentItem.children.push(clone);
                vm.setState({ createdDT });
            }

            if (currentItem.children) {
                for (let subChild of currentItem.children) {
                    await setChildToParent(subChild, parentID, childJSON);
                }
            }
        }

        this.setState({ createdDT });
    }

    save = async () => {
        await this.props.fetchCreateDT(this.state.createdDT);
    }

    render() {
        const { visible, twinbaseDTs } = this.props;
        const { selectedDT } = this.state;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={"Import DT From Twinbase"}
                            onDismiss={() => { this.props.setImportDTFromTwinbaseOverlay(false) }}
                        />
                        <Overlay.Body>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column
                                        widthXS={Columns.Twelve}
                                    >
                                        <Alert color={ComponentColor.Success} icon={IconFont.AlertTriangle}>
                                            Please select the digital twins you want to use from the list below and wait the combined all digital twins in a single JSON object.
                                        </Alert>

                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column
                                        widthXS={Columns.Twelve}
                                    >
                                        <Form.Element
                                            label="Select Digital Twin"
                                            required={true}
                                        >
                                            <Dropdown
                                                button={(active, onClick) => (
                                                    <Dropdown.Button
                                                        onClick={onClick}
                                                        active={active}
                                                    >
                                                        {selectedDT.name}
                                                    </Dropdown.Button>
                                                )}
                                                menu={onCollapse => (
                                                    <Dropdown.Menu onCollapse={onCollapse}>
                                                        {twinbaseDTs.map((item, idx) => (
                                                            <Dropdown.Item
                                                                key={idx}
                                                                value={item}
                                                                onClick={(e) => {
                                                                    this.setState(
                                                                        { selectedDT: e },
                                                                        () => this.fetchMetaDataOfSelectedDT()
                                                                    )
                                                                }}
                                                                selected={item.key === ""}
                                                            >
                                                                {item.name}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                )}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column
                                        widthXS={Columns.Twelve}
                                    >
                                        <Form.Element
                                            label="Metadata Of Selected DT"
                                        >
                                            <DapperScrollbars
                                                autoHide={false}
                                                noScrollX={true}
                                                autoSizeHeight={true}
                                                style={{ maxHeight: '500px' }}
                                                className="data-loading--scroll-content"
                                            >
                                                <ReactJson
                                                    src={this.state.createdDT}
                                                    name={"Metadata"}
                                                    theme={"monokai"}
                                                    iconStyle={"triangle"}
                                                    indentWidth={3}
                                                    collapsed={false}
                                                    groupArraysAfterLength={100}
                                                    enableClipboard={false}
                                                    displayObjectSize={false}
                                                    displayDataTypes={false}
                                                    defaultValue={null}
                                                    sortKeys={false}
                                                    quotesOnKeys={false}
                                                    validationMessage={"Please check your inputs"}
                                                    displayArrayKey={true}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                />
                                            </DapperScrollbars>
                                        </Form.Element>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Overlay.Body>
                        <Overlay.Footer>
                            <Button
                                icon={IconFont.Import}
                                text={`Import DT From Twinbase`}
                                color={ComponentColor.Primary}
                                status={ComponentStatus.Default}
                                type={ButtonType.Submit}
                                onClick={this.save}
                            />
                        </Overlay.Footer>
                    </Form>
                </Overlay.Container>
            </Overlay>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        visible: state.dt.visibleImportDTFromTwinbaseOverlay,
        twinbaseDTs: state.dt.twinbaseDTs
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCreateDT: (payload) => dispatch(fetchCreateDT(payload)),
        fetchGetDTsFromTwinbase: () => dispatch(fetchGetDTsFromTwinbase()),
        setImportDTFromTwinbaseOverlay: (payload) => dispatch(setImportDTFromTwinbaseOverlay(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportDTFromTwinbase);