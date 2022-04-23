import React from "react";
import {connect} from 'react-redux';
import {getExercise, updateExercise, deleteExercise, deleteFiles} from '../../actions/exercises';
import PropTypes from 'prop-types';
import UpdateExerciseForm from '../forms/UpdateExerciseForm';
import {Container} from "react-bootstrap";

class UpdateExercisePage extends React.Component {

  state = {
    exercise: {}
  }

  componentDidMount() {
    this.props.getExercise(this.props.match.params.exercise)
    .then(res => this.setState({...this.state.exercise, exercise: res}))
  }

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
          <UpdateExerciseForm submit={this.submit} exercise={this.state.exercise} deleteItem={this.deleteItem}/>
        </Container>
      );
    }
  }

  UpdateExercisePage.propTypes ={
    addExercise: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
          exercise: PropTypes.string.isRequired
      }).isRequired
  }).isRequired,
};

  export default connect(null, {getExercise, updateExercise, deleteExercise, deleteFiles})(UpdateExercisePage);