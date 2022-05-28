import React from "react";
import {connect} from 'react-redux';
import {login} from '../../actions/auth';
import PropTypes from 'prop-types';
import LoginForm from '../forms/LoginForm';
import {Container} from "react-bootstrap";


class LoginPage extends React.Component {
  
  submit = (data) => 
  this.props.login(data).then(() => this.props.history.push("/"));

  render() {
      return (
        <Container fluid>
          <h1>Belépés</h1>
          <hr/>
          <LoginForm submit={this.submit}/>
        </Container>
      );
    }
  }

LoginPage.propTypes ={
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    login: PropTypes.func.isRequired
};

  export default connect(null, {login})(LoginPage);