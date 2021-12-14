import React from "react";
import {connect} from 'react-redux';
import {addExercise} from '../../actions/exercises';
import PropTypes from 'prop-types';
import UpdateExerciseForm from '../forms/UpdateExerciseForm';
import {Container} from "react-bootstrap";

class UpdateExercisePage extends React.Component {

  submit = (exercise) => 
  this.props.updateExercise(exercise)

  render() {
      return (
        <Container fluid style={{paddingTop: "0.4rem"}}>
          <h1 style={{paddingBottom: "1.5rem"}} >Új gyakorlat hozzáadása</h1>
          <UpdateExerciseForm submit={this.submit}/>
        </Container>
      );
    }
  }

  UpdateExercisePage.propTypes ={
    addExercise: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
          xid: PropTypes.string.isRequired
      }).isRequired
  }).isRequired,
};

  export default connect(null, {addExercise})(UpdateExercisePage);