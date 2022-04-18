// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Grid, Columns,
} from '@influxdata/clockface';
import DTMiddlePart from '../components/DTMiddlePart';
import DTLeftPart from '../components/DTLeftPart';

class DT extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedNode: {},
        }
    }

    handleNodeClick = (node) => {
        this.setState({ selectedNode: node })
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
                                <div id="dt-3d-scene">
                                    <Grid.Column
                                        widthXS={Columns.Twelve}
                                        widthSM={Columns.Twelve}
                                        widthMD={Columns.Twelve}
                                        widthLG={Columns.Four}
                                        style={{ marginTop: '20px' }}
                                    >
                                        right
                                    </Grid.Column>
                                </div>

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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DT);