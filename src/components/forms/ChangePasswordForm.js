import React from "react";
import PropTypes from "prop-types";
import { Alert, Form, Button, Spinner } from "react-bootstrap";

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
          <Form.Control.Feedback type="invalid">
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
          <Form.Control.Feedback type="invalid">
            {errors.passwordConfirmation}
          </Form.Control.Feedback>
        </Form.Group>
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
