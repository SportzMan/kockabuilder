import React from "react";
import {connect} from 'react-redux';
import {updateMyProfile} from "../../actions/users"
import PropTypes from 'prop-types';
import ProfileForm from '../forms/ProfileForm';
import {Container} from "react-bootstrap";


class ProfilePage extends React.Component {
  submit = (data) => this.props.updateMyProfile(data)

// https://www.w3schools.com/jsref/met_win_settimeout.asp

  render() {
      return (
        <Container fluid>
          <h1>Profilom</h1>
          <ProfileForm submit={this.submit} user={this.props.user}/>
        </Container>
      );
    }
  }

function mapStateToProps(state){
  return{
      user: state.user
  };
}

ProfilePage.propTypes ={
  updateMyProfile: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired
};

  export default connect(mapStateToProps, {updateMyProfile})(ProfilePage);