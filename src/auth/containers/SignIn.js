// Libraries
import React, { Component } from 'react';
import { connect } from "react-redux";

// Components
import {
    Panel, AlignItems, FunnelPage, AppWrapper, Columns, InputType, Grid,
    ButtonType, ComponentSize, ComponentColor, Form, Input, Button,
} from '@influxdata/clockface';
import Copyright from '../components/Copyright';

// Actions
import { fetchLogin } from "../../store";

// Material UI
import { withStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        }
    }

    handleSignIn = async () => {
        const { email, password } = this.state;

        await this.props.fetchLogin({ email, password });
    }

    render() {
        const { email, password } = this.state;

        return (
            <AppWrapper>
                <FunnelPage className="signin-page" testID="signin-page">
                    <Panel className="signin-page--panel">
                        <Panel.Body alignItems={AlignItems.Center}>
                            <div className="signin-page--cubo" />
                            <h2>Sign In</h2>

                            <Form onSubmit={this.handleSignIn}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Element label="Email">
                                                <Input
                                                    name="email"
                                                    value={email}
                                                    type='email'
                                                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    autoFocus={true}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Element label="Password">
                                                <Input
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    type={InputType.Password}
                                                    testID="password"
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Footer>
                                                <Button
                                                    color={ComponentColor.Primary}
                                                    text="Sign In"
                                                    size={ComponentSize.Medium}
                                                    type={ButtonType.Submit}
                                                />
                                            </Form.Footer>
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column widthXS={Columns.Twelve} style={{ marginTop: '20px' }}>
                                            <Link href="#" variant="body2">
                                                Forgot password?
                                            </Link>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Link href="/sign-up" variant="body2">
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </Panel.Body>
                        <Panel.Footer>
                            <Copyright />
                        </Panel.Footer>
                    </Panel>
                </FunnelPage>
            </AppWrapper>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLogin: (payload) => dispatch(fetchLogin(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignIn));