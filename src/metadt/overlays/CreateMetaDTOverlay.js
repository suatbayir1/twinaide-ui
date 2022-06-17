// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Components
import {
    Overlay, Form, Input, Button, ComponentColor, ButtonType, ComponentStatus, IconFont,
    ResourceCard, Alert, Grid, Columns, SelectDropdown, TextArea,
} from '@influxdata/clockface';

// Actions
import { setCreateMetaDTOverlay, fetchGetAllDTs, fetchCreateMetaDT, fetchUpdateMetaDT } from "../../store";

// Utilities
import { relativeTimestampFormatter } from '../../shared/utils/relativeTimeFormatter';

class CreateMetaDTOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedImportOption: "upload",
            isJsonCorrect: false,
            dtJSON: "",
            fileContent: "",
            items: [],
            selected: [],
            id2List: {
                droppable: 'items',
                droppable2: 'selected'
            },
            grid: 10,
            name: "",
            displayName: "",
            privacyTypes: ["public", "private"],
            privacyType: "public",
            description: "",
            version: "1.0",
        }
    }

    async componentDidMount() {
        await this.props.fetchGetAllDTs();
        this.setState({ items: this.props.dts });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dts !== this.props.dts) {
            this.setState({ items: this.props.dts });
        }

        if (prevProps.metadt !== this.props.metadt && ["detail", "edit"].includes(this.props.mode)) {
            this.setInitialForm();
        }
    }


    setInitialForm = () => {
        const { metadt, dts } = this.props;

        this.setState({
            name: metadt.name,
            displayName: metadt.displayName,
            version: metadt.version,
            privacyType: metadt.privacy,
            description: metadt.description,
            selected: dts.filter(dt => metadt.relations.includes(dt.id)),
            items: dts.filter(dt => !metadt.relations.includes(dt.id))
        })
    }

    clearForm = () => {
        this.setState({
            items: this.props.dts,
            selected: [],
            name: "",
            displayName: "",
            privacyType: "public",
            description: "",
            version: "1.0",
        })
    }

    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        margin: `0 0 ${this.state.grid}px 0`,

        background: isDragging ? 'lightgreen' : 'grey',

        ...draggableStyle
    });

    getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        padding: this.state.grid,
        width: 400,
        maxHeight: 400,
        overflowY: 'scroll'
    });

    getList = id => this.state[this.state.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        // Sorting in same list
        if (source.droppableId === destination.droppableId) {
            const items = this.reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = this.move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };

    save = async () => {
        const { name, displayName, version, privacyType, description, selected } = this.state;
        const { mode, metadt } = this.props;

        if (name.trim() === "" || displayName.trim() === "" || version.trim() === "" || privacyType.trim() === "" || description.trim() === "") {
            NotificationManager.error("Please fill out the form completely", 'Error', 3000);
            return;
        }

        if (selected.length < 2) {
            NotificationManager.error("Please select at least 2 digital twins", 'Error', 3000);
            return;
        }

        const payload = {
            version,
            privacy: privacyType,
            name,
            description,
            displayName,
            relations: selected.map(dt => dt.id)
        }

        switch (mode) {
            case "create":
                await this.props.fetchCreateMetaDT(payload);
                break;
            case "edit":
                await this.props.fetchUpdateMetaDT(metadt._id, payload);
                break;
            default:
                break;
        }

    }

    getDTCard = (item) => {
        return (
            <ResourceCard>
                <ResourceCard.Name
                    name={item.displayName}
                />
                <ResourceCard.Description
                    description={String(item.description).substring(0, 100)}
                />
                <ResourceCard.Meta style={{ marginTop: '20px' }}>
                    <>{`Owner: ${item.owner.name}`}</>
                </ResourceCard.Meta>
                <ResourceCard.Meta style={{ marginTop: '0px' }}>
                    <>{`Privacy: ${item.privacy}`}</>
                </ResourceCard.Meta>
                <ResourceCard.Meta style={{ marginTop: '0px' }}>
                    {relativeTimestampFormatter(item.updatedAt, 'Last modified ')}
                </ResourceCard.Meta>
            </ResourceCard>
        )
    }

    render() {
        const { visible, mode } = this.props;
        const { name, displayName, privacyTypes, privacyType, description, version } = this.state;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={800}>
                    <Form onSubmit={this.submit}>
                        <Overlay.Header
                            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Meta Digital Twin`}
                            onDismiss={() => {
                                this.clearForm();
                                this.props.setCreateMetaDTOverlay(false, "create")
                            }}
                        />
                        <Overlay.Body>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Four}>
                                    <Form.Element
                                        required={true}
                                        label={"Name"}
                                    >
                                        <Input
                                            status={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                            onChange={(e) => { this.setState({ name: e.target.value }) }}
                                            value={name}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Four}>
                                    <Form.Element
                                        label="Display Name"
                                        required={true}
                                    >
                                        <Input
                                            status={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                            onChange={(e) => { this.setState({ displayName: e.target.value }) }}
                                            value={displayName}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Two}>
                                    <Form.Element
                                        label="Version"
                                        required={true}
                                    >
                                        <Input
                                            status={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                            onChange={(e) => { this.setState({ version: e.target.value }) }}
                                            value={version}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Two}>
                                    <Form.Element
                                        label="Privacy"
                                        required={true}
                                    >
                                        <SelectDropdown
                                            buttonStatus={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                            options={privacyTypes}
                                            selectedOption={privacyType}
                                            onSelect={(e) => { this.setState({ privacyType: e }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>

                                <Grid.Column widthXS={Columns.Twelve}>
                                    <Form.Element
                                        label="Description"
                                        required={true}
                                    >
                                        <TextArea
                                            status={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                            value={description}
                                            onChange={(e) => { this.setState({ description: e.target.value }) }}
                                            rows={3}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>


                            <Alert color={ComponentColor.Success} icon={IconFont.AlertTriangle}>
                                Please select the digital twins you want to use from the list on the left and drag them to the right.
                            </Alert>

                            <div style={{ 'display': 'flex', marginTop: '10px' }}>
                                <DragDropContext onDragEnd={this.onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getListStyle(snapshot.isDraggingOver)}>
                                                {this.state.items.map((item, index) => (
                                                    <Draggable
                                                        isDragDisabled={mode === "detail" ? true : false}
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={this.getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}
                                                            >
                                                                {this.getDTCard(item)}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <Droppable droppableId="droppable2">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={this.getListStyle(snapshot.isDraggingOver)}>
                                                {this.state.selected.map((item, index) => (
                                                    <Draggable
                                                        isDragDisabled={mode === "detail" ? true : false}
                                                        key={item.id}
                                                        draggableId={item.id}
                                                        index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={this.getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}
                                                            >
                                                                {this.getDTCard(item)}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </Overlay.Body>
                        <Overlay.Footer>
                            <Button
                                text={`Save Meta Digital Twin`}
                                color={ComponentColor.Primary}
                                status={mode === "detail" ? ComponentStatus.Disabled : ComponentStatus.Default}
                                type={ButtonType.Submit}
                                icon={IconFont.Checkmark}
                                onClick={this.save}
                            />
                        </Overlay.Footer>
                    </Form>
                </Overlay.Container>
            </Overlay>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        visible: state.metadt.visibleCreateMetaDTOverlay,
        mode: state.metadt.metadtOverlayMode,
        dts: state.dt.dts,
        metadt: state.metadt.metadt,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCreateMetaDTOverlay: (payload, mode) => dispatch(setCreateMetaDTOverlay(payload, mode)),
        fetchGetAllDTs: () => dispatch(fetchGetAllDTs()),
        fetchCreateMetaDT: (payload) => dispatch(fetchCreateMetaDT(payload)),
        fetchUpdateMetaDT: (id, payload) => dispatch(fetchUpdateMetaDT(id, payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMetaDTOverlay);