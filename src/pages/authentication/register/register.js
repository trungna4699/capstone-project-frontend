import React from 'react';
import './register.css';
import { Form } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            email: '',
            password: '',
            firstName:'',
            lastName:'',
            company:'',
            successMessage: '',
            errorMessage: '',
        };

        this.handleInput = this.handleInput.bind(this);
        this.registering = this.registering.bind(this);
    }

    registering() {
        // logging process
        this.setState({
            successMessage : '',
            errorMessage: '',
        });

        let userEmail = this.state.email;
        if (userEmail === '') {
            userEmail = null;
        }
        let userPassword = this.state.password;
        if (userPassword === '') {
            userPassword = null;
        }
        const userFirstName = this.state.firstName;
        const userLastName = this.state.lastName;
        const userCompany = this.state.company;

        console.log(userEmail);
        console.log(userPassword);
        console.log(userFirstName);
        console.log(userLastName);
        console.log(userCompany);

        fetch('http://localhost:443/register', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
                firstName: userFirstName,
                lastName: userLastName,
                // company: userCompany,
                orgID: 1,
            }),
        })
            .then(res => {
                if (res.status === 400) throw new Error(res.status);
                else if (res.status === 201) {
                    return res.json();
                }
            })
            .then(data => {
                console.log('Success: ', data.message);
                this.setState({ 
                    successMessage : 'Registered successfully!!!'
                });
            })
            .catch((error) => {
                console.log(error);
                console.error('Error (fail when connecting to backend):', error);
                this.setState({ 
                    errorMessage : 'Input fields missing or this email is already registered! Please fill all the fields or change the email!'
                });
            });

        this.setState({
            email: '',
            password: '',
            firstName:'',
            lastName:'',
        });
    }

    handleInput({ target }) {
        this.setState({
        [target.name]: target.value
        });
    }

    render() {
        return (
            <div className="authenticationWrapper">
                <div className="registerContainer">
                    <h2 id="registerTitle">Registration</h2>
                    <div className="formContainer" id="registerForm">
                        <Form className="registerForm">
                            <Form.Group>
                                <Form.Label id="registerInputLabel">First name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="firstName"
                                    id="firstName"
                                    value={this.state.firstName}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label id="registerInputLabel">Last name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="lastName"
                                    id="lastName"
                                    value={this.state.lastName}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label id="registerInputLabel">Email Address</Form.Label>
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
                                <Form.Label id="registerInputLabel">Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label id="registerInputLabel">Company</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="company"
                                    id="company"
                                    value={this.state.company}
                                    onChange={ this.handleInput }
                                />
                            </Form.Group>
                            
                            <div className="noteContainer">
                                <p>Note: Registration confirmation will be emailed to you.</p>
                            </div>

                            { this.state.successMessage &&
                            <p className="successMessage"> { this.state.successMessage } </p> }

                            { this.state.errorMessage &&
                            <p className="errorMessage"> { this.state.errorMessage } </p> }

                            <button id="register" type="button" onClick={this.registering}>Register</button>
                        </Form>
                        <div className="linkContainer">
                            <Link className="linkBtn" id="logInBtn" to="/login">Log In</Link>
                            <Link className="linkBtn" id="lostpasswordBtn" to="/undefined">Lost your password?</Link>
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
export default Register;