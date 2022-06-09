// Libraries
import React, { Component } from 'react'

// Components
import {
    Panel, ComponentSize,
} from '@influxdata/clockface'
import DTGeneralInformation from './DTGeneralInformation';

class DTLeftPart extends Component {
    render() {
        return (
            <Panel style={{ height: '680px' }}>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <DTGeneralInformation
                        selectedNode={this.props.selectedNode}
                    />
                </Panel.Header>
            </Panel>
        )
    }
}

export default DTLeftPart;