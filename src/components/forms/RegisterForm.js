import React from 'react';
import {Form, Button, Alert, Spinner, InputGroup, FormControl} from 'react-bootstrap';
import Validator from 'validator';
import PropTypes from 'prop-types';


class RegisterForm extends React.Component{

    state = {
        data: {
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
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
                .then(() => this.setState({loading: false}))
                .catch(err => this.setState({ errors: err.response.data.errors , loading: false}));

        }
        
    }

    validate = (data) => {
        const errors = {};

        if(data.username.length < 1) errors.username = "Kérem adjon meg egy felhásználóvenet!";
        if(!Validator.isEmail(data.email)) errors.email = "Hibás email címet adtál meg!";
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
                <InputGroup controlId="formBasicEmail">
                    <InputGroup.Text >Felhasználónév</InputGroup.Text>
                    <FormControl
                        name="username"
                        type="username" 
                        placeholder="Adjon meg egy felhasználónevet"
                        value={data.username} 
                        onChange={this.onChange}
                        isInvalid={!!errors.username}
                    />
                    <FormControl.Feedback type='invalid'>
                        {errors.email}
                    </FormControl.Feedback>
                </InputGroup>
                <InputGroup controlId="formBasicEmail">
                    <InputGroup.Text >Email</InputGroup.Text>
                    <FormControl
                        name="email"
                        type="email" 
                        placeholder="Adja meg az email címét"
                        value={data.email} 
                        onChange={this.onChange}
                        isInvalid={!!errors.email}
                    />
                    <FormControl.Feedback type='invalid'>
                        {errors.email}
                    </FormControl.Feedback>
                </InputGroup>
                <InputGroup controlId="formBasicPassword">
                    <InputGroup.Text>Jelszó</InputGroup.Text>
                    <FormControl
                        name="password"
                        type="password" 
                        placeholder="******"
                        value={data.password} 
                        onChange={this.onChange}
                        isInvalid={!!errors.password}
                    />
                    <FormControl.Feedback type='invalid'>
                        {errors.password}
                    </FormControl.Feedback>
                </InputGroup>
                {!loading ? (
                    <Button variant="primary" type="submit">Regisztráció</Button>
                  ) : (
                    <Button variant="primary" disabled>
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        <span className="sr-only">Regisztráció...</span>
                    </Button>
                  )  }
            </Form>
        );
    }
}

RegisterForm.propTypes = {
    submit: PropTypes.func.isRequired
};

export default RegisterForm;