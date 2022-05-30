import React from "react";
import PropTypes from "prop-types";
import { Alert, Form, Button, Spinner, InputGroup, FormControl } from "react-bootstrap";

class ResetPasswordForm extends React.Component {
  state = {
    data: {
      token: this.props.token,
      password: "",
      passwordConfirmation: "",
    },
    loading: false,
    success: false,
    errors: {},
  };

  onChange = (e) =>
    this.setState({
      ...this.state,
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });

  onSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate(this.state.data);
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });
      this.props
        .submit(this.state.data)
        .then(() => this.setState({ loading: false, success: true }))
        .catch((err) =>
          this.setState({ errors: err.response.data.errors, loading: false })
        );
      setTimeout(() => {
        this.setState({ success: false });
      }, 5000);
    }
  };

  validate = (data) => {
    const errors = {};
    if (!data.password) errors.password = "Nem hagyható üresen a jelszó mező!";
    if (data.password !== data.passwordConfirmation)
      errors.password = "A megadott jelszavak nem egyeznek meg!";
    return errors;
  };

  render() {
    const { errors, data, loading, success } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>
        {!loading && success && (
          <Alert variant="success"> Sikeresen módosította a jelszavát!</Alert>
        )}
        {errors.global && (
          <Alert variant="danger">
            <Alert.Heading>Hiba!</Alert.Heading>
            <p>{errors.global}</p>
          </Alert>
        )}
        <InputGroup controlId="formBasicPassword">
          <InputGroup.Text>Új jelszó</InputGroup.Text>
          <FormControl
            name="password"
            type="password"
            placeholder="******"
            value={data.password}
            onChange={this.onChange}
            isInvalid={!!errors.password}
          />
          <FormControl.Feedback type="invalid">
            {errors.password}
          </FormControl.Feedback>
        </InputGroup>
        <InputGroup controlId="formBasicPassword">
          <InputGroup.Text>Új jelszó ismét</InputGroup.Text>
          <FormControl
            name="passwordConfirmation"
            type="password"
            placeholder="******"
            value={data.passwordConfirmation}
            onChange={this.onChange}
            isInvalid={!!errors.passwordConfirmation}
          />
          <FormControl.Feedback type="invalid">
            {errors.passwordConfirmation}
          </FormControl.Feedback>
        </InputGroup>
        <br></br>
        {!loading ? (
          <Button variant="primary" type="submit">
            Módosít
          </Button>
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
        )}
      </Form>
    );
  }
}

ResetPasswordForm.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default ResetPasswordForm;
