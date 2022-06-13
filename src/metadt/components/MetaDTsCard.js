// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';

// Components
import {
    ResourceCard, FlexBox, ComponentSize, IconFont, ComponentColor, ComponentStatus, Button,
} from '@influxdata/clockface'
import DangerConfirmationOverlay from '../../shared/overlays/DangerConfirmationOverlay';

// Utilities
import { relativeTimestampFormatter } from '../../shared/utils/relativeTimeFormatter';
import { getDTOwnerAccess } from "../../shared/auth/access";
import { history } from '../../history';

// Actions
import { fetchDeleteMetaDT, fetchUpdateMetaDT, fetchGetSingleMetaDT, setCreateMetaDTOverlay } from "../../store/index";

// Constants
import { metadtDeleteConfirmationText } from "../../shared/constants/messages";

class MetaDTsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleConfirmationOverlay: false,
            visibleDTDetailAndEditOverlay: false,
            mode: "",
        }
    }

    deleteMetaDT = async () => {
        const { metadt, user, fetchDeleteMetaDT } = this.props;

        console.log(metadt);

        if (!getDTOwnerAccess(metadt.owner._id, user.id)) {
            NotificationManager.error("Only owner can delete this Meta DT", 'Permission Denied', 3000);
            return;
        }

        await fetchDeleteMetaDT(metadt._id);
        this.setState({ visibleConfirmationOverlay: false })
    }

    handleUpdateMetaDTName = async (name) => {
        const { metadt, user, fetchUpdateMetaDT } = this.props;

        console.log(metadt);

        if (!getDTOwnerAccess(metadt.owner._id, user.id)) {
            NotificationManager.error("Only owner can change this DT name", 'Permission Denied', 3000);
            return;
        }

        const payload = { "displayName": name };
        await fetchUpdateMetaDT(metadt._id, payload);
    }

    contextMenu = () => {
        const { metadt, user, fetchGetSingleMetaDT, setCreateMetaDTOverlay } = this.props;

        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <Button
                        icon={IconFont.CogOutline}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Primary}
                        status={
                            getDTOwnerAccess(metadt.owner._id, user.id) === true ?
                                ComponentStatus.Default
                                : ComponentStatus.Disabled
                        }
                        onClick={() => {
                            fetchGetSingleMetaDT(metadt._id)
                            setCreateMetaDTOverlay(true, "edit")
                        }}
                    />
                    <Button
                        icon={IconFont.EyeOpen}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Secondary}
                        onClick={() => {
                            fetchGetSingleMetaDT(metadt._id)
                            setCreateMetaDTOverlay(true, "detail")
                        }}
                    />
                    <Button
                        icon={IconFont.Trash}
                        size={ComponentSize.ExtraSmall}
                        text={""}
                        color={ComponentColor.Danger}
                        status={
                            getDTOwnerAccess(metadt.owner._id, user.id) === true ?
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
        const { metadt, fetchGetSingleMetaDT } = this.props;
        const { visibleConfirmationOverlay, visibleDTDetailAndEditOverlay, mode } = this.state;

        return (
            <>
                <DangerConfirmationOverlay
                    title={"Are you sure ?"}
                    message={metadtDeleteConfirmationText}
                    visible={visibleConfirmationOverlay}
                    onClose={() => { this.setState({ visibleConfirmationOverlay: false }) }}
                    onConfirm={() => { this.deleteMetaDT() }}
                />

                <ResourceCard
                    key={metadt.id}
                    contextMenu={this.contextMenu()}
                >
                    <ResourceCard.EditableName
                        onUpdate={this.handleUpdateMetaDTName}
                        onClick={async () => {
                            await fetchGetSingleMetaDT(metadt._id)
                            history.push(`/dt/${metadt._id}`)
                        }}
                        name={metadt.displayName}
                        noNameString={"No name entered"}
                    />
                    <ResourceCard.Description
                        description={`${metadt.description.substring(0, 50)}...`}
                    />
                    <ResourceCard.Meta style={{ marginTop: '20px' }}>
                        <>{`Owner: ${metadt.owner.name}`}</>
                    </ResourceCard.Meta>
                    <ResourceCard.Meta style={{ marginTop: '0px' }}>
                        <>{`Privacy: ${metadt.privacy}`}</>
                    </ResourceCard.Meta>
                    <ResourceCard.Meta style={{ marginTop: '0px' }}>
                        {relativeTimestampFormatter(metadt.updatedAt, 'Last modified ')}
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
        fetchUpdateMetaDT: (id, payload) => dispatch(fetchUpdateMetaDT(id, payload)),
        fetchDeleteMetaDT: (id) => dispatch(fetchDeleteMetaDT(id)),
        fetchGetSingleMetaDT: (id) => dispatch(fetchGetSingleMetaDT(id)),
        setCreateMetaDTOverlay: (payload, mode) => dispatch(setCreateMetaDTOverlay(payload, mode)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MetaDTsCard);