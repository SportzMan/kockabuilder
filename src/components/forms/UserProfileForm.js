import React from "react";
import { Alert, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import Validator from "validator";
import PropTypes from "prop-types";
import api from "../../api";
import ItemDeleteModal from "../modals/ItemDeleteModal";

class UserProfileForm extends React.Component {
  state = {
    data: {
      email: this.props.email,
      username: "",
      isAdmin: null,
      isTrainer: null,
      membership: "",
    },
    modal: false,
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
        this.setState({...this.state.data, data: user, loading: false, success: true});
      })
      .catch(() =>
        this.setState({loading: false,success: false})
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

  hideModal = () => {
    this.setState({modal: false})
  };

  showModal = () => {
    this.setState({modal: true})
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
        .then(() => {this.setState({mLoading: false, mSuccess: true});
          setTimeout(() => { this.setState({ mSuccess: false})}, 5000)})
        .catch((err) => this.setState({...this.state.errors, errors: err.response.data.errors, mLoading: false, mSuccess: false}))
    }
  };

  validate = (data) => {
    const errors = {};

    if (!Validator.isEmail(data.email)) errors.email = "Hibás email formátum!";

    return errors;
  };

  render() {
    const { data, loading, success, mLoading, mSuccess, errors, modal } = this.state;

    return (
      <Form noValidate onSubmit={this.onSubmit}>
        <ItemDeleteModal modal={modal} name="a felhasználót" item={data} buttonName="Felhasználó" hideModal={this.hideModal} deleteItem={this.props.deleteItem}/>
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
            <InputGroup controlid="formUsername">
              <InputGroup.Text>Felhasználónév</InputGroup.Text>
              <Form.Control
                name="username"
                type="username"
                value={data.username}
                onChange={this.onChange}
                disabled
              />
              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </InputGroup>
            <InputGroup controlid="formBasicEmail">
              <InputGroup.Text>Email</InputGroup.Text>
              <Form.Control
                name="email"
                type="email"
                value={data.email}
                onChange={this.onChange}
                isInvalid={!!errors.email}
                disabled
              />
              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </InputGroup>
            <InputGroup controlid="formMembership">
              <InputGroup.Text>Tagság érvényessége</InputGroup.Text>
              <br></br>

              <Form.Control
                name="membership"
                type="date"
                value={data.membership.split("T")[0]}
                onChange={this.onChange}
                isInvalid={!!errors.membership}
              />
            </InputGroup>
            <h6>Jogosultságok</h6>
            <InputGroup controlid="formUserRights">
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
            </InputGroup>
            <br></br>
            <div className="manage-control-buttons">
              {!mLoading ? (
                <Button variant="primary" type="submit"> Módosít </Button>
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
              <Button variant="outline-danger" onClick={this.showModal}> Törlés </Button>
              <Button variant="outline-secondary" onClick={this.props.resetSelectedMail}> Mégse </Button>
            </div>
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
