import React from "react";
import {connect} from 'react-redux';
import {getExercise, updateExercise, deleteExercise, deleteFiles} from '../../actions/exercises';
import PropTypes from 'prop-types';
import UpdateExerciseForm from '../forms/UpdateExerciseForm';
import {Alert, Container, Spinner} from "react-bootstrap";
import "../CSS/pages/UpdateExercisePage.css";

class UpdateExercisePage extends React.Component {

  state = {
    exercise: {},
    loading: true,
    success: false,
    errors: {}
  }

  componentDidMount() {
    this.props.getExercise(this.props.match.params.exercise)
      .then(res => this.setState({...this.state.exercise, exercise: res, loading: false, success: true}))
      .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, succes: false}))
  }

  submit = (exercise) => 
    this.props.updateExercise(exercise)

  deleteItem = (exercise) => 
    this.props.deleteExercise(exercise)
      .then(() =>{
        this.props.deleteFiles({thumbnailPath: exercise.thumbnailPath, filePath: exercise.filePath})
      }).then(() => this.props.history.push(`/`))

  render() {
    const {exercise, loading, success, errors} = this.state;

    return (
      <Container fluid >
        <h1 >Gyakorlat módosítása</h1>
        <hr />

        {loading && !success && <Spinner id="lodaing-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/>}

        {!loading && !success && errors.global && <Alert variant="danger"> {errors.global} </Alert>}
                  
        {!loading && success && <UpdateExerciseForm submit={this.submit} exercise={exercise} deleteItem={this.deleteItem}/>}

      </Container>

      );
    }
  }

  UpdateExercisePage.propTypes ={
    match: PropTypes.shape({
      params: PropTypes.shape({
          exercise: PropTypes.string.isRequired
      }).isRequired
  }).isRequired,
};

  export default connect(null, {getExercise, updateExercise, deleteExercise, deleteFiles})(UpdateExercisePage);