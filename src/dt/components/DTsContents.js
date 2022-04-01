// Libraries
import React, { Component } from 'react'

// Components
import {
    Grid, Columns, EmptyState, ComponentSize, Button, ButtonType,
    ComponentColor, IconFont
} from '@influxdata/clockface';
import DTsCard from './DTsCard';

class DTsContents extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        const { dts } = this.props;

        return (
            <>
                {
                    dts.length > 0 ?
                        <Grid>
                            {
                                dts.map((dt, idx) =>
                                    <Grid.Column
                                        widthSM={Columns.Three}
                                        style={{ padding: 2 }}
                                        key={idx}
                                    >
                                        <DTsCard dt={dt} />
                                    </Grid.Column>
                                )}
                        </Grid>
                        :
                        <EmptyState size={ComponentSize.Large}>
                            <EmptyState.Text>
                                No <b>Digital Twin</b> record found, why not create
                                one?
                            </EmptyState.Text>
                            <Button
                                text="Create Factory"
                                type={ButtonType.Button}
                                icon={IconFont.Plus}
                                color={ComponentColor.Primary}
                                titleText={"Go to digital twin page and create factory"}
                                onClick={() => this.props["history"].push(`/orgs/${this.props["match"].params["orgID"]}/dt`)}
                            />
                        </EmptyState>
                }
            </>
        )
    }
}

export default DTsContents;