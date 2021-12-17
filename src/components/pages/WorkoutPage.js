import React from 'react';
import {Container, Spinner, ListGroup} from "react-bootstrap"
import {getWorkout} from "../../actions/workouts";
import {connect} from "react-redux";
import ExerciseCard from "../cards/ExerciseCard";



class WorkoutPage extends React.Component{

    state={
        workout: {
            name: "",
            thumbnailPath: "",
            description: "",
            exercises: []
        },
        loading: true
    }

    componentDidMount(){
        this.props.getWorkout(this.props.history.location.state.workout).then(res => this.setState({...this.state.workout, workout: res, loading: false}))
    }


    render(){
        const {workout, loading} = this.state;
        return(
        <Container fluid >

            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1 >{workout.name}</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>

            {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            : 
            ( 
            <div>          
                <div style={{margin: "2rem 5% 0 5%", padding: " 5px 15px", backgroundColor: "rgba(190, 183, 183, 0.829)", borderRadius: "15px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)"}}>
                <h5> Leírás </h5>
                <p style={{ wordWrap: "break-word"}}>{workout.description}</p>
                </div>
                     <ListGroup style={{margin: "4rem 0 0 15%", borderRadius: "10px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)", width: "70%"}}>
                     <ListGroup.Item >Körök száma</ListGroup.Item>
                    {
                        workout.exercises.map((exercise, index) =>{
                            return(
                            <ListGroup.Item index={index} style={{height: "auto"}}>
                                <ExerciseCard exercise={exercise}/>
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

export default connect(null, {getWorkout})(WorkoutPage);
