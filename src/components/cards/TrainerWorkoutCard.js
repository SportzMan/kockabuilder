import React from "react";
import {getWorkout} from "../../actions/workouts";
import {connect} from "react-redux";
import {Button, Spinner} from "react-bootstrap";
import {MdOutlineCancel} from "react-icons/md";
import "../CSS/cards/TrainerWorkoutCard.css";

class TrainerWorkoutCard extends React.Component{

    state = {
        workout: {},
        loading: true,
        errors: {}
    }

    componentDidMount(){
        this.props.getWorkout(this.props.workout)
        .then(res => {
            this.setState({...this.state.workout, workout: res, loading: false})
        })
        .catch(err => this.setState({ errors: err.response.data.errors , loading: false}))

    }

    render(){
        const {workout, loading} = this.state;

        return(
            <div className="workoutCard" >
                {loading ? (<Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/>) 
            : (
                <>
                    <Button variant="outline-danger" id="workout-remove-button" onClick={() => this.props.removeWorkout(this.props.index)}>
                        <MdOutlineCancel id="workout-remove-icon"/>
                    </Button>
                    <img  className="card-img" src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${workout.thumbnailPath}`} alt="thumbnail" />
                    <div  className="workout-info">
                        <h4> {`${this.props.index+1}. nap`} </h4>
                        <h5> {`${workout.name}`} </h5>

                    </div>
                </> )}
            </div>
        )
    }
}

export default connect(null, {getWorkout})(TrainerWorkoutCard)