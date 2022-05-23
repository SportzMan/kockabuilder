import React from "react";
import {connect} from "react-redux";
import {getProgram, updateProgram, deleteProgram, deleteFile} from "../../actions/programs";
import PropTypes from "prop-types";
import UpdateProgramForm from "../forms/UpdateProgramForm";
import {Container, Spinner} from "react-bootstrap";

class NewProgramPage extends React.Component {

  state = {
    program: {},
    loading: true,
    success: false,
    errors: {},
  }

  componentDidMount() {
    this.props.getProgram(this.props.match.params.program)
      .then(res => this.setState({ ...this.state.program, program: res, loading: false, success: true }))
      .catch((err) => {this.setState({...this.state.errors, errors: err.response.data.errors, loading: false, success: false})})
  }

  submit = (program) => 
    this.props.updateProgram(program)

  deleteItem = (program) => 
  this.props.deleteProgram(program).then(() =>{
    this.props.deleteFile({thumbnailPath: program.thumbnailPath})
  })

  render(){
    const {program, loading, success, errors} = this.state;

    return (
      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Edzésprogram módosítása</h1>
        <hr />
      </div>
      {loading && !success && <Spinner animation="border" size="xxl" role="status"  aria-hidden="true" style={{margin: "5% 50% 0"}}/> }
      {!loading && success && <UpdateProgramForm submit={this.submit} program={program} deleteItem={this.deleteItem} /> }
    </Container>
    )
  };
}

NewProgramPage.propTypes = {
  updateProgram: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
        exercise: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
};

export default connect(null, {getProgram, updateProgram, deleteProgram, deleteFile})(NewProgramPage);
