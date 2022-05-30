import React from "react";
import {connect} from "react-redux";
import {getWorkout, updateWorkout, deleteWorkout, deleteFile} from "../../actions/workouts";
import PropTypes from "prop-types";
import UpdateWorkoutForm from "../forms/UpdateWorkoutForm";
import {Alert, Container, Spinner} from "react-bootstrap";
import "../CSS/pages/UpdateWorkoutPage.css";

class UpdateWorkoutPage extends React.Component {

  state = {
    workout: {},
    loading: true,
    success: false,
    errors: {},
  }

  componentDidMount() {
    this.props.getWorkout(this.props.match.params.workout)
      .then(res => this.setState({ ...this.state.workout, workout: res, loading: false, success: true }))
      .catch((err) => {this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false})})
  }

  submit = (workout) => this.props.updateWorkout(workout)

  deleteItem = (workout) => 
  this.props.deleteWorkout(workout).then(() =>{
    this.props.deleteFile({thumbnailPath: workout.thumbnailPath})
  }).then(() => this.props.history.push(`/my_workouts`))

  render(){
    const {workout, loading, success, errors} = this.state;
    return (

      <Container fluid >
        <h1>Edzés módosítása</h1>
        <hr />
        {loading && !success && <Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true" /> }
        {!loading && success && <UpdateWorkoutForm submit={this.submit} workout={workout} deleteItem={this.deleteItem}/>}
        {!loading && !success && errors.global && <Alert variant="danger"> <p>{errors.global}</p></Alert>}
      </Container>
    )
  };
}

UpdateWorkoutPage.propTypes = {
  updateWorkout: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
        exercise: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
};

export default connect(null, {getWorkout, updateWorkout, deleteWorkout, deleteFile})(UpdateWorkoutPage);
