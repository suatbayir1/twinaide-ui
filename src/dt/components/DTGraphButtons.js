// Libraries
import React, { Component } from 'react'

// Components
import {
    Form, Button, Grid, Columns, ButtonType, ComponentColor, Dropdown, IconFont,
} from '@influxdata/clockface'

// Constants
import { graphTypeList } from "../../shared/constants/constants";

class DTGraphButtons extends Component {
    render() {
        const { selectedGraphType, handleChangeGraphType } = this.props;

        return (
            <Form>
                <Grid>
                    <Grid.Row>
                        <Grid.Column widthXS={Columns.Twelve}>
                            <div className="dt-graph-buttons">
                                <Button
                                    text="Add"
                                    icon={IconFont.Plus}
                                    onClick={this.openAddNodeOverlay}
                                    type={ButtonType.Button}
                                    color={ComponentColor.Primary}
                                    className="show-only-pc"
                                />

                                <Dropdown
                                    style={{ width: '125px' }}
                                    button={(active, onClick) => (
                                        <Dropdown.Button
                                            active={active}
                                            onClick={onClick}
                                            color={ComponentColor.Primary}
                                        >
                                            {selectedGraphType['text']}
                                        </Dropdown.Button>
                                    )}
                                    menu={onCollapse => (
                                        <Dropdown.Menu onCollapse={onCollapse}>
                                            {
                                                graphTypeList.map(item => {
                                                    return (
                                                        <Dropdown.Item
                                                            id={item['value']}
                                                            key={item['value']}
                                                            value={item}
                                                            onClick={handleChangeGraphType}
                                                        >
                                                            {item['text']}
                                                        </Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </Dropdown.Menu>
                                    )}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        )
    }
}

export default DTGraphButtons;