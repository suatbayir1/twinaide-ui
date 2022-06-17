// Libraries
import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import { NotificationManager } from 'react-notifications';

// Components
import {
    Overlay, Columns, SelectDropdown, Grid, Form, DapperScrollbars,
    Button, ComponentColor, ButtonType, IconFont, MultiSelectDropdown,
    EmptyState, ComponentSize,
} from '@influxdata/clockface'
import LineChart from '../components/LineChart';
import VerticalBarChart from '../components/VerticalBarChart';
import AreaChart from '../components/AreaChart';
import HorizontalBar from '../components/HorizontalBar';
import ScatterChart from '../components/ScatterChart';

// Actions
import { setVisualizeSensorDataOverlay } from "../../store/index";

var sockets = [];
var socket = io('ws://localhost:5000');

class VisualizeSensorDataOverlay extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            xaxis: [],
            data: [],
            fields: [],
            selectedFields: [],
            graphTypes: ["Line", "Area", "Vertical Bar", "Horizontal Bar", "Scatter"],
            graphType: "Line",
            pause: false,
        }
    }

    componentDidMount() {
        this.getSensorData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.visible !== this.props.visible && this.props.visible) {
            this.getSensorData();
        }
    }

    componentWillUnmount() {
        this.clearOverlay();
    }

    clearOverlay = () => {
        this.closeSocket();
        this.setState({
            xaxis: [],
            data: [],
        })
    }

    getFieldsFromSelectedNode = async (node) => {
        const fields = [];

        findField(node);

        function findField(child) {
            if (child.type === "Field") {
                fields.push({ name: child.name, displayName: child.displayName, dataSource: child.dataSource });
            }

            if (child["children"]) {
                child["children"].forEach(subChild => {
                    findField(subChild);
                })
            }
        }

        return fields;
    }

    getSensorData = async () => {
        const { selectedNode, visible } = this.props;

        if (!visible) {
            return;
        }

        const fields = await this.getFieldsFromSelectedNode(selectedNode);
        this.setState({
            fields,
            selectedFields: fields.map(field => field.displayName)
        });

        fields.forEach(field => {
            if (field.dataSource === undefined) {
                return;
            }

            const temp = this.state.data;
            const xaxis = this.state.xaxis;
            temp[field.name] = [];
            xaxis[field.name] = [];

            if (visible) {
                switch (field.dataSource?.type) {
                    case "Kafka":
                        this.setState({ date: temp, xaxis }, () => this.kafkaBroker(field))
                        break;
                    case "MQTT":
                        this.setState({ date: temp, xaxis }, () => this.mqttBroker(field))
                        break;
                    default:
                        NotificationManager.error("Data source configuration is wrong", 'Error', 3000);
                        break;
                }
            }
        })
    }

    kafkaBroker = (field) => {
        socket = io('ws://localhost:5000');
        socket.emit("kafka", field.dataSource);

        socket.on('event', (value) => {
            if (this.state.pause)
                return;

            const message = JSON.parse(value);
            console.log(message);

            if (message.error) {
                NotificationManager.error(`${field.displayName}: ${message.error}`, 'Error', 3000);
                return;
            }

            let temp = { ...this.state.data };
            let xaxis = { ...this.state.xaxis };

            temp[field.name].push(message.value);
            xaxis[field.name].push(message.timestamp);

            while (temp[field.name].length > 10) {
                temp[field.name].shift();
                xaxis[field.name].shift();
            }

            this.setState({
                data: temp,
                xaxis
            })
        });

        sockets.push(socket);
    }

    mqttBroker = (field) => {
        socket = io('ws://localhost:5000');
        socket.emit("mqtt", field.dataSource);

        socket.on('event', (value) => {
            console.log("value", value);
            if (this.state.pause)
                return;

            const message = JSON.parse(value);

            if (message.error) {
                NotificationManager.error(`${field.displayName}: ${message.error}`, 'Error', 3000);
                return;
            }

            let temp = { ...this.state.data };
            let xaxis = { ...this.state.xaxis };

            temp[field.name].push(message.value);
            xaxis[field.name].push(message.timestamp);

            while (temp[field.name].length > 10) {
                temp[field.name].shift();
                xaxis[field.name].shift();
            }

            this.setState({
                data: temp,
                xaxis
            })
        });

        sockets.push(socket);
    }

    closeSocket = () => {
        for (let s in sockets)
            sockets[s].close();
    }

    getFieldsNames = () => {
        const fieldNames = this.state.fields.map(field => field.displayName);
        return fieldNames;
    }

    changeSelectedFields = (option) => {
        const { selectedFields } = this.state
        const optionExists = selectedFields.find(opt => opt === option)
        let updatedOptions = selectedFields

        if (optionExists) {
            updatedOptions = selectedFields.filter(fo => fo !== option)
        } else {
            updatedOptions = [...selectedFields, option]
        }

        this.setState({ selectedFields: updatedOptions })
    }

    renderChart = (field) => {
        const { graphType } = this.state;

        switch (graphType) {
            case "Line":
                return <LineChart
                    id={field.name}
                    dataList={this.state.data[field.name] === undefined ? [] : this.state.data[field.name]}
                    xaxis={this.state.xaxis[field.name]}
                    graphType={"line"}
                    field={field}
                />
            case "Area":
                return <AreaChart
                    dataList={this.state.data[field.name] === undefined ? [] : this.state.data[field.name]}
                    xaxis={this.state.xaxis[field.name]}
                    graphType={"area"}
                    field={field}
                />
            case "Vertical Bar":
                return <VerticalBarChart
                    dataList={this.state.data[field.name] === undefined ? [] : this.state.data[field.name]}
                    xaxis={this.state.xaxis[field.name]}
                    graphType={"bar"}
                    field={field}
                />
            case "Horizontal Bar":
                return <HorizontalBar
                    dataList={this.state.data[field.name] === undefined ? [] : this.state.data[field.name]}
                    xaxis={this.state.xaxis[field.name]}
                    graphType={"bar"}
                    field={field}
                />
            case "Scatter":
                return <ScatterChart
                    dataList={this.state.data[field.name] === undefined ? [] : this.state.data[field.name]}
                    xaxis={this.state.xaxis[field.name]}
                    graphType={"scatter"}
                    field={field}
                />
            default:
                break;
        }
    }

    render() {
        const { visible } = this.props;
        const { graphTypes, graphType, fields, pause, selectedFields } = this.state;

        return (
            <Overlay visible={visible}>
                <Overlay.Container maxWidth={1500}>
                    <Overlay.Header
                        title={"Data Explorer"}
                        onDismiss={() => {
                            this.clearOverlay();
                            this.props.setVisualizeSensorDataOverlay(false)
                        }}
                    />
                    <Overlay.Body>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Three}>
                                    <Form.Element
                                        label="Graph Type"
                                    >
                                        <SelectDropdown
                                            options={graphTypes}
                                            selectedOption={graphType}
                                            onSelect={(e) => { this.setState({ graphType: e }) }}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                                <Grid.Column widthXS={Columns.Three}>
                                    <Form.Element label="Fields">
                                        <MultiSelectDropdown
                                            emptyText={"Select Fields"}
                                            options={this.getFieldsNames()}
                                            selectedOptions={this.state.selectedFields}
                                            onSelect={this.changeSelectedFields}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                                <Grid.Column widthXS={Columns.One}>
                                    <Form.Element
                                        label={pause ? "Start" : "Stop"}
                                    >
                                        <Button
                                            color={ComponentColor.Default}
                                            text=""
                                            type={ButtonType.Submit}
                                            onClick={() => {
                                                if (!pause) {
                                                    this.setState({ pause: true });
                                                    // this.closeSocket();
                                                } else {
                                                    this.setState({ pause: false });
                                                    // this.getSensorData();
                                                }
                                            }}
                                            icon={pause ? IconFont.Play : IconFont.Pause}
                                        />
                                    </Form.Element>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <DapperScrollbars
                                    autoHide={false}
                                    noScrollX={true}
                                    autoSizeHeight={true}
                                    style={{ maxHeight: '620px' }}
                                    className="data-loading--scroll-content"
                                >
                                    {
                                        fields.map((field, idx) =>
                                            field.dataSource &&
                                            selectedFields.includes(field.displayName) &&
                                            <Grid.Column widthXS={Columns.Six} key={idx}>
                                                {
                                                    this.renderChart(field)
                                                }
                                            </Grid.Column>)
                                    }
                                    {
                                        selectedFields.length === 0 &&
                                        <EmptyState size={ComponentSize.Large}>
                                            <EmptyState.Text>
                                                <b>The field to display has not been selected. Please select a field from the list above</b>
                                            </EmptyState.Text>
                                        </EmptyState>
                                    }
                                </DapperScrollbars>
                            </Grid.Row>
                        </Grid>
                    </Overlay.Body>
                </Overlay.Container>
            </Overlay >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        visible: state.data.visibleVisualizeSensorDataOverlay,
        selectedNode: state.dt.selectedNode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setVisualizeSensorDataOverlay: (payload) => dispatch(setVisualizeSensorDataOverlay(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VisualizeSensorDataOverlay);
