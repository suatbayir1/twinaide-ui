// Libraries
import React, { Component } from 'react'

// Components
import CreateMetaDTOverlay from '../../metadt/overlays/CreateMetaDTOverlay';
import VisualizeSensorDataOverlay from '../../shared/overlays/VisualizeSensorDataOverlay';

class OverlayContainer extends Component {
    render() {
        return (
            <>
                <CreateMetaDTOverlay />
                <VisualizeSensorDataOverlay />
            </>
        )
    }
}

export default OverlayContainer;