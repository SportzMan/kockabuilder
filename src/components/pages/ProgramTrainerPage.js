import React from 'react';
import {Alert, Container, Row, Col, Spinner} from "react-bootstrap"
import {getPrograms} from "../../actions/programs";
import {connect} from "react-redux";
import "../CSS/pages/ProgramTrainerPage.css";


class ProgramTrainerPage extends React.Component{

    state={
        programs: [],
        loading: true,
        success: false,
        errors: {}
    }

    componentDidMount(){
        this.props.getPrograms(this.props.user)
            .then(res => this.setState({...this.state.programs, programs: res, loading: false, success: true}))
            .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false}))
    }


    render(){
        const {programs, loading, success, errors} = this.state;

        return(
        <Container fluid id="course">
            <h1>Programok</h1>
            <hr />
            {!loading && errors.global && <Alert> <p>{errors.global}</p> </Alert>}

            {loading && !success && <Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/> }
            
            {!loading && success &&
                <Row xs={1} md={2} lg={2} xl={4} >
                    {
                        programs.map((program, index) => {
                            return (
                            <Col key={`col-${index}`}>
                                <div className="programCard"  index={index} 
                                onClick={() => this.props.history.push("/edit_program/"+program._id)}>
                                    <img  className="card-img" src={program.thumbnailPath} alt="thumbnail"/>
                                    <div  className="program-info">
                                        <h4 > {`${program.name}`} </h4>
                                    </div>
                                </div>
                            </Col>
                            )
                        })
                    }
                </Row>
            }
        {!loading && success && (programs.length === 0) && <Alert variant='warning'> Még nem töltött fel programot a rendszerbe!</Alert>}

        </Container>
        )
    }

}

function mapStateToProps(state){
    return{
        user: state.user
    };
  }

export default connect(mapStateToProps, {getPrograms})(ProgramTrainerPage);
