// Libraries
import React, { Component } from "react";
import ReactJson from 'react-json-view'

// Components
import {
    DapperScrollbars,
} from '@influxdata/clockface'

class MetaDTGeneralInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json: {},
        }
    }

    componentDidMount() {
        this.setJSON();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedNode !== this.props.selectedNode) {
            this.setJSON();
        }
    }

    setJSON = async () => {
        const obj = await this.props.selectedNode
        const clone = await (({ childLinks, children, collapsed, fx, fy, vx, vy, x, y, index, color, __indexColor, __v, ...o }) => o)(obj)
        this.setState({ json: clone });
    }

    render() {
        const { json } = this.state;

        return (
            <>
                <DapperScrollbars
                    autoHide={false}
                    noScrollX={true}
                    autoSizeHeight={true}
                    style={{ maxHeight: '650px' }}
                    className="data-loading--scroll-content"
                >
                    <ReactJson
                        src={json}
                        name={"selectedNode"}
                        theme={"monokai"}
                        iconStyle={"triangle"}
                        indentWidth={3}
                        collapsed={false}
                        collapseStringsAfterLength={30}
                        groupArraysAfterLength={100}
                        enableClipboard={true}
                        displayObjectSize={true}
                        displayDataTypes={true}
                        defaultValue={null}
                        sortKeys={false}
                        quotesOnKeys={false}
                        validationMessage={"Please check your inputs"}
                        displayArrayKey={true}
                        style={{
                            width: "100%",
                        }}
                    />
                </DapperScrollbars>
            </>
        )
    }
}

export default MetaDTGeneralInformation;