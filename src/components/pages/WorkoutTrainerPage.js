import React from 'react';
import {Alert, Container, Row, Col, Spinner} from "react-bootstrap"
import {getWorkouts} from "../../actions/workouts";
import {connect} from "react-redux";



class WorkoutTrainerPage extends React.Component{

    state={
        workouts: [],
        loading: true,
        success: false,
        errors: {}
    }

    componentDidMount(){
        this.props.getWorkouts(this.props.user)
            .then(res => this.setState({...this.state.workouts, workouts: res, loading: false, success: true}))
            .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false}))
    }


    render(){
        const {workouts, loading, success, errors} = this.state;

        return(
        <Container fluid id="course">
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1>Edzések</h1>
                <hr />
            </div>
            {!loading && errors.global && <Alert> <p>{errors.global}</p> </Alert>}

            {loading && !success && <Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/> }
            
            {!loading && success &&
                <Row xs={1} md={2} lg={2} xl={4} style={{ marginTop: "2%"}}>
                    {
                        workouts.map((workout, index) => {
                            return (
                            <Col key={`col-${index}`}>
                                <div style={{ width: "320px", position: "relative",  marginBottom: "1rem", border:"1px" }} className="workoutCard"  index={index} 
                                onClick={() => this.props.history.push("/edit_workout/"+workout._id)}>
                                    <img  className="card-img" src={workout.thumbnailPath} alt="thumbnail" style={{ width: "320px", height: "240px"}}/>
                                    <div  className="workout-info">
                                        <h4 > {`${workout.name}`} </h4>
                                    </div>
                                </div>
                            </Col>
                            )
                        })
                    }
                </Row>
            }

            {!loading && success && (workouts.length === 0) && <Alert variant='warning'> Még nem töltött fel edzést a rendszerbe!</Alert>}
        </Container>
        )
    }

}

function mapStateToProps(state){
    return{
        user: state.user
    };
  }

export default connect(mapStateToProps, {getWorkouts})(WorkoutTrainerPage);
