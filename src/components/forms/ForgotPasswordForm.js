import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Alert, Spinner, InputGroup, FormControl } from "react-bootstrap";
import Validator from 'validator';

class ForgotPasswordForm extends React.Component {
    state = {
      data: {
        email: ""
      },
      loading: false,
      errors: {}
    };
  
    onChange = e =>
      this.setState({
        ...this.state,
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
        if(!Validator.isEmail(data.email)) errors.email = "Hibás formátumú email címet adtál meg!";

        return errors;
    }

    render() {
        const {data, errors, loading} = this.state;

        return(
            <Form noValidate onSubmit={this.onSubmit}>
                {errors.global && <Alert variant="danger" >
                    <Alert.Heading>Hiba történt a művelet végrehajtása közben!</Alert.Heading>
                    <p>{errors.global}</p>
                    </Alert>}
                <InputGroup controlId="formBasicEmail">
                    <InputGroup.Text >Email</InputGroup.Text>
                    <FormControl
                        name="email"
                        type="email" 
                        placeholder="Enter email"
                        value={data.mail} 
                        onChange={this.onChange}
                        isInvalid={!!errors.email}
                    />
                    <FormControl.Feedback type='invalid'>
                        {errors.email}
                    </FormControl.Feedback>
                </InputGroup>
                {!loading ? (
                    <Button variant="primary" type="submit">Új jelszó igénylése</Button>
                ) : (
                    <Button variant="primary" disabled>
                        <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                        <span className="sr-only">Új jelszó igénylése...</span>
                    </Button>
                )  }
            </Form>
        );
    }
}

ForgotPasswordForm.propTypes = {
    submit: PropTypes.func.isRequired
  };
  
export default ForgotPasswordForm;