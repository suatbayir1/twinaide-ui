// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Form, Button, Grid, Columns, ButtonType, ComponentColor, Dropdown, IconFont,
    ComponentStatus,
} from '@influxdata/clockface'
// import DigitalTwinDetailAndEditOverlay from '../overlays/DigitalTwinDetailAndEditOverlay';
// import DTImport3DModel from '../overlays/DTImport3DModel';

// Constants
import { graphTypeList } from "../../shared/constants/constants";

// Utilities
import { getDTOwnerAccess } from "../../shared/auth/access";

// Actions
import { setVisualizeSensorDataOverlay } from "../../store/index";

class MetaDTGraphButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleDTDetailAndEditOverlay: false,
            visibleDTImport3DModel: false,
            mode: "",
        }
    }

    render() {
        const { selectedGraphType, handleChangeGraphType, selectedMetaDT, user, selectedNode } = this.props;

        return (
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column widthXS={Columns.Twelve}>
                            <div className="dt-graph-buttons">
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
                                            getDTOwnerAccess(selectedMetaDT.owner._id, user.id) === true ?
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
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedMetaDT: state.metadt.selectedMetaDT,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setVisualizeSensorDataOverlay: (payload) => dispatch(setVisualizeSensorDataOverlay(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaDTGraphButtons);