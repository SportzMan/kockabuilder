import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Spinner } from "react-bootstrap";

class ResetPasswordForm extends React.Component {
    state = {
      data: {
        token: this.props.token,
        password: "",
        passwordConfirmation: ""
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

    validate = data => {
        const errors = {};
        if (!data.password) errors.password = "Nem lehet üresen hagyni!";
        if (data.password !== data.passwordConfirmation)
          errors.password = "A jelszavaknak egyezniük kell!";
        return errors;
    };

    render() {
        const { errors, data, loading } = this.state;
    
        return(
            <Form noValidate onSubmit={this.onSubmit}>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Új jelszó</Form.Label>
                    <Form.Control
                        name="password"
                        type="password" 
                        placeholder="******"
                        value={data.password} 
                        onChange={this.onChange}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Új jelszó ismét</Form.Label>
                    <Form.Control
                        name="passwordConfirmation"
                        type="password" 
                        placeholder="******"
                        value={data.passwordConfirmation} 
                        onChange={this.onChange}
                        isInvalid={!!errors.passwordConfirmation}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.passwordConfirmation}
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
        );
    }
}

ResetPasswordForm.propTypes = {
    submit: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired
  };
  
  export default ResetPasswordForm;