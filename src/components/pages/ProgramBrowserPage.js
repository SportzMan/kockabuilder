import React from 'react';
import {Alert, Container, Row, Col, Spinner} from "react-bootstrap"
import {getPrograms} from "../../actions/programs";
import {connect} from "react-redux";
import "../CSS/pages/ProgramBrowserPage.css";


class ProgramBrowserPage extends React.Component{

    state={
        programs: [],
        loading: true,
        success: false,
        errors: {}
    }

    componentDidMount(){
        this.props.getPrograms()
            .then(res => this.setState({...this.state.programs, programs: res, loading: false, success: true}))
            .catch(err => this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false}))
    }


    render(){
        const {programs, loading, success, errors} = this.state;

        return(
        <Container fluid id="course">
            <h1>Programtár</h1>
            <hr />
            {!loading && errors.global && <Alert> <p>{errors.global}</p> </Alert>}
            {!loading && success && (programs.length === 0) && <Alert variant='warning'> Még nincsenek programok a rendszerbe feltöltve!</Alert>}
            {loading && !success && <Spinner id="loading-spinner" animation="border" size="xxl" role="status"  aria-hidden="true"/> }
            
            {!loading && success &&
                <div className="programbrowser-flexbox-container">
                    {
                        programs.map((program, index) => {
                            return (
                                <div className="programCard"  index={index} onClick={() => this.props.history.push("/program/"+program._id)}>
                                    <img  className="card-img" src={program.thumbnailPath} alt="thumbnail"/>
                                    <div  className="program-info">
                                        <h4 > {`${program.name}`} </h4>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </Container>
        )
    }

}

export default connect(null, {getPrograms})(ProgramBrowserPage);
