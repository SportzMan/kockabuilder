import React from 'react';
import RegisterForm from '../forms/RegisterForm';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {register} from '../../actions/users';
import { Container } from "react-bootstrap";
import "../CSS/pages/RegisterPage.css";


class RegisterPage extends React.Component{

    submit = data => 
        this.props.register(data).then(() => this.props.history.push('/dashboard'));

    render(){
        return(
            <Container fluid>
                <h1 id="title">Regisztráció</h1>
                <hr/>
                <RegisterForm submit={this.submit}/>
            </Container>
        );
    }
}

RegisterPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    register: PropTypes.func.isRequired
};
export default connect(null, {register})(RegisterPage);
