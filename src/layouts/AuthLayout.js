// Libraries
import React, { Component } from 'react'
import { Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

// Helpers
import { history } from "../history";

// Components
import SignIn from '../auth/containers/SignIn';
import SignUp from '../auth/containers/SignUp';

// Components
import {
    SpinnerContainer, TechnoSpinner, RemoteDataState,
} from '@influxdata/clockface'

class AuthLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinnerLoading: RemoteDataState.Loading,
        }
    }

    render() {
        const { isLoading } = this.props;

        return (
            <>
                <SpinnerContainer
                    loading={isLoading ? RemoteDataState.Loading : RemoteDataState.Done}
                    style={{
                        marginTop: '20%'
                    }}
                    spinnerComponent={<TechnoSpinner />}
                >
                </SpinnerContainer>

                {
                    !isLoading &&
                    <Router history={history}>
                        <Switch>
                            <Route path="/sign-in" component={SignIn} />
                            <Route path="/sign-up" component={SignUp} />
                        </Switch>
                    </Router>
                }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.auth.isLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(AuthLayout);
