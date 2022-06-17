// Libraries
import React, { Component } from 'react'
import { withSize } from "react-sizeme";

// Components
import {
    Panel, ComponentSize
} from '@influxdata/clockface';
import MetaDTGraphButtons from './MetaDTGraphButtons';
import MetaDTGraph from './MetaDTGraph';

// HOC
const withSizeHOC = withSize({ monitorWidth: true, monitorHeight: false, noPlaceholder: true })

class MetaDTMiddlePart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGraphType: { text: 'Top to down', value: 'td' },
        }
    }

    render() {
        const { selectedGraphType } = this.state;

        return (
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <MetaDTGraphButtons
                        handleChangeGraphType={(selectedGraphType) => {
                            this.setState({
                                selectedGraphType
                            })
                        }}
                        selectedGraphType={selectedGraphType}
                        selectedNode={this.props.selectedNode}
                    />
                </Panel.Header>

                <MetaDTGraph
                    selectedGraphType={selectedGraphType}
                    selectedNode={this.props.selectedNode}
                    handleNodeClick={this.props.handleNodeClick}
                />
            </Panel>
        )
    }
}

export default withSizeHOC(MetaDTMiddlePart);
