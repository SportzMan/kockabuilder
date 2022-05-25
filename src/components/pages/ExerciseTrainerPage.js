import React from 'react';
import {Alert, Container, Row, Col, Spinner} from "react-bootstrap"
import {getExercises} from "../../actions/exercises";
import {connect} from "react-redux";
import "../CSS/pages/ExerciseTrainerPage.css";


class ExerciseTrainerPage extends React.Component{

    state={
        excercises: [],
        loading: true,
        success: false,
        errors: {}
    }

    componentDidMount(){
        this.props.getExercises(this.props.user)
            .then(res => this.setState({...this.state.exercises, exercises: res, loading: false, success: true}))
            .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false}))
    }


    render(){
        const {exercises, loading, success, errors} = this.state;

        return(
        <Container fluid id="course">
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1>Gyakorlatok</h1>
                <hr />
            </div>
            {!loading && errors.global && <Alert> <p>{errors.global}</p> </Alert>}

            {loading && !success && <Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/> }
            
            {!loading && success &&
                <Row xs={1} md={2} lg={2} xl={4} style={{ marginTop: "2%"}}>
                    {
                        exercises.map((exercise, index) => {
                            return (
                            <Col key={`col-${index}`}>
                                <div className="exerciseCard"  index={index} 
                                onClick={() => this.props.history.push("/edit_exercise/"+exercise._id)}>
                                    <img  className="card-img" src={exercise.thumbnailPath} alt="thumbnail" style={{ width: "320px", height: "240px"}}/>
                                    <div  className="exercise-info">
                                        <h4 > {`${exercise.name}`} </h4>
                                    </div>
                                </div>
                            </Col>
                            )
                        })
                    }
                </Row>
            }

            {!loading && success && (exercises.length === 0) && <Alert variant='warning'> Még nem töltött fel gyakorlatot a rendszerbe!</Alert>}
        </Container>
        )
    }

}

function mapStateToProps(state){
    return{
        user: state.user
    };
  }

export default connect(mapStateToProps, {getExercises})(ExerciseTrainerPage);
