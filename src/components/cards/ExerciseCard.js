import React from "react";
import {getExercise} from "../../actions/exercises";
import {connect} from "react-redux";
import VideoModal from "../modals/VideoModal";

class ExerciseCard extends React.Component{

    state = {
        exercise: {
            exercise: {}
        },
        modal: false
    }

    componentDidMount(){
        this.props.getExercise(this.props.exercise).then(res => {
            this.setState({...this.state.exercise, exercise: res})
        })
    }

    showModal = () => {
        this.setState({ modal: true})
    }

    hideModal = () => {
        this.setState({ modal: false})
    }

    render(){
        const {exercise, modal} = this.state;
        return(
            
            <div  className="exerciseCard" >
                <VideoModal modal={modal} hideModal={this.hideModal} exercise={exercise.exercise}/>
                <img  className="card-img" src={exercise.exercise.thumbnailPath} alt="thumbnail" style={{width: "96px", height:"72px", margin: "0 0 2rem 0"}} onClick={() => this.showModal()}/>
                <div className="exercise-info">
                    <h5> {`${exercise.exercise.name}`} </h5> 
                    <p>{`${exercise.reps} ismétlés`}</p>
                    <p >{`Pihenés: ${exercise.reps} másodperc`}</p>
                </div>
                
            </div>
        )
    }
}

export default connect(null, {getExercise})(ExerciseCard)