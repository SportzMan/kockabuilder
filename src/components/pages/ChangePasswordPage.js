import React from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {validateToken, changePassword} from '../../actions/auth';
import ChangePasswordForm from '../forms/ChangePasswordForm';


class ChangePasswordPage extends React.Component{
    state = {
        loading: true,
        success: false
    }

componentDidMount(){
    this.props.validateToken(this.props.token)
    .then(()=> this.setState({loading:false, success: true}))
    .catch(() => this.setState({loading: false, success: false}));
}

submit = (data) => this.props.changePassword(data)


    render(){
        const {loading, success} = this.state;
        const token = this.props.token;
        return(
            <Container fluid>
                {loading && <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />}
                {!loading && success && <h1>Jelszócsere</h1>}
                {!loading && success && <ChangePasswordForm submit={this.submit} token={token}/>}
                {!loading && ! success && <Alert variant="danger">Érvénytelen kérés.</Alert>}
            </Container>
        );
    }
}

function mapStateToProps(state){
    return{
        token: state.user.token
    };
  }

ChangePasswordPage.propTypes = {
    validateToken: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {validateToken, changePassword})(ChangePasswordPage);