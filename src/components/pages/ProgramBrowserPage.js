import React from 'react';
import {Container, Row, Col, Spinner} from "react-bootstrap"
import {getPrograms} from "../../actions/programs";
import {connect} from "react-redux";



class ProgramBrowserPage extends React.Component{

    state={
        programs: [],
        loading: true
    }

    componentDidMount(){
        this.props.getPrograms().then(res => this.setState({...this.state.programs, programs: res, loading: false}))
    }


    render(){
        const {programs, loading} = this.state;

        return(
        <Container fluid id="course">
            <div id="title-container" style={{ marginBottom: "1rem" }}>
                <h1>Programok</h1>
                <hr style={{ boxShadow: "0 0 8px 1px black"}}/>
            </div>
            {loading ? (<Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/>) 
            : 
            ( 
                <Row xs={1} md={2} lg={2} xl={4} style={{ marginTop: "2%"}}>
                    {
                        programs.map((program, index) => {
                            return (
                            <Col key={`col-${index}`}>
                                <div style={{ width: "320px", position: "relative",  marginBottom: "1rem", border:"1px" }} className="programCard"  index={index} 
                                onClick={() => this.props.history.push("/program/"+program._id)}>
                                    <img  className="card-img" src={program.thumbnailPath} alt="thumbnail" style={{ width: "320px", height: "240px"}}/>
                                    <div  className="program-info">
                                        <h4 > {`${program.name}`} </h4>
                                    </div>
                                </div>
                            </Col>
                            )
                        })
                    }
                </Row>
            )}
        </Container>
        )
    }

}

export default connect(null, {getPrograms})(ProgramBrowserPage);
