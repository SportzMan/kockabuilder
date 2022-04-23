import React from "react";
import {connect} from "react-redux";
import {addWorkout} from "../../actions/workouts";
import PropTypes from "prop-types";
import NewWorkoutForm from "../forms/NewWorkoutForm";
import {Container} from "react-bootstrap";

class NewWorkoutPage extends React.Component {

  submit = (workout) => this.props.addWorkout(workout).then(res => 
    this.props.history.push(`/update_workout/${res._id}`)
  )

  render(){

    return (
      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Új edzés létrehozása</h1>
        <hr />
      </div>
      <NewWorkoutForm submit={this.submit}/>
    </Container>
    )
  };
}

NewWorkoutPage.propTypes = {
  addWorkout: PropTypes.func.isRequired
};

export default connect(null, {addWorkout})(NewWorkoutPage);
