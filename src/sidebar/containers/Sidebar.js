// Libraries
import React, { Component } from 'react';

// Components
import { TreeNav } from '@influxdata/clockface';
import HeaderElements from "../components/HeaderElements";
import UserElements from "../components/UserElements";
import LinkElements from "../components/LinkElements";


class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
        }
    }

    render() {
        const { isExpanded } = this.state;

        return (
            <TreeNav
                expanded={isExpanded}
                headerElement={<HeaderElements />}
                userElement={<UserElements />}
                bannerElement={<></>}
                onToggleClick={() => { this.setState({ isExpanded: !this.state.isExpanded }) }}
            >
                <LinkElements />
            </TreeNav>
        )
    }
}

export default Sidebar;