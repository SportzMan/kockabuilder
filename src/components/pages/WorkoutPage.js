import React from 'react';
import {Container, Spinner, ListGroup} from "react-bootstrap"
import {getWorkout} from "../../actions/workouts";
import {addEvent} from "../../actions/events";
import {connect} from "react-redux";
import ExerciseCard from "../cards/ExerciseCard";
import StopWatch from "../stopwatch/StopWatch";
import SaveEventModal from "../modals/SaveEventModal";
import PropTypes from "prop-types";
import "../CSS/pages/WorkoutPage.css";


class WorkoutPage extends React.Component{

    state={
        workout: {},
        loading: true,
        success: false,
        modal: false,
        errors:{},
        event: {
            startTime: "",
            stopTime: "",
            color: "#1ccb9e"
        }

    }

    componentDidMount(){
        this.props.getWorkout(this.props.match.params.workout).then(res => this.setState({...this.state.workout, workout: res, loading: false}))
    }

    hideModal = () => {
        this.setState({modal: false})
    }

    showModal = () => {
        this.setState({modal: true})
    }

    addEvent = () => {
        this.props.addEvent({title: this.state.workout.name, color: this.state.event.color, from: this.state.event.startTime, to: this.state.event.stopTime, user: this.props.user})

            .catch(err => {this.setState({...this.state.errors, errors: err.response.data.errors, loading:false, success: false})})
    }

    setStartTime = () => {
        let now = new Date();
        this.setState({...this.state.event, event: { startTime: now, color: this.state.event.color}})
    }

    setStopTime = () => {
        let now = new Date();
        this.setState({...this.state.event, event: { startTime: this.state.event.startTime, stopTime: now, color: this.state.event.color}})
    }

    render(){
        const {workout, loading, modal} = this.state;
        return(
        <Container fluid >
            <SaveEventModal modal={modal} hideModal={this.hideModal} addEvent={this.addEvent}/>

            <h1 >{workout.name}</h1>
            <hr/>

            {loading ? (<Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/>) 
            : 
            ( 
            <>          
                <div className="description-container" >
                    <h5> Leírás: </h5>
                    <p>{workout.description}</p>
                </div>

                <StopWatch showModal={this.showModal} setStartTime={this.setStartTime} setStopTime={this.setStopTime}/>

                {workout.workoutGroups.map((group, groupIndex) => {
                return(
                <ListGroup id="workout-browser-group" key={`group-${groupIndex}`} >
                    <ListGroup.Item ><h5>{`Körök száma: ${workout.workoutGroups[groupIndex].rounds}`}</h5></ListGroup.Item>
                    {
                        group.workoutExercises.map((exercise, exerciseIndex) =>{
                            return(
                                <ListGroup.Item key={`exercise-${exerciseIndex}`} index={exerciseIndex} style={{height: "auto", paddingLeft: "10%"}}>
                                    <ExerciseCard exercise={exercise} />
                                </ListGroup.Item>
                                )

                        })
                    }
                </ListGroup>
                )}
                )}
            </> 
            )
        }
            
        </Container>
        )
    }

}

WorkoutPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            workout: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}

function mapStateToProps(state){
    return{
        user: state.user
    };
  }

export default connect(mapStateToProps, {getWorkout, addEvent})(WorkoutPage);
