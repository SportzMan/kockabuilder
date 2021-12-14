import React from "react";
import {connect} from 'react-redux';
import {addExercise} from '../../actions/exercises';
import PropTypes from 'prop-types';
import NewExerciseForm from '../forms/NewExerciseForm';
import {Container} from "react-bootstrap";
import api from "../../api";

class NewExercisePage extends React.Component {

  submit = (exercise) => 
  api.exercise.addExercise(exercise).then((res) => this.props.history.push("/add_workout/"));

  render() {
      return (
        <Container fluid style={{paddingTop: "0.4rem"}}>
          <h1 style={{paddingBottom: "1.5rem"}} >Új gyakorlat hozzáadása</h1>
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