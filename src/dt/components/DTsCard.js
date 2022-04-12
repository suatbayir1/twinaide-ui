// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';

// Components
import {
    ResourceCard, FlexBox, ComponentSize, IconFont, ComponentColor, ComponentStatus, Button,
} from '@influxdata/clockface'
import DangerConfirmationOverlay from '../../shared/overlays/DangerConfirmationOverlay';
import DigitalTwinDetailAndEditOverlay from '../overlays/DigitalTwinDetailAndEditOverlay';

// Utilities
import { relativeTimestampFormatter } from '../../shared/utils/relativeTimeFormatter';
import { getDTOwnerAccess } from "../../shared/auth/access";
import { history } from '../../history';

// Actions
import { fetchDeleteDT, fetchUpdateDT, fetchGetSingleDT } from "../../store/index";

// Constants
import { dtDeleteConfirmationText } from "../../shared/constants/messages";

class DTsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleConfirmationOverlay: false,
            visibleDTDetailAndEditOverlay: false,
            mode: "",
        }
    }

    deleteDT = async () => {
        const { dt, user, fetchDeleteDT } = this.props;

        if (!getDTOwnerAccess(dt.owner._id, user.id)) {
            NotificationManager.error("Only owner can delete this DT", 'Permission Denied', 3000);
            return;
        }

        await fetchDeleteDT(dt._id);
        this.setState({ visibleConfirmationOverlay: false })
    }

    handleUpdateDTName = async (name) => {
        const { dt, user, fetchUpdateDT } = this.props;

        if (!getDTOwnerAccess(dt.owner._id, user.id)) {
            NotificationManager.error("Only owner can change this DT name", 'Permission Denied', 3000);
            return;
        }

        const payload = { "displayName": name };
        fetchUpdateDT(dt._id, payload);
    }

    handleUpdateDTDescription = async (description) => {
        const { dt, user, fetchUpdateDT } = this.props;

        if (!getDTOwnerAccess(dt.owner._id, user.id)) {
            NotificationManager.error("Only owner can change this DT description", 'Permission Denied', 3000);
            return;
        }

        const payload = { "description": description };
        await fetchUpdateDT(dt._id, payload);
    }

    contextMenu = () => {
        const { dt, user, fetchGetSingleDT } = this.props;

        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <Button
                        icon={IconFont.CogOutline}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Primary}
                        status={
                            getDTOwnerAccess(dt.owner._id, user.id) === true ?
                                ComponentStatus.Default
                                : ComponentStatus.Disabled
                        }
                        onClick={() => {
                            fetchGetSingleDT(dt._id)
                            this.setState({
                                visibleDTDetailAndEditOverlay: true,
                                mode: "edit"
                            })
                        }}
                    />
                    <Button
                        icon={IconFont.EyeOpen}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Secondary}
                        onClick={() => {
                            fetchGetSingleDT(dt._id)
                            this.setState({
                                visibleDTDetailAndEditOverlay: true,
                                mode: "detail"
                            })
                        }}
                    />
                    <Button
                        icon={IconFont.Trash}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Danger}
                        status={
                            getDTOwnerAccess(dt.owner._id, user.id) === true ?
                                ComponentStatus.Default
                                : ComponentStatus.Disabled
                        }
                        onClick={() => {
                            this.setState({
                                visibleConfirmationOverlay: true
                            })
                        }}
                    />
                </FlexBox>
            </>
        )
    }

    render() {
        const { dt, fetchGetSingleDT } = this.props;
        const { visibleConfirmationOverlay, visibleDTDetailAndEditOverlay, mode } = this.state;

        return (
            <>
                <DangerConfirmationOverlay
                    title={"Are you sure ?"}
                    message={dtDeleteConfirmationText}
                    visible={visibleConfirmationOverlay}
                    onClose={() => { this.setState({ visibleConfirmationOverlay: false }) }}
                    onConfirm={() => { this.deleteDT() }}
                />

                <DigitalTwinDetailAndEditOverlay
                    visible={visibleDTDetailAndEditOverlay}
                    onClose={() => { this.setState({ visibleDTDetailAndEditOverlay: false }) }}
                    mode={mode}
                    dt={dt}
                />

                <ResourceCard
                    key={dt.id}
                    contextMenu={this.contextMenu()}
                >
                    <ResourceCard.EditableName
                        onUpdate={this.handleUpdateDTName}
                        onClick={() => {
                            fetchGetSingleDT(dt._id)
                            history.push(`/dt/${dt._id}`)
                        }}
                        name={dt.displayName}
                        noNameString={"No name entered"}
                    />
                    <ResourceCard.EditableDescription
                        onUpdate={this.handleUpdateDTDescription}
                        description={dt.description}
                        placeholder={"No description entered"}
                    />
                    <ResourceCard.Meta style={{ marginTop: '20px' }}>
                        <>{`Owner: ${dt.owner.name}`}</>
                    </ResourceCard.Meta>
                    <ResourceCard.Meta style={{ marginTop: '0px' }}>
                        <>{`Privacy: ${dt.privacy}`}</>
                    </ResourceCard.Meta>
                    <ResourceCard.Meta style={{ marginTop: '0px' }}>
                        {relativeTimestampFormatter(dt.updatedAt, 'Last modified ')}
                    </ResourceCard.Meta>
                </ResourceCard>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUpdateDT: (id, payload) => dispatch(fetchUpdateDT(id, payload)),
        fetchDeleteDT: (id) => dispatch(fetchDeleteDT(id)),
        fetchGetSingleDT: (id) => dispatch(fetchGetSingleDT(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTsCard);