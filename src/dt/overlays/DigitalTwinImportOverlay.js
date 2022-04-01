// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import DragAndDrop from "../../shared/components/DragAndDrop";
import { NotificationManager } from 'react-notifications';

// Components
import {
    Overlay, Form, SelectGroup, Button, ComponentColor, ButtonType, ComponentStatus
} from '@influxdata/clockface';

// Actions
import { fetchCreateDT } from "../../store/index";

class DigitalTwinImportOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedImportOption: "upload",
            isJsonCorrect: false,
            dtJSON: "",
            fileContent: "",
        }
    }

    handleSetImportOption = (value) => {
        this.setState({ selectedImportOption: value });
    }

    setFileContent = (content) => {
        this.setState({ fileContent: content });
    }

    submit = () => {
        const { selectedImportOption, fileContent, isJsonCorrect, dtJSON } = this.state;
        const { fetchCreateDT } = this.props;
        let jsonContent;

        switch (selectedImportOption) {
            case "upload":
                if (fileContent === "") {
                    NotificationManager.error("Please select a file first", "Upload File", 3000);
                    return;
                }

                jsonContent = fileContent;
                break;
            case "paste":
                if (isJsonCorrect !== false || dtJSON === "") {
                    NotificationManager.error("Please provide a valid JSON", "Provide JSON", 3000);
                    return;
                }

                jsonContent = dtJSON;
                break;
            default:
                break;
        }

        fetchCreateDT(JSON.parse(jsonContent));
    }

    render() {
        const { selectedImportOption } = this.state;
        const { onClose, visible } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={"Import Digital Twin"}
                            onDismiss={onClose}
                        />
                        <Overlay.Body>
                            <div className="import--options">
                                <SelectGroup>
                                    <SelectGroup.Option
                                        name="import-mode"
                                        active={selectedImportOption === "upload"}
                                        value={"upload"}
                                        onClick={this.handleSetImportOption}
                                        titleText="Upload"
                                    >
                                        Upload File
                                    </SelectGroup.Option>
                                    <SelectGroup.Option
                                        name="import-mode"
                                        active={selectedImportOption === "paste"}
                                        value={"paste"}
                                        onClick={this.handleSetImportOption}
                                        titleText="Paste"
                                    >
                                        Paste JSON
                                    </SelectGroup.Option>
                                </SelectGroup>
                            </div>
                            {
                                selectedImportOption === "upload"
                                    ? <DragAndDrop
                                        setFileContent={this.setFileContent}
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
                        </Overlay.Body>
                        <Overlay.Footer>
                            <Button
                                text={`Import JSON as Digital Twin`}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCreateDT: (payload) => dispatch(fetchCreateDT(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DigitalTwinImportOverlay);