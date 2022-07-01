// Libraries
import React, { PureComponent } from 'react'
import { connect } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import GeneralDragAndDrop from "../../shared/components/GeneralDragAndDrop";
import { NotificationManager } from 'react-notifications';

// Components
import {
    Overlay, Form, Grid, Button, ComponentColor, Dropdown, ColorPicker,
    ButtonType, ComponentStatus, IconFont, Columns, Input, InputType
} from '@influxdata/clockface';

// Actions
import { fetchReplaceDTWithNewDocument, fetchUploadDTVisualFile } from "../../store/index";

class DTImport3DModel extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedImportOption: "upload",
            isJsonCorrect: false,
            dtJSON: "",
            file: null,
            filename: "",
            assets: [],
            selectedAsset: {},
            color: "#eeeff2",
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
        }
    }

    async componentDidMount() {
        await this.createAssetList();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedDT !== this.props.selectedDT) {
            await this.createAssetList();
        }
    }

    createAssetList = () => {
        let currentItem = JSON.parse(JSON.stringify(this.props.selectedDT));
        const nodes = [];

        nodes.push({ name: currentItem?.name, displayName: currentItem.displayName });

        if (currentItem["children"] === undefined) {
            return;
        }

        currentItem["children"].forEach(child => {
            createNodesAndLinks(currentItem, child);
        })

        function createNodesAndLinks(parent, child) {
            nodes.push({ name: child?.name, displayName: child.displayName });

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    createNodesAndLinks(child, subChild);
                })
            }
        }

        this.setState({ assets: nodes });
    }

    handleSetImportOption = (value) => {
        this.setState({ selectedImportOption: value });
    }

    setFile = (file) => {
        this.setState({ file });
    }

    submit = async () => {
        const { selectedDT, fetchUploadDTVisualFile } = this.props;
        const { selectedAsset, file, filename, positionX, positionY, positionZ, scaleX, scaleY, scaleZ, color } = this.state;

        if (filename.trim() === "" || Object.keys(selectedAsset).length <= 0 || file === null) {
            NotificationManager.error("Please fill out the form completely", 'Error', 3000);
            return;
        }

        const fileExtension = file?.name.split('.').pop();
        const fileNameWithExtension = `${filename}.${fileExtension}`;

        const formData = new FormData();
        var blob = file.slice(0, file.size, file.type);
        let newFile = new File([blob], fileNameWithExtension, { type: file.type });

        formData.append("file", newFile);

        iterateDT(selectedDT);

        function iterateDT(child) {
            if (child.name === selectedAsset.name) {
                child["visual"] = {
                    fileNameWithExtension,
                    positionX,
                    positionY,
                    positionZ,
                    scaleX,
                    scaleY,
                    scaleZ,
                    color
                }
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    iterateDT(subChild);
                })
            }
        }

        await fetchUploadDTVisualFile(selectedDT._id, formData, selectedDT);
    }

    render() {
        const {
            selectedImportOption, assets, selectedAsset, filename, color,
            positionX, positionY, positionZ, scaleX, scaleY, scaleZ
        } = this.state;
        const { onClose, visible } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={"Import 3D Model"}
                            onDismiss={onClose}
                        />
                        <Overlay.Body>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element
                                        required={true}
                                        label={"Asset"}
                                    >
                                        <Dropdown
                                            button={(active, onClick) => (
                                                <Dropdown.Button
                                                    active={active}
                                                    onClick={onClick}
                                                    color={ComponentColor.Default}
                                                >
                                                    {selectedAsset["displayName"]}
                                                </Dropdown.Button>
                                            )}
                                            menu={onCollapse => (
                                                <Dropdown.Menu onCollapse={onCollapse}>
                                                    {
                                                        assets.map((item, idx) => {
                                                            return (
                                                                <Dropdown.Item
                                                                    key={idx}
                                                                    value={item}
                                                                    onClick={(e) => { this.setState({ selectedAsset: e }) }}
                                                                >
                                                                    {item['displayName']}
                                                                </Dropdown.Item>
                                                            )
                                                        })
                                                    }
                                                </Dropdown.Menu>
                                            )}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element
                                        label="File Name"
                                        required={true}
                                    >
                                        <Input
                                            onChange={(e) => { this.setState({ filename: e.target.value }) }}
                                            value={filename}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Six}>
                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Position X"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ positionX: e.target.value }) }}
                                                value={positionX}
                                                type={InputType.Number}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Position Y"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ positionY: e.target.value }) }}
                                                value={positionY}
                                                type={InputType.Number}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Position Z"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ positionZ: e.target.value }) }}
                                                value={positionZ}
                                                type={InputType.Number}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Scale X"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ scaleX: e.target.value }) }}
                                                value={scaleX}
                                                type={InputType.Number}
                                                min={1}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Scale Y"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ scaleY: e.target.value }) }}
                                                value={scaleY}
                                                type={InputType.Number}
                                                min={1}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column widthXS={Columns.Four}>
                                        <Form.Element
                                            label={"Scale Z"}
                                            required={true}
                                        >
                                            <Input
                                                onChange={(e) => { this.setState({ scaleZ: e.target.value }) }}
                                                value={scaleZ}
                                                type={InputType.Number}
                                                min={1}
                                            />
                                        </Form.Element>
                                    </Grid.Column>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Six}>
                                    <Form.Element
                                        label={"Color"}
                                        required={true}
                                    >
                                        <ColorPicker
                                            color={color}
                                            onChange={(e) => { this.setState({ color: e }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                            </Grid.Row>


                            <Grid.Row>
                                {
                                    selectedImportOption === "upload"
                                        ? <GeneralDragAndDrop
                                            setFile={this.setFile}
                                        />
                                        : <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                                            <JSONInput
                                                theme="dark_vscode_tribute"
                                                locale={locale}
                                                onChange={(e) => { this.setState({ dtJSON: e.json, isJsonCorrect: e.error }) }}
                                                colors={{
                                                    string: "#DAA520"
                                                }}
                                                height="300px"
                                                width="100%"
                                            />
                                        </div>
                                }
                            </Grid.Row>
                        </Overlay.Body>
                        <Overlay.Footer>
                            <Button
                                text={`Save 3D Model`}
                                icon={IconFont.Import}
                                color={ComponentColor.Primary}
                                status={ComponentStatus.Default}
                                type={ButtonType.Submit}
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
        selectedDT: state.dt.selectedDT,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchReplaceDTWithNewDocument: (id, payload) => dispatch(fetchReplaceDTWithNewDocument(id, payload)),
        fetchUploadDTVisualFile: (id, payload, selectedDT) => dispatch(fetchUploadDTVisualFile(id, payload, selectedDT)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTImport3DModel);