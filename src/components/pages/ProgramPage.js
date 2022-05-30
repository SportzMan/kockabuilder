import React from 'react';
import {Alert, Container, Spinner} from "react-bootstrap"
import {getProgram} from "../../actions/programs";
import {connect} from "react-redux";
import WorkoutCard from "../cards/WorkoutCard";
import PropTypes from "prop-types";
import "../CSS/pages/ProgramPage.css";


class ProgramPage extends React.Component{

    state={
        program: {
            name: "",
            thumbnailPath: "",
            description: "",
            workouts: []
        },
        loading: true,
        success: false,
        errors: {}
    }

    componentDidMount(){
        this.props.getProgram(this.props.match.params.program)
            .then(res => this.setState({...this.state.program, program: res, loading: false, success: true}))
            .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false}))
    }



    render(){
        const {program, loading, success, errors} = this.state;
        return(
        <Container fluid >
            <h1 >{program.name}</h1>
            <hr/>
            {loading && !success && <Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/> }
            {!loading && !success && <Alert variant="danger">{errors.global}</Alert>}
            {!loading && success &&
                <>          
                    <div className="program-header">
                        <h5> Leírás </h5>
                        <p>{program.description}</p>
                    </div>
                    <div className="workouts-container" >
                        <h5> Edzések </h5>
                        <div className="workouts-flexbox-container">
                        {
                            program.workouts.map((workout, index) =>{
                                return(
                                    <WorkoutCard workout={workout} open={this.props.history.push} index={index}/>
                                )

                            })
                        }
                        </div>
                    </div>
                </> 
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
