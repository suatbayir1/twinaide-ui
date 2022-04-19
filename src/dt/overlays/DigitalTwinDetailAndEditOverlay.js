// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { NotificationManager } from 'react-notifications';

// Components
import {
    Overlay, Form, Button, ComponentColor, ButtonType, ComponentStatus, IconFont
} from '@influxdata/clockface';

// Helpers
import { exportJSON } from "../../shared/helpers/FileExport";
import { getDTOwnerAccess } from "../../shared/auth/access";

// Actions
import { fetchUpdateDT } from "../../store/index";

class DigitalTwinDetailAndEditOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isJsonCorrect: false,
            dtJSON: "",
        }
    }

    updateDT = async () => {
        const { dtJSON } = this.state;
        const { dt, user, fetchUpdateDT, selectedDT } = this.props;

        if (!getDTOwnerAccess(selectedDT.owner, user.id)) {
            NotificationManager.error("Only owner can change this DT description", 'Permission Denied', 3000);
            return;
        }

        if (dtJSON.trim() === "") {
            NotificationManager.error("Please make a change to the digital twin document first", 'No change detected', 3000);
            return;
        }

        let payload = JSON.parse(dtJSON);
        delete payload["_id"];
        delete payload["_v"];
        delete payload["name"];
        delete payload["id"];

        await fetchUpdateDT(dt._id, payload);
    }

    render() {
        const { onClose, visible, mode, selectedDT } = this.props;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={mode === "detail" ? `Detail: ${selectedDT.displayName}` : `Edit: ${selectedDT.displayName}`}
                            onDismiss={onClose}
                        />
                        <Overlay.Body>
                            <div style={{ maxWidth: "1400px", maxHeight: "100%" }}>
                                <JSONInput
                                    theme="dark_vscode_tribute"
                                    placeholder={selectedDT}
                                    locale={locale}
                                    onChange={(e) => { this.setState({ dtJSON: e.json, isJsonCorrect: e.error }) }}
                                    viewOnly={mode === "detail" ? true : false}
                                    colors={{
                                        string: "#DAA520"
                                    }}
                                    height="400px"
                                    width="100%"
                                />
                            </div>
                        </Overlay.Body>
                        <Overlay.Footer>
                            {
                                mode === "edit" &&
                                <Button
                                    text={`Save Metadata`}
                                    color={ComponentColor.Primary}
                                    status={ComponentStatus.Default}
                                    type={ButtonType.Submit}
                                    icon={IconFont.Checkmark}
                                    onClick={this.updateDT}
                                />
                            }
                            <Button
                                text={`Download as JSON File`}
                                color={ComponentColor.Secondary}
                                status={ComponentStatus.Default}
                                type={ButtonType.Submit}
                                icon={IconFont.Download}
                                onClick={() => { exportJSON(selectedDT["name"], selectedDT) }}
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
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUpdateDT: (id, payload) => dispatch(fetchUpdateDT(id, payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DigitalTwinDetailAndEditOverlay);