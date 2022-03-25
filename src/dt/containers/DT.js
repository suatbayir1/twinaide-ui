// Libraries
import React, { Component } from 'react'

// Components
import { Page, Grid, Columns } from '@influxdata/clockface'

class DT extends Component {
    render() {
        return (
            <Page>
                <Page.Header fullWidth={true}>
                    <Page.Title title={"Home Page"}
                    />
                </Page.Header>


                <Page.Contents fullWidth={true}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column widthXS={Columns.Twelve}>
                                <h2>Home page contents will be here</h2>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Page.Contents>
            </Page>
        )
    }
}

export default DT;