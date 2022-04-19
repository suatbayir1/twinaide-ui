// Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import ReactJson from 'react-json-view'
import { NotificationManager } from "react-notifications";

// Components
import {
    DapperScrollbars,
} from '@influxdata/clockface'

// Utilities
import { getDTOwnerAccess } from "../../shared/auth/access";
import { immutableDTKeys } from "../../shared/constants/constants"

// Actions
import { fetchUpdateDT, fetchReplaceDTWithNewDocument } from "../../store/index";

class DTGeneralInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json: {},
        }
    }

    componentDidMount() {
        this.setJSON();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedNode !== this.props.selectedNode) {
            this.setJSON();
        }
    }

    setJSON = async () => {
        const obj = await this.props.selectedNode
        const clone = await (({ childLinks, children, collapsed, fx, fy, vx, vy, x, y, index, color, __indexColor, __v, ...o }) => o)(obj)
        this.setState({ json: clone });
    }

    onEdit = (json) => {
        if (immutableDTKeys.includes(json.name)) {
            NotificationManager.error(`You cannot changed the property: ${json.name}`, 'Immutable Property', 3000);
            return false;
        }

        this.updateDT(json);
    }

    onAdd = (json) => {
        if (json.existing_src.type === "Factory") {
            NotificationManager.error(`You cannot add new property to root node: ${json.name}`, 'Permission Denied', 3000);
            return false;
        }

        this.updateDT(json);
    }

    onDelete = (json) => {
        if (json.existing_src.type === "Factory") {
            NotificationManager.error(`You cannot delete this property from root node: ${json.name}`, 'Permission Denied', 3000);
            return false;
        }

        if (immutableDTKeys.includes(json.name)) {
            NotificationManager.error(`You cannot deleted the property: ${json.name}`, 'Immutable Property', 3000);
            return false;
        }

        console.log("json", json);

        this.deletePropertyFromDT(json);
    }

    updateDT = async (updatedJSON) => {
        const { fetchUpdateDT, selectedDT } = this.props;

        iterateDT(selectedDT);

        function iterateDT(child) {
            if (child.name === updatedJSON.existing_src.name) {
                Object.assign(child, updatedJSON.updated_src);
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    iterateDT(subChild);
                })
            }
        }

        let payload = JSON.parse(JSON.stringify(selectedDT));
        delete payload["_id"];
        delete payload["_v"];
        delete payload["name"];
        delete payload["id"];

        await fetchUpdateDT(selectedDT._id, payload);
    }

    deletePropertyFromDT = async (updatedJSON) => {
        const { fetchReplaceDTWithNewDocument, selectedDT } = this.props;

        iterateDT(selectedDT);

        function iterateDT(child) {
            if (child.name === updatedJSON.existing_src.name) {
                delete child[updatedJSON.name];
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    iterateDT(subChild);
                })
            }
        }

        await fetchReplaceDTWithNewDocument(selectedDT._id, selectedDT);
    }

    render() {
        const { json } = this.state;
        const { selectedDT, user } = this.props;

        return (
            <>
                <DapperScrollbars
                    autoHide={false}
                    noScrollX={true}
                    autoSizeHeight={true}
                    style={{ maxHeight: '800px' }}
                    className="data-loading--scroll-content"
                >
                    <ReactJson
                        src={json}
                        name={"selectedNode"}
                        theme={"monokai"}
                        iconStyle={"triangle"}
                        indentWidth={3}
                        collapsed={false}
                        collapseStringsAfterLength={30}
                        groupArraysAfterLength={100}
                        enableClipboard={true}
                        displayObjectSize={true}
                        displayDataTypes={true}
                        onEdit={
                            getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                this.onEdit
                                : false
                        }
                        onAdd={
                            getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                this.onAdd
                                : false
                        }
                        defaultValue={null}
                        onDelete={
                            getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                this.onDelete
                                : false
                        }
                        sortKeys={false}
                        quotesOnKeys={false}
                        validationMessage={"Please check your inputs"}
                        displayArrayKey={true}
                        style={{
                            width: "100%",
                        }}
                    />
                </DapperScrollbars>
            </>
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
        fetchReplaceDTWithNewDocument: (id, payload) => dispatch(fetchReplaceDTWithNewDocument(id, payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTGeneralInformation);