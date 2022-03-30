// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Actions
import { logout } from "../../store";

class Logout extends Component {
    componentDidMount() {
        this.props.logout();
    }

    render() {
        return (
            <></>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
