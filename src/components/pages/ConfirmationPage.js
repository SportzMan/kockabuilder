import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Container} from 'react-bootstrap';
import {connect} from 'react-redux';
import {confirm} from '../../actions/auth';


class ConfirmationPage extends React.Component{
    state = {
        loading:true,
        success: false
    };

    componentDidMount() {
        this.props.confirm(this.props.match.params.token)
        .then(() => this.setState({loading: false, success: true}))
        .catch(() => this.setState({ loading: false, success: false}));
    };

    render(){
        const {loading, success} = this.state;

        return(
            <Container fluid id="confirm">
                {loading && (
                <Alert>
                    <Alert.Heading> Email cím érvényesítése</Alert.Heading>
                </Alert>
                )}

                {!loading && success &&(
                <Alert>
                    <Alert.Heading> A fiók sikeresen aktiválásra került.</Alert.Heading>
                </Alert>
                )}

                {!loading && !success &&(
                    <Alert>
                        <Alert.Heading> A hivatkozás nem érvényes! </Alert.Heading>

                    </Alert>
                )}
            </Container>
        );
    }
}

ConfirmationPage.propTypes = {
    confirm: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            token: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default connect(null, {confirm})(ConfirmationPage);
