import React from "react";
import {getWorkout} from "../../actions/workouts";
import {connect} from "react-redux";

class WorkoutCard extends React.Component{

    state = {
        workout: {}
    }

    componentDidMount(){
        this.props.getWorkout(this.props.workout).then(res => {
            this.setState({...this.state.workout, workout: res})
        })
    }

    render(){
        const {workout} = this.state;
        return(
            <div style={{ width: "320px", position: "relative",  marginBottom: "1rem" }} className="workoutCard" 
            onClick={() => this.props.open({pathname: "/workout", state: {workout: workout}})}>
                <img  className="card-img" src={workout.thumbnailPath} alt="thumbnail" style={{width: "320px", height:"240px"}}/>
                <div  className="workout-info">
                    <h3> {`${workout.name}`} </h3>

                </div>
            </div>
        )
    }
}

export default connect(null, {getWorkout})(WorkoutCard)