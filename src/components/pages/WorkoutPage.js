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
        this.addEvent({event: this.state.event, user: this.props.user})

            .catch(err => {this.setState({...this.state.errors, errors: err.response.data.errors, loading:false, success: false})})
    }

    setStartTime = () => {
        let now = new Date();
        this.setState({event: { startTime: now}})
    }

    setStopTime = () => {
        let now = new Date();
        this.setState({event: { stopTime: now}})
    }

    render(){
        const {workout, loading, modal} = this.state;
        return(
        <Container fluid >
            <SaveEventModal modal={modal} hideModal={this.hideModal} addEvent={this.addEvent}/>

            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1 >{workout.name}</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>

            {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            : 
            ( 
            <div>          
                <div style={{margin: "2rem 5% 0 5%", padding: " 5px 15px", backgroundColor: "rgba(255, 255, 255, 0.76)", borderRadius: "15px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)"}}>
                    <h5> Leírás </h5>
                    <p style={{ wordWrap: "break-word"}}>{workout.description}</p>
                </div>

                <StopWatch showModal={this.showModal} setStartTime={this.setStartTime} setStopTime={this.setStopTime}/>

                <ListGroup style={{margin: "2rem 1rem  2rem 1rem", borderRadius: "10px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)", width: "auto"}}>
                    <ListGroup.Item ><h5>{`Körök száma: ${workout.rounds}`}</h5></ListGroup.Item>
                    {
                        workout.exercises.map((exercise, index) =>{
                            return(
                                <ListGroup.Item index={index} key={index} style={{height: "auto", paddingLeft: "10%"}}>
                                    <ExerciseCard exercise={exercise} workoutName={workout.name}/>
                                </ListGroup.Item>
                                )

                        })
                    }
                </ListGroup>
            </div> 
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
