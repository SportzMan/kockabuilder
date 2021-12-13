import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button, Container} from 'react-bootstrap';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';
import {resetPasswordRequest} from '../../actions/auth';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";

class ForgotPasswordPage extends React.Component{
    state = {
        success: false
    }

    submit = data => this.props
    .resetPasswordRequest(data)
    .then(() => this.setState({ success: true}));

    render(){
        return(
            <Container fluid>
                <h2>Új jelszó igénylése</h2>
                {this.state.success ? <div><Alert variant="primary"> A levelet elküldtük a megadott címre!</Alert>
                <Button variant="secondary" as={Link} to="/login">Vissza</Button> </div>: 
                <ForgotPasswordForm submit ={this.submit}/>}
            </Container>
        );
    }
}

ForgotPasswordPage.propTypes = {
    resetPasswordRequest: PropTypes.func.isRequired
};

export default connect(null, {resetPasswordRequest})(ForgotPasswordPage);