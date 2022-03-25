// Libraries
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from "react-redux";

// Components
import { TreeNav } from '@influxdata/clockface';


class UserElements extends Component {
    render() {
        const { user } = this.props;

        return (
            <TreeNav.User username={`${user.firstname} ${user.lastname}`} team={user.role}>
                <TreeNav.UserItem
                    id="users"
                    label="My Projects"
                    linkElement={className => (
                        <Link className={className} to={"/my-projects"} />
                    )}
                />
                <TreeNav.UserItem
                    id="logout"
                    label="Logout"
                    linkElement={className => <Link className={className} to="/logout" />}
                />
            </TreeNav.User>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, null)(UserElements);