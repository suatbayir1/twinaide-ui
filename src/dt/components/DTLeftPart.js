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
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <DTGeneralInformation
                        selectedNode={this.props.selectedNode}
                    />
                </Panel.Header>
                <Panel.Body size={ComponentSize.ExtraSmall}>

                </Panel.Body>
            </Panel>
        )
    }
}

export default DTLeftPart;