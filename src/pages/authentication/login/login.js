import React from 'react';
import './login.css';
import { Form } from 'react-bootstrap';
import { Link, Redirect} from 'react-router-dom';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            userID: '',
            email: '',
            password: '',
            errorMessage: '',
        };

        this.handleInput = this.handleInput.bind(this);
        this.loggingIn = this.loggingIn.bind(this);
    }

    checkRedir = () => {
        //// Check if want to redirect to Team page ////
        if (this.state.redirect) {
            return <Redirect to= "/"/>
        }
    }

    loggingIn() {
        //// Logging process for clicking Log In button ////

        // reset the input fields
        let userEmail = this.state.email;
        if (userEmail === '') {
            userEmail = null;
        }
        let userPassword = this.state.password;
        if (userPassword === '') {
            userPassword = null;
        }

        // send Login request to backend
        fetch('http://localhost:443/login', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                password : userPassword
            }),
        })
            .then(res => {
                if (res.status === 401) throw new Error(res.status);   // reponse has problems
                else if (res.status === 200) {                         // reponse OK
                    return res.json();
                }
            })
            .then(data => {
                this.props.parentCallback({value: data.token, id:data.userID}); // send received user token and id after successful log in
                this.setState({ redirect : true });                             // redirect to Team page
                console.log('Success:', data);                                  // show success data
            })
            .catch((error) => {
                this.setState({ errorMessage : 'Incorrect email or password!'}); // show the Error message if reponse has problems
                console.error('Error:', error);
            });
    }

    handleInput({ target }) {
        //// Set values from input fields to states ////
        this.setState({
        [target.name]: target.value
        });
    }

    render() {
        return (
            <div className="authenticationWrapper">
                {/* Check if need to be redirected to Team page */}
                {this.checkRedir()}
                {/* Login form, Login contents */}
                <div className="loginContainer">
                    <h2 id="loginTitle">Login to Speckio</h2>
                    <div className="formContainer" id="loginForm">
                        <Form className="loginForm">
                            <Form.Group>
                                <Form.Label id="loginInputLabel">Email Address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="name@example.com..."
                                    name="email"
                                    id="email"
                                    value={this.state.email}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label id="loginInputLabel">Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>

                            { this.state.errorMessage &&
                            <p className="error"> { this.state.errorMessage } </p> }

                            <Form.Check 
                                type="checkbox"
                                id="rememberCheck"
                                label="Remember Me"
                            />

                            <button id="logIn" type="button" onClick={this.loggingIn}>Log In</button>
                        </Form>
                        <div className="linkContainer">
                            <Link className="linkBtn" id="registerBtn" to="/register">Register</Link>
                            {/* "Lost your password" button needs to be developed */}
                            <Link className="linkBtn" id="lostpasswordBtn" to="/undef">Lost your password?</Link>
                        </div>
                        <div className="backToHomeContainer">
                            <a className="linkBtn" href="http://speckio.struthers.id.au/">← Back to Speckio</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;