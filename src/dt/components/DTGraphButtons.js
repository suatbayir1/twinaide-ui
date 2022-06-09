// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Form, Button, Grid, Columns, ButtonType, ComponentColor, Dropdown, IconFont,
    ComponentStatus,
} from '@influxdata/clockface'
import DigitalTwinDetailAndEditOverlay from '../overlays/DigitalTwinDetailAndEditOverlay';
import DTImport3DModel from '../overlays/DTImport3DModel';

// Constants
import { graphTypeList } from "../../shared/constants/constants";

// Utilities
import { getDTOwnerAccess } from "../../shared/auth/access";

// Actions
import { setVisualizeSensorDataOverlay } from "../../store/index";

class DTGraphButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleDTDetailAndEditOverlay: false,
            visibleDTImport3DModel: false,
            mode: "",
        }
    }

    render() {
        const { selectedGraphType, handleChangeGraphType, selectedDT, user, selectedNode } = this.props;
        const { visibleDTDetailAndEditOverlay, mode, visibleDTImport3DModel } = this.state;

        return (
            <>
                <DigitalTwinDetailAndEditOverlay
                    visible={visibleDTDetailAndEditOverlay}
                    onClose={() => { this.setState({ visibleDTDetailAndEditOverlay: false }) }}
                    mode={mode}
                    dt={selectedDT}
                />

                <DTImport3DModel
                    visible={visibleDTImport3DModel}
                    onClose={() => { this.setState({ visibleDTImport3DModel: false }) }}
                />

                <Form>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column widthXS={Columns.Twelve}>
                                <div className="dt-graph-buttons">
                                    <Button
                                        text="Add / Edit"
                                        titleText={"Only owner can use this method"}
                                        icon={IconFont.Plus}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Primary}
                                        status={
                                            getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                                ComponentStatus.Default
                                                : ComponentStatus.Disabled
                                        }
                                        onClick={() => {
                                            this.setState({
                                                visibleDTDetailAndEditOverlay: true,
                                                mode: "edit"
                                            })
                                        }}
                                    />

                                    <Button
                                        text="Import 3D Model"
                                        titleText={"Only owner can use this method"}
                                        icon={IconFont.Import}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Primary}
                                        status={
                                            getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                                ComponentStatus.Default
                                                : ComponentStatus.Disabled
                                        }
                                        onClick={() => {
                                            this.setState({
                                                visibleDTImport3DModel: true,
                                                mode: "edit"
                                            })
                                        }}
                                    />

                                    <Dropdown
                                        style={{ width: '150px' }}
                                        button={(active, onClick) => (
                                            <Dropdown.Button
                                                active={active}
                                                icon={IconFont.ShareSolid}
                                                onClick={onClick}
                                                color={ComponentColor.Primary}
                                            >
                                                {selectedGraphType['text']}
                                            </Dropdown.Button>
                                        )}
                                        menu={onCollapse => (
                                            <Dropdown.Menu onCollapse={onCollapse}>
                                                {
                                                    graphTypeList.map(item => {
                                                        return (
                                                            <Dropdown.Item
                                                                id={item['value']}
                                                                key={item['value']}
                                                                value={item}
                                                                onClick={handleChangeGraphType}
                                                            >
                                                                {item['text']}
                                                            </Dropdown.Item>
                                                        )
                                                    })
                                                }
                                            </Dropdown.Menu>
                                        )}
                                    />
                                    {
                                        selectedNode &&
                                        <Button
                                            text="Show Data in Chart"
                                            titleText={"Only owner can use this method"}
                                            icon={IconFont.BarChart}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Secondary}
                                            status={
                                                getDTOwnerAccess(selectedDT.owner, user.id) === true ?
                                                    ComponentStatus.Default
                                                    : ComponentStatus.Disabled
                                            }
                                            onClick={() => { this.props.setVisualizeSensorDataOverlay(true) }}
                                        />
                                    }

                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
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
        setVisualizeSensorDataOverlay: (payload) => dispatch(setVisualizeSensorDataOverlay(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTGraphButtons);