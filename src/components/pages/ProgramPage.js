import React from 'react';
import {Container, Row, Col, Spinner} from "react-bootstrap"
import {getProgram} from "../../actions/programs";
import {connect} from "react-redux";
import WorkoutCard from "../cards/WorkoutCard";
import PropTypes from "prop-types";



class ProgramPage extends React.Component{

    state={
        program: {
            name: "",
            thumbnailPath: "",
            description: "",
            workouts: []
        },
        loading: true,
        errors: {}
    }

    componentDidMount(){
        this.props.getProgram(this.props.match.params.program).then(res => this.setState({...this.state.program, program: res, loading: false}))
    }



    render(){
        const {program, loading} = this.state;
        return(
        <Container fluid >
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1 >{program.name}</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>
            {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            : 
            ( 
            <div>          
                <div style={{margin: "2rem 5% 0 5%", padding: " 5px 15px", backgroundColor: "rgba(255, 255, 255, 0.76)", borderRadius: "15px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)"}}>
                <h5> Leírás </h5>
                <p style={{ wordWrap: "break-word"}}>{program.description}</p>
                </div>
                <div style={{margin: "2rem 5% 0 5%", padding: " 5px 15px", backgroundColor: "rgba(255, 255, 255, 0.76)", borderRadius: "15px", boxShadow: "0 0 7px 7px rgba(190, 183, 183, 0.829)"}}>
                    <h5> Edzések </h5>
                    <Row xs={1} md={2} lg={2} xl={4} style={{ marginTop: "1.5rem"}}>
                    {
                        program.workouts.map((workout, index) =>{
                            return(
                            <Col key={`col-${index}`}>
                                <WorkoutCard workout={workout.workout} open={this.props.history.push} index={index}/>
                            </Col>
                            )

                        })
                    }
                    </Row>
                </div>
            </div> 
            )
        }
            
        </Container>
        )
    }

}

ProgramPage.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            program: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}

export default connect(null, {getProgram})(ProgramPage);
