// Libraries
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";

// Notifications
import { NotificationManager } from 'react-notifications';

// Actions
import { logout } from "../store/index";

const PrivateRoute = ({ user, token, logout, component: Component, ...rest }) => {
    const isLoggedIn = token === "" ? false : true;

    if (token !== "" && isLoggedIn) {
        if (new Date() > new Date(jwt_decode(token).exp * 1000)) {
            NotificationManager.error("Token expired. Please login again", "Token Expired", 10000);
            logout();
        }
    }

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
                )
            }
        />
    )
}


const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
