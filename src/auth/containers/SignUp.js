// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Panel, AlignItems, FunnelPage, AppWrapper, Columns, InputType, Grid,
    ButtonType, ComponentSize, ComponentColor, Form, Input, Button,
} from '@influxdata/clockface'
import Copyright from '../components/Copyright';

// Actions
// import { fetchSignup } from "../../store";

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});


class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            username: "",
            password: "",
        }
    }

    handleSignUp = async () => {
        const { firstname, lastname, email, username, password } = this.state;

        await this.props.fetchSignup({ firstname, lastname, email, username, password, "role": "member" });
    }

    render() {
        const { firstname, lastname, email, username, password } = this.state;

        return (
            <AppWrapper>
                <FunnelPage className="signup-page" testID="signup-page">
                    <Panel className="signup-page--panel">
                        <Panel.Body alignItems={AlignItems.Center}>
                            <div className="signup-page--cubo" />
                            <h2>Sign Up</h2>
                            <Form onSubmit={this.handleSignUp}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element label="First Name">
                                                <Input
                                                    name="firstname"
                                                    onChange={(e) => { this.setState({ firstname: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    autoFocus={true}
                                                    value={firstname}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element label="Last Name">
                                                <Input
                                                    name="lastname"
                                                    onChange={(e) => { this.setState({ lastname: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={lastname}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Element label="Email">
                                                <Input
                                                    name="email"
                                                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={email}
                                                    tyle={InputType.Email}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element label="Username">
                                                <Input
                                                    name="username"
                                                    onChange={(e) => { this.setState({ username: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={username}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element label="Password">
                                                <Input
                                                    name="password"
                                                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={password}
                                                    type={InputType.Password}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Footer>
                                                <Button
                                                    color={ComponentColor.Primary}
                                                    text="Sign Up"
                                                    size={ComponentSize.Medium}
                                                    type={ButtonType.Submit}
                                                />
                                            </Form.Footer>
                                        </Grid.Column>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <Grid.Column widthXS={Columns.Twelve} style={{ marginTop: '20px' }}>
                                            <Link href="/sign-in" variant="body2">
                                                {"Already have an account? Sign In"}
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
        // fetchSignup: (payload) => dispatch(fetchSignup(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignUp));