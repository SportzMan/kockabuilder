import React from "react";
import {connect} from 'react-redux';
import {updateExercise, deleteExercise, deleteFiles} from '../../actions/exercises';
import PropTypes from 'prop-types';
import UpdateExerciseForm from '../forms/UpdateExerciseForm';
import {Container} from "react-bootstrap";

class UpdateExercisePage extends React.Component {

  submit = (exercise) => 
  this.props.updateExercise(exercise)

  deleteItem = (exercise) => 
    this.props.deleteExercise(exercise).then(() =>{
      this.props.deleteFiles({thumbnailPath: exercise.thumbnailPath, filePath: exercise.filePath})
    })

  render() {
      return (
        <Container fluid style={{paddingTop: "0.4rem"}}>
          <h1 style={{paddingBottom: "1.5rem"}} >Gyakorlat módosítása</h1>
          <UpdateExerciseForm submit={this.submit} exercise={this.props.history.location.state} deleteItem={this.deleteItem}/>
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

  export default connect(null, {updateExercise, deleteExercise, deleteFiles})(UpdateExercisePage);