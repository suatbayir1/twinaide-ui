// Libraries
import React, { Component } from 'react';
import { AppWrapper } from '@influxdata/clockface';
import { Router, Route, Switch } from "react-router-dom";

// Helpers
import { history } from "../history";

// Containers
import Sidebar from "../sidebar/containers/Sidebar";
import DTs from "../dt/containers/DTs";
import DT from '../dt/containers/DT';
import Logout from "../auth/containers/Logout";
import MetaDTs from '../metadt/containers/MetaDTs';

class UserLayout extends Component {
    render() {
        return (
            <>
                <AppWrapper>
                    <Sidebar />

                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={DTs} />
                            <Route exact path="/metadt" component={MetaDTs} />
                            <Route exact path="/dt/:id" component={DT} />
                            <Route exact path="/logout" component={Logout} />
                        </Switch>
                    </Router>
                </AppWrapper>
            </>
        )
    }
}

export default UserLayout;