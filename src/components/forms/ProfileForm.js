import React from 'react';
import {Form, Button, Alert, Spinner} from 'react-bootstrap';
import Validator from 'validator';
import PropTypes from 'prop-types';

class ProfileForm extends React.Component{

    state = {
        data: {
            email: this.props.user.email,
            username: this.props.user.username
        },
        success: false,
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
                .then(() => {
                    this.setState({ loading: false, success: true});
                    setTimeout(() => { this.setState({ success: false})
                    }, 5000);
                  })
                    .catch(() => this.setState({loading: false, success: false}))
        }
        
    }

    validate = (data) => {
        const errors = {};

        if(!Validator.isEmail(data.email)) errors.email = "Hibás email formátum!";

        return errors;
    }

    render(){
        const {data, errors, loading, success} = this.state;

        return(
            <Form noValidate onSubmit={this.onSubmit}>
                {errors.global && <Alert variant="danger" >
                    <Alert.Heading>Amanóba! Hiba történt a művelet végrehajtása közben.</Alert.Heading>
                        <p>{errors.global}</p>
                    </Alert>}
                {!loading&&success&&<Alert variant="success"> Sikeresen frissítette a profilját! </Alert>}
                
                <Form.Group controlId="formUsername">
                    <Form.Label >Felhasználónév</Form.Label>
                    <Form.Control
                        name="username"
                        type="username" 
                        value={data.username} 
                        onChange={this.onChange}
                        isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label >Email</Form.Label>
                    <Form.Control
                        name="email"
                        type="email" 
                        value={data.email} 
                        onChange={this.onChange}
                        isInvalid={!!errors.email}
                        disabled
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <br></br>
                {!loading ? (
                    <Button variant="primary" type="submit">Módosít</Button>
                  ) : (
                    <Button variant="primary" disabled>
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        <span className="sr-only">Módosít...</span>
                    </Button>
                  )  }
            </Form>
        )
    }
}

ProfileForm.propTypes = {
    submit: PropTypes.func.isRequired,
    user: PropTypes.shape({
        email: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired})
    .isRequired
};

export default ProfileForm;