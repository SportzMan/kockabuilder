import React from "react";
import { Alert, Form, Button, Spinner } from "react-bootstrap";
import Validator from "validator";
import PropTypes from "prop-types";
import api from "../../api";

class UserProfileForm extends React.Component {
  state = {
    data: {
      email: this.props.email,
      username: "",
      isAdmin: null,
      isTrainer: null,
      membership: "",
    },
    loading: true,
    success: false,
    mLoading: false,
    mSuccess: false,
    errors: {},
  };

  componentDidMount() {
    api.user
      .getUserInfo(this.state.data)
      .then((user) => {
        this.setState({
          ...this.state.data,
          data: user,
          loading: false,
          success: true
        });
      })
      .catch(() =>
        this.setState({
          loading: false,
          success: false
        })
      );
  }

  onChange = (e) =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });

  handleAdminChange = () => {
    this.setState({
      data: { ...this.state.data, isAdmin: !this.state.data.isAdmin },
    });
  };

  handleTrainerChange = () => {
    this.setState({
      data: { ...this.state.data, isTrainer: !this.state.data.isTrainer },
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate(this.state.data);
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.setState({ mLoading: true});
      this.props
        .submit(this.state.data)
        .then(() => {this.setState({mLoading: false, mSuccess: true})
          setTimeout(() => { this.setState({ mSuccess: false})}, 5000)})
        .catch((err) => this.setState({errors: err.response.data.errors, mLoading: false, mSuccess: false}))
    }
  };

  validate = (data) => {
    const errors = {};

    if (!Validator.isEmail(data.email)) errors.email = "Hibás email formátum!";

    return errors;
  };

  render() {
    const { data, loading, success, mLoading, mSuccess, errors } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>

        {errors.global && 
          <Alert  variant="success"> 
            <Alert.Heading> Hiba! </Alert.Heading>
            <p>erros.global</p>
          </Alert>}

        {!mLoading && mSuccess && <Alert  variant="success"> Sikeresen frissítette a felhasználó profilját!</Alert>}

        {loading && !success && (
          <Spinner
            as="span"
            animation="border"
            size="xxxl"
            role="status"
            aria-hidden="true"
          />
        )}
        {!loading && success && (
          <>
            <Form.Group controlId="formUsername">
              <Form.Label>Felhasználónév</Form.Label>
              <Form.Control
                name="username"
                type="username"
                value={data.username}
                onChange={this.onChange}
                disabled
              />
              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={data.email}
                onChange={this.onChange}
                isInvalid={!!errors.email}
                disabled
              />
              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formMembership">
              <Form.Label>Tagság érvényessége</Form.Label>
              <br></br>

              <Form.Control
                name="membership"
                type="date"
                value={data.membership.split("T")[0]}
                onChange={this.onChange}
                isInvalid={!!errors.membership}
              />
            </Form.Group>
            <Form.Group controlId="formUserRights">
              <Form.Label>Jogosultságok</Form.Label>
              <br></br>
              <Form.Check
                inline
                name="isAdmin"
                type="checkbox"
                label="Admin"
                onChange={this.handleAdminChange}
                checked={this.state.data.isAdmin}
              />
              <Form.Check
                inline
                name="isTrainer"
                type="checkbox"
                label="Edző"
                checked={this.state.data.isTrainer}
                onChange={this.handleTrainerChange}
              />
            </Form.Group>
            <br></br>
            {!mLoading ? (
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
            )}{" "}
            <Button variant="secondary" onClick={this.props.resetSelectedMail}>
              Mégse
            </Button>
          </>
        )}
      </Form>
    );
  }
}

UserProfileForm.propTypes = {
    email: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired
};

export default UserProfileForm;
