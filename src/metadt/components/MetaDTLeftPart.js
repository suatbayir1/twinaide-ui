// Libraries
import React, { Component } from 'react'

// Components
import {
    Panel, ComponentSize,
} from '@influxdata/clockface'
import MetaDTGeneralInformation from './MetaDTGeneralInformation';

class MetaDTLeftPart extends Component {
    render() {
        return (
            <Panel style={{ height: '680px' }}>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <MetaDTGeneralInformation
                        selectedNode={this.props.selectedNode}
                    />
                </Panel.Header>
            </Panel>
        )
    }
}

export default MetaDTLeftPart;