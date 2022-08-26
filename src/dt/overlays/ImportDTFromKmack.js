// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';
import ReactJson from 'react-json-view'

// Components
import {
    Overlay, Form, Button, ComponentColor, ButtonType, ComponentStatus, IconFont,
    Grid, Columns, Input, SelectDropdown, DapperScrollbars,
} from '@influxdata/clockface';

// Actions
import { setImportDTFromKmackOverlay, fetchCreateDT } from "../../store/index";

// Managers
import KmackManager from '../../shared/managers/KmackManager';

class ImportDTFromKmack extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            things: [
                "kr.re.etri.kmac:amr1",
                "kr.re.etri.kmac:amr2",
                "kr.re.etri.kmac:conveyor",
                "kr.re.etri.kmac:env_sensor",
                "kr.re.etri.kmac:st_charging",
                "kr.re.etri.kmac:st_inspection",
                "kr.re.etri.kmac:st_loading",
                "kr.re.etri.kmac:st_unloading",
                "kr.re.etri.kmac:ilmatar",
                "kr.re.etri.kmac:forklift"
            ],
            thing: "",
            thingObject: {}
        }
    }

    async componentDidMount() {
    }

    save = async () => {
        const { username, thing } = this.state;

        if (username.trim().length === 0 || thing.trim().length === 0) {
            NotificationManager.error('Username and thing cannot be empty', 'Error', 3000);
            return;
        }

        const kmackManager = new KmackManager();

        // set token from kmack
        await kmackManager.login(username);

        // Fetch thing by id from kmack
        const thingObject = await kmackManager.fetchThingByID(thing);
        thingObject["name"] = thingObject.thingId;
        thingObject["displayName"] = thingObject.thingId;
        thingObject["type"] = "Factory";
        thingObject["version"] = "1.0";
        thingObject["privacy"] = "public";
        console.log(thingObject);
        this.setState({ thingObject });

        await this.props.fetchCreateDT(thingObject);
    }

    render() {
        const { visible } = this.props;
        const { username, thing, things, thingObject } = this.state;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={"Import DT From KMACK"}
                            onDismiss={() => { this.props.setImportDTFromKmackOverlay(false) }}
                        />
                        <Overlay.Body>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column
                                        widthXS={Columns.Six}
                                    >
                                        <Form.Element
                                            label="Username"
                                            required={true}
                                        >
                                            <Input
                                                icon={IconFont.User}
                                                value={username}
                                                onChange={(e) => { this.setState({ username: e.target.value }) }}
                                            />
                                        </Form.Element>
                                    </Grid.Column>

                                    <Grid.Column
                                        widthXS={Columns.Six}
                                    >
                                        <Form.Element
                                            label="Thing ID"
                                            required={true}
                                        >
                                            <SelectDropdown
                                                buttonIcon={IconFont.Share}
                                                options={things}
                                                selectedOption={thing}
                                                onSelect={(e) => { this.setState({ thing: e }) }}
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
                                                    src={thingObject}
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
                                text={`Import DT From KMACK`}
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
        visible: state.dt.visibleImportDTFromKmackOverlay,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setImportDTFromKmackOverlay: (payload) => dispatch(setImportDTFromKmackOverlay(payload)),
        fetchCreateDT: (payload) => dispatch(fetchCreateDT(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportDTFromKmack);