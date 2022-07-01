// Libraries
import React, { Component } from 'react'

// Components
import CreateMetaDTOverlay from '../../metadt/overlays/CreateMetaDTOverlay';
import VisualizeSensorDataOverlay from '../../shared/overlays/VisualizeSensorDataOverlay';
import ImportDTFromTwinbase from '../../dt/overlays/ImportDTFromTwinbase';

class OverlayContainer extends Component {
    render() {
        return (
            <>
                <CreateMetaDTOverlay />
                <VisualizeSensorDataOverlay />
                <ImportDTFromTwinbase />
            </>
        )
    }
}

export default OverlayContainer;