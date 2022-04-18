// Libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import ReactJson from 'react-json-view'

// Components
import {
    Form, ComponentSize, Grid, Columns, Label, InfluxColors,
    FlexBox, SlideToggle, ComponentColor, QuestionMarkTooltip,
} from '@influxdata/clockface'

class DTGeneralInformation extends Component {

    render() {
        console.log(this.props.selectedNode)
        const obj = this.props.selectedNode
        const clone = (({ childLinks, ...o }) => o)(obj)
        console.log(clone)

        return (
            <>
                <ReactJson src={clone} theme={"monokai"} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DTGeneralInformation);