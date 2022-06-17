// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Grid, Columns,
} from '@influxdata/clockface';
import MetaDTMiddlePart from '../components/MetaDTMiddlePart';
import MetaDTLeftPart from '../components/MetaDTLeftPart';
import MetaDTRightPart from '../components/MetaDTRightPart';

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
        const { selectedMetaDT: metadt } = this.props;
        const { selectedNode } = this.state;

        return (
            <>
                <Page>
                    <Page.Header fullWidth={true}>
                        <Page.Title title={`Meta Digital Twin Monitor: ${metadt?.displayName}`} />
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
                                    <MetaDTLeftPart
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
                                    <MetaDTMiddlePart
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
                                    <MetaDTRightPart
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
        selectedMetaDT: state.metadt.selectedMetaDT,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedNode: (payload) => dispatch(setSelectedNode(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DT);