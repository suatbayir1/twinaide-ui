// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Grid, Columns, EmptyState, ComponentSize,
    ComponentColor, IconFont, Button,
} from '@influxdata/clockface';
import MetaDTsCard from './MetaDTsCard';

// Actions
import { setCreateMetaDTOverlay, } from "../../store";

class MetaDTsContents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            createOption: { key: "form", label: "New Digital Twin" },
        }
    }

    render() {
        const { metadts } = this.props;

        return (
            <>
                {
                    metadts.length > 0 ?
                        <Grid>
                            {
                                metadts.map((metadt, idx) =>
                                    <Grid.Column
                                        widthSM={Columns.Three}
                                        style={{ padding: 2 }}
                                        key={idx}
                                    >
                                        <MetaDTsCard metadt={metadt} />
                                    </Grid.Column>
                                )}
                        </Grid>
                        :
                        <EmptyState size={ComponentSize.Large}>
                            <EmptyState.Text>
                                No <b>Meta Digital Twin</b> record found, why not create
                                one?
                            </EmptyState.Text>
                            <Button
                                text={"New Meta Digital Twin"}
                                color={ComponentColor.Primary}
                                icon={IconFont.Plus}
                                onClick={() => { this.props.setCreateMetaDTOverlay(true) }}
                            />
                        </EmptyState>
                }
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCreateMetaDTOverlay: (payload) => dispatch(setCreateMetaDTOverlay(payload)),
    };
};

export default connect(null, mapDispatchToProps)(MetaDTsContents);