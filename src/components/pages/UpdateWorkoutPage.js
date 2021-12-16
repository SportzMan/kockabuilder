import React from "react";
import {connect} from "react-redux";
import {updateWorkout, deleteWorkout, deleteFile} from "../../actions/workouts";
import PropTypes from "prop-types";
import UpdateWorkoutForm from "../forms/UpdateWorkoutForm";
import {Container} from "react-bootstrap";

class UpdateWorkoutPage extends React.Component {

  submit = (workout) => this.props.updateWorkout(workout)

  deleteItem = (workout) => 
  this.props.deleteWorkout(workout).then(() =>{
    this.props.deleteFile({thumbnailPath: workout.thumbnailPath})
  })

  render(){
    return (

      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Edzés módosítása</h1>
        <hr />
      </div>
      <UpdateWorkoutForm submit={this.submit} workout={this.props.history.location.state} deleteItem={this.deleteItem}/>
    </Container>
    )
  };
}

UpdateWorkoutPage.propTypes = {
  updateWorkout: PropTypes.func.isRequired
};

export default connect(null, {updateWorkout, deleteWorkout, deleteFile})(UpdateWorkoutPage);
