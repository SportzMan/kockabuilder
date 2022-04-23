import React from "react";
import {connect} from "react-redux";
import {getWorkout, updateWorkout, deleteWorkout, deleteFile} from "../../actions/workouts";
import PropTypes from "prop-types";
import UpdateWorkoutForm from "../forms/UpdateWorkoutForm";
import {Container, Spinner} from "react-bootstrap";

class UpdateWorkoutPage extends React.Component {

  state = {
    workout: {},
    loading: true,
    success: false
  }

  componentDidMount() {
    this.props.getWorkout(this.props.match.params.workout)
      .then(res => this.setState({...this.state.workout, workout: res, loading: false, succes: true}))
      .catch(err => {this.setState({...this.state.errors, errors: err.response.data.errors, loading:false, success: false})})
  }

  submit = (workout) => this.props.updateWorkout(workout)

  deleteItem = (workout) => 
  this.props.deleteWorkout(workout).then(() =>{
    this.props.deleteFile({thumbnailPath: workout.thumbnailPath})
  })

  render(){
    const {workout, loading, success} = this.state;
    return (

      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Edzés módosítása</h1>
        <hr />
      </div>
      {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
      : (
      <UpdateWorkoutForm submit={this.submit} workout={workout} deleteItem={this.deleteItem}/>
      )}
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
