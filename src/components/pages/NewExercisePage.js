import React from "react";
import {connect} from 'react-redux';
import {addExercise} from '../../actions/exercises';
import PropTypes from 'prop-types';
import NewExerciseForm from '../forms/NewExerciseForm';
import {Container} from "react-bootstrap";

class NewExercisePage extends React.Component {

  submit = (exercise) => 
  this.props.addExercise(exercise).then(() => this.props.history.push("/edit_exercise/xid"));

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
    addExercise: PropTypes.func.isRequired
};

  export default connect(null, {addExercise})(NewExercisePage);