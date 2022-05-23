import React from "react";
import {getWorkout} from "../../actions/workouts";
import {connect} from "react-redux";
import {Spinner} from "react-bootstrap";

class WorkoutCard extends React.Component{

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
            <div style={{ width: "240px", position: "relative",  marginBottom: "1rem" }} className="workoutCard" 
            onClick={() => this.props.open("/workout/"+this.state.workout._id)}>
                {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            : (
                <div>
                <img  className="card-img" src={`http://localhost:8080/${workout.thumbnailPath}`} alt="thumbnail" style={{width: "240px", height:"160px"}}/>
                <div  className="workout-info">
                    <h4> {`${this.props.index+1}. nap`} </h4>
                    <h5> {`${workout.name}`} </h5>

                </div>
                </div> )}
            </div>
        )
    }
}

export default connect(null, {getWorkout})(WorkoutCard)