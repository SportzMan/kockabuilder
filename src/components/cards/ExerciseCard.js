import React from "react";
import {getExercise} from "../../actions/exercises";
import {connect} from "react-redux";
import VideoModal from "../modals/VideoModal";
import {Spinner} from "react-bootstrap";
import "../CSS/pages/ExercisePage.css";

class ExerciseCard extends React.Component{

    state = {
        exercise: {
            reps: "",
            rest: "",
            type: "",
            exercise: {}
        },
        modal: false,
        loading: true,
        errors: {}
    }

    componentDidMount(){
        this.props.getExercise(this.props.exercise.exercise).then(res => 
            this.setState({exercise: {exercise: res, reps: this.props.exercise.reps, rest: this.props.exercise.rest, type: this.props.exercise.type}, loading: false})
        )
    }

    showModal = () => {
        this.setState({ modal: true})
    }

    hideModal = () => {
        this.setState({ modal: false})
    }

    render(){
        const {exercise, modal, loading} = this.state;
        return(
            
            <div  className="exercise-card" >
                {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            :  (
                <div>
                <VideoModal modal={modal} hideModal={this.hideModal} exercise={exercise.exercise}/>
                <img  className="card-img" src={`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/${exercise.exercise.thumbnailPath}`} alt="thumbnail" style={{width: "96px", height:"72px", margin: "0 0 2rem 0"}} onClick={() => this.showModal()}/>
                <div className="card-exercise-info">
                    <h5> {`${exercise.exercise.name}`} </h5> 
                    {exercise.type ? (<p>{`${exercise.reps} másodperc`}</p>) : (<p>{`${exercise.reps} ismétlés`}</p>)}
                    <p >{`Pihenés: ${exercise.reps} másodperc`}</p>
                </div>
                </div> )}
                
            </div>
        )
    }
}

export default connect(null, {getExercise})(ExerciseCard)