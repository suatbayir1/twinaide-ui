// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { NotificationManager } from 'react-notifications';

// Components
import {
    Panel, AlignItems, FunnelPage, AppWrapper, Columns, InputType, Grid,
    ButtonType, ComponentSize, ComponentColor, Form, Input, Button, SelectDropdown,
} from '@influxdata/clockface'
import Copyright from '../components/Copyright';

// Helpers
import { handleValidation, validateEmail, isPasswordValid, isPasswordMatched } from "../../shared/helpers/FormValidator";

// Actions
import { fetchSignup } from "../../store";

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
            name: "",
            role: "user",
            roles: ["user", "admin"],
            email: "",
            password: "",
            passwordRepeat: "",
        }
    }

    handleSignUp = async () => {
        const { name, role, email, password, passwordRepeat } = this.state;

        const nameValidationResult = handleValidation(name);
        const roleValidationResult = handleValidation(role);
        const emailValidationResult = validateEmail(email);
        const passwordValidationResult = isPasswordValid(password);
        const passwordRepeatValidationResult = isPasswordMatched(password, passwordRepeat);

        if (nameValidationResult) {
            NotificationManager.error(`name: ${nameValidationResult}`, 'Error', 3000);
            return;
        }

        if (roleValidationResult) {
            NotificationManager.error(`role: ${roleValidationResult}`, 'Error', 3000);
            return;
        }

        if (emailValidationResult) {
            NotificationManager.error(`Email: ${emailValidationResult}`, 'Error', 3000);
            return;
        }

        if (passwordValidationResult) {
            NotificationManager.error(`Password: ${passwordValidationResult}`, 'Error', 3000);
            return;
        }

        if (passwordRepeatValidationResult) {
            NotificationManager.error(`Password repeat: ${passwordRepeatValidationResult}`, 'Error', 3000);
            return;
        }

        await this.props.fetchSignup({
            name,
            email,
            role,
            password,
        });
    }

    render() {
        const { name, role, roles, email, password, passwordRepeat } = this.state;

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
                                            <Form.Element
                                                label="Name"
                                                required={true}
                                                errorMessage={handleValidation(name)}
                                            >
                                                <Input
                                                    name="name"
                                                    onChange={(e) => { this.setState({ name: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    autoFocus={true}
                                                    value={name}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Role"
                                                required={true}
                                                errorMessage={handleValidation(role)}
                                            >
                                                <SelectDropdown
                                                    options={roles}
                                                    selectedOption={role}
                                                    onSelect={(e) => { this.setState({ role: e }) }}
                                                    buttonSize={ComponentSize.Medium}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Element
                                                label="Email"
                                                required={true}
                                                errorMessage={validateEmail(email)}
                                            >
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
                                            <Form.Element
                                                label="Password"
                                                required={true}
                                                errorMessage={isPasswordValid(password)}
                                            >
                                                <Input
                                                    name="password"
                                                    onChange={(e) => { this.setState({ password: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={password}
                                                    type={InputType.Password}
                                                />
                                            </Form.Element>
                                        </Grid.Column>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Password Repeat"
                                                required={true}
                                                errorMessage={isPasswordMatched(password, passwordRepeat)}
                                            >
                                                <Input
                                                    name="passwordRepeat"
                                                    onChange={(e) => { this.setState({ passwordRepeat: e.target.value }) }}
                                                    size={ComponentSize.Medium}
                                                    value={passwordRepeat}
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
        fetchSignup: (payload) => dispatch(fetchSignup(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignUp));