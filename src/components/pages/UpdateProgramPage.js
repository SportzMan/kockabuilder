import React from "react";
import {connect} from "react-redux";
import {updateProgram, deleteProgram, deleteFile} from "../../actions/programs";
import PropTypes from "prop-types";
import UpdateProgramForm from "../forms/UpdateProgramForm";
import {Container} from "react-bootstrap";

class NewProgramPage extends React.Component {

  submit = (program) => this.props.updateProgram(program)

  deleteItem = (program) => 
  this.props.deleteProgram(program).then(() =>{
    this.props.deleteFile({thumbnailPath: program.thumbnailPath})
  })

  render(){

    return (
      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Edzésprogram módosítása</h1>
        <hr />
      </div>
      <UpdateProgramForm submit={this.submit} program={this.props.history.location.state} deleteItem={this.deleteItem} />
    </Container>
    )
  };
}

NewProgramPage.propTypes = {
  updateProgram: PropTypes.func.isRequired
};

export default connect(null, {updateProgram, deleteProgram, deleteFile})(NewProgramPage);
