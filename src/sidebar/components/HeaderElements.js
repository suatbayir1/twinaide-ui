// Libraries
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Components
import { Icon, TreeNav, IconFont, ComponentColor, } from '@influxdata/clockface';

// Assets
import logo from '../../assets/images/machinaide.png'

export default class HeaderElements extends Component {
    render() {
        return (
            <TreeNav.Header
                icon={<Icon glyph={IconFont.CuboNav} />}
                label={<img src={logo} />}
                color={ComponentColor.Secondary}
                linkElement={className => <Link className={className} to={"/"} />}
            />
        )
    }
}
