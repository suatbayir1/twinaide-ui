// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Page, Grid, Columns,
} from '@influxdata/clockface';

class DT extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        const { selectedDT: dt } = this.props;

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
                                    widthLG={Columns.Two}
                                    style={{ marginTop: '20px' }}
                                >
                                    left
                                </Grid.Column>
                                <Grid.Column
                                    widthXS={Columns.Twelve}
                                    widthSM={Columns.Twelve}
                                    widthMD={Columns.Eight}
                                    widthLG={Columns.Six}
                                    style={{ marginTop: '20px' }}
                                >
                                    middle
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