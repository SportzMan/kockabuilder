import React from "react";
import {connect} from 'react-redux';
import {addExercise} from '../../actions/exercises';
import PropTypes from 'prop-types';
import NewExerciseForm from '../forms/NewExerciseForm';
import {Container} from "react-bootstrap";
import api from "../../api";
import "../CSS/pages/NewExercisePage.css";

class NewExercisePage extends React.Component {

  submit = (exercise) => 
  api.exercise.addExercise(exercise).then(res =>
    this.props.history.push(`/edit_exercise/${res._id}`)
);

  render() {
      return (
        <Container id="container" fluid>
          <h1 >Új gyakorlat hozzáadása</h1>
          <hr/>
          <NewExerciseForm submit={this.submit}/>
        </Container>
      );
    }
  }

  NewExercisePage.propTypes ={
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    addExercise: PropTypes.func.isRequired
};

  export default connect(null, {addExercise})(NewExercisePage);