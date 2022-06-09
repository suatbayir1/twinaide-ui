// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Grid, Columns,
} from '@influxdata/clockface';
import DTMiddlePart from '../components/DTMiddlePart';
import DTLeftPart from '../components/DTLeftPart';
import DTRightPart from '../components/DTRightPart';

// Actions
import { setSelectedNode } from '../../store/index';

class DT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedNode: {},
        }
    }

    handleNodeClick = async (node) => {
        const obj = await node;
        const clone = await (({ childLinks, collapsed, fx, fy, vx, vy, x, y, index, color, __indexColor, __v, ...o }) => o)(obj)
        this.setState({ selectedNode: node })
        this.props.setSelectedNode(clone);
    }

    render() {
        const { selectedDT: dt } = this.props;
        const { selectedNode } = this.state;

        return (
            <>
                <Page>
                    <Page.Header fullWidth={true}>
                        <Page.Title title={`Digital Twin Monitor: ${dt?.displayName}`} />
                    </Page.Header>

                    <Page.Contents
                        fullWidth={true}
                        scrollable={true}
                    >
                        <Grid>
                            <Grid.Row>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Twelve}
                                    widthMD={Columns.Four}
                                    widthLG={Columns.Three}
                                    style={{ marginTop: '20px' }}
                                >
                                    <DTLeftPart
                                        selectedNode={selectedNode}
                                    />
                                </Grid.Column>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Twelve}
                                    widthMD={Columns.Eight}
                                    widthLG={Columns.Five}
                                    style={{ marginTop: '20px' }}
                                >
                                    <DTMiddlePart
                                        selectedNode={selectedNode}
                                        handleNodeClick={this.handleNodeClick}
                                    />
                                </Grid.Column>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Twelve}
                                    widthMD={Columns.Twelve}
                                    widthLG={Columns.Four}
                                    style={{ marginTop: '20px' }}
                                >
                                    <DTRightPart
                                        selectedNode={selectedNode}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Page.Contents>
                </Page>
            </>
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
        setSelectedNode: (payload) => dispatch(setSelectedNode(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DT);