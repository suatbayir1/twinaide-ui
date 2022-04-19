// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Form, Button, Grid, Columns, ButtonType, ComponentColor, Dropdown, IconFont,
    ComponentStatus,
} from '@influxdata/clockface'
import DigitalTwinDetailAndEditOverlay from '../overlays/DigitalTwinDetailAndEditOverlay';

// Constants
import { graphTypeList } from "../../shared/constants/constants";

// Utilities
import { getDTOwnerAccess } from "../../shared/auth/access";

class DTGraphButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleDTDetailAndEditOverlay: false,
            mode: "",
        }
    }

    render() {
        const { selectedGraphType, handleChangeGraphType, selectedDT, user } = this.props;
        const { visibleDTDetailAndEditOverlay, mode } = this.state;

        return (
            <>
                <DigitalTwinDetailAndEditOverlay
                    visible={visibleDTDetailAndEditOverlay}
                    onClose={() => { this.setState({ visibleDTDetailAndEditOverlay: false }) }}
                    mode={mode}
                    dt={selectedDT}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTGraphButtons);