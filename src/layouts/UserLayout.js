// Libraries
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";

// Helpers
import { history } from "../history";

// Components
import { AppWrapper } from '@influxdata/clockface';
import Sidebar from "../sidebar/containers/Sidebar";
import DT from "../dt/containers/DT";

class UserLayout extends Component {
    render() {
        return (
            <>
                <AppWrapper>
                    <Sidebar />

                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={DT} />
                        </Switch>
                    </Router>
                </AppWrapper>
            </>
        )
    }
}

export default UserLayout;