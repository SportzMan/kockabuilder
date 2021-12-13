import React from 'react';
import {Form, Button, Alert, Spinner} from 'react-bootstrap';
import Validator from 'validator';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class LoginForm extends React.Component{

    state = {
        data: {
            email: "",
            password: ""
        },
        loading: false,
        errors: {}
    };

    onChange = e =>
        this.setState({
            data: { ...this.state.data, [e.target.name]: e.target.value }
        });

    onSubmit = (e) => {
        e.preventDefault();

        const errors = this.validate(this.state.data);
        if (Object.keys(errors).length > 0){
            this.setState({errors});
        } else {
            this.setState({loading: true})
            this.props
                .submit(this.state.data)
                .catch(err => this.setState({ errors: err.response.data.errors , loading: false}));
        }
        
    }

    validate = (data) => {
        const errors = {};

        if(!Validator.isEmail(data.email)) errors.email = "Hibás email formátum!";
        if (!data.password) errors.password = "Hibás jelszót adtál meg!";
        if (data.password.length < 1) errors.password = "Töltsd ki a jelszómezőt!";

        return errors;
    }

    render(){
        const {data, errors, loading} = this.state;

        return(
            <Form noValidate onSubmit={this.onSubmit}>
                {errors.global && <Alert variant="danger" >
                    <Alert.Heading>Amanóba! Hiba történt a művelet végrehajtása közben.</Alert.Heading>
                    <p>{errors.global}</p>
                    </Alert>}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label >Email</Form.Label>
                    <Form.Control
                        name="email"
                        type="email" 
                        placeholder="Enter email"
                        value={data.email} 
                        onChange={this.onChange}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control
                        name="password"
                        type="password" 
                        placeholder="Password"
                        value={data.password} 
                        onChange={this.onChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <br></br>
                <span><Link to="/forgot_password">Elfelejtett jelszó?</Link></span>
                <br></br>
                {!loading ? (
                    <Button variant="primary" type="submit">Belépés</Button>
                  ) : (
                    <Button variant="primary" disabled>
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        <span className="sr-only">Belépés...</span>
                    </Button>
                  )  }
                {' '}<Button variant="secondary" as={Link} to="/register">Regisztráció</Button>
            </Form>
        );
    }
}

LoginForm.propTypes = {
    submit: PropTypes.func.isRequired
};

export default LoginForm;