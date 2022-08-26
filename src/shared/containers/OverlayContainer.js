// Libraries
import React, { Component } from 'react'

// Components
import CreateMetaDTOverlay from '../../metadt/overlays/CreateMetaDTOverlay';
import VisualizeSensorDataOverlay from '../../shared/overlays/VisualizeSensorDataOverlay';
import ImportDTFromTwinbase from '../../dt/overlays/ImportDTFromTwinbase';
import ImportDTFromKmack from '../../dt/overlays/ImportDTFromKmack';

class OverlayContainer extends Component {
    render() {
        return (
            <>
                <CreateMetaDTOverlay />
                <VisualizeSensorDataOverlay />
                <ImportDTFromTwinbase />
                <ImportDTFromKmack />
            </>
        )
    }
}

export default OverlayContainer;