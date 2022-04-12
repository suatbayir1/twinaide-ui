// Libraries
import React, { Component } from 'react'

// Components
import {
    Grid, Columns, EmptyState, ComponentSize,
    ComponentColor, IconFont, Dropdown,
} from '@influxdata/clockface';
import DTsCard from './DTsCard';

// Constants
import { createOptions } from "../../shared/constants/constants";

class DTsContents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            createOption: { key: "form", label: "New Digital Twin" },
        }
    }

    render() {
        const { dts } = this.props;
        const { createOption } = this.state;

        return (
            <>
                {
                    dts.length > 0 ?
                        <Grid>
                            {
                                dts.map((dt, idx) =>
                                    <Grid.Column
                                        widthSM={Columns.Three}
                                        style={{ padding: 2 }}
                                        key={idx}
                                    >
                                        <DTsCard dt={dt} />
                                    </Grid.Column>
                                )}
                        </Grid>
                        :
                        <EmptyState size={ComponentSize.Large}>
                            <EmptyState.Text>
                                No <b>Digital Twin</b> record found, why not create
                                one?
                            </EmptyState.Text>
                            <Dropdown
                                button={(active, onClick) => (
                                    <Dropdown.Button
                                        active={active}
                                        onClick={onClick}
                                        color={ComponentColor.Primary}
                                        size={ComponentSize.Small}
                                        icon={IconFont.Plus}
                                    >
                                        {createOption.label}
                                    </Dropdown.Button>
                                )}
                                menu={onCollapse => (
                                    <Dropdown.Menu onCollapse={onCollapse}>
                                        {createOptions.map(item => (
                                            <Dropdown.Item
                                                key={item.key}
                                                value={item}
                                                onClick={this.props.openCreateOverlay}
                                                selected={item.key === createOption.key}
                                            >
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                )}
                                style={{ flexBasis: `210px`, width: `210px` }}
                            />
                        </EmptyState>
                }
            </>
        )
    }
}

export default DTsContents;