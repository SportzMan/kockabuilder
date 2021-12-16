import React from "react";
import {getWorkout} from "../../actions/workouts";
import {connect} from "react-redux";

class WorkoutCard extends React.Component{

    state = {
        workout: {}
    }

    componentDidMount(){
        console.log(this.props.workout)
        this.props.getWorkout(this.props.workout).then(res => {
            console.log(res)
            this.setState({...this.state.workout, workout: res})
        })
    }

    render(){
        const {workout} = this.state;
        return(
            <div style={{ width: "320px", position: "relative",  marginBottom: "1rem" }} className="workoutCard" >
                <img  className="card-img" src={workout.thumbnailPath} alt="thumbnail"/>
                <div  className="workout-info">
                    <h3> {`${workout.name}`} </h3>

                </div>
            </div>
        )
    }
}

export default connect(null, {getWorkout})(WorkoutCard)