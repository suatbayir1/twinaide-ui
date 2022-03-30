// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    ResourceCard, FlexBox, ComponentSize, ConfirmationButton, IconFont, ComponentColor,
    Appearance,
} from '@influxdata/clockface'

// Utilities
import { relativeTimestampFormatter } from '../../shared/utils/relativeTimeFormatter';

// Actions
import { fetchUpdateDT } from "../../store/dt/dtAction";

class DTsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    contextMenu = (project) => {
        return (
            <>
                <FlexBox margin={ComponentSize.ExtraSmall}>
                    <ConfirmationButton
                        icon={IconFont.Export}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { }}
                        text={""}
                        popoverColor={ComponentColor.Primary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Primary}
                        confirmationLabel="Do you want to export ?"
                        confirmationButtonColor={ComponentColor.Primary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Duplicate}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchCloneProject(project) }}
                        text={""}
                        popoverColor={ComponentColor.Secondary}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Secondary}
                        confirmationLabel="Do you want to clone ?"
                        confirmationButtonColor={ComponentColor.Secondary}
                        confirmationButtonText="Yes"
                    />
                    <ConfirmationButton
                        icon={IconFont.Trash}
                        size={ComponentSize.ExtraSmall}
                        onConfirm={() => { this.props.fetchDeleteProject({ "id": project["_id"]["$oid"] }) }}
                        text={""}
                        popoverColor={ComponentColor.Danger}
                        popoverAppearance={Appearance.Outline}
                        color={ComponentColor.Danger}
                        confirmationLabel="Do you want to delete ?"
                        confirmationButtonColor={ComponentColor.Danger}
                        confirmationButtonText="Yes"
                    />
                </FlexBox>
            </>
        )
    }

    handleUpdateDTName = async (name) => {
        const { dt, fetchUpdateDT } = this.props;

        const payload = { "displayName": name };
        fetchUpdateDT(dt._id, payload);
    }

    handleUpdateDTDescription = async (description) => {
        const { dt, fetchUpdateDT } = this.props;

        const payload = { "description": description };
        fetchUpdateDT(dt._id, payload);
    }


    render() {
        const { dt } = this.props;

        return (
            <ResourceCard
                key={dt.id}
                contextMenu={this.contextMenu()}
            >
                <ResourceCard.EditableName
                    onUpdate={this.handleUpdateDTName}
                    onClick={() => { console.log("clicked") }}
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
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUpdateDT: (id, payload) => dispatch(fetchUpdateDT(id, payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTsCard);