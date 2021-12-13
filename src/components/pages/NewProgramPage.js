import React from "react";
import {connect} from "react-redux";
import {addProgram} from "../../actions/programs";
import PropTypes from "prop-types";
import NewProgramForm from "../forms/NewProgramForm";
import {Container} from "react-bootstrap";

class NewProgramPage extends React.Component {

  submit = (program) => this.props.addProgram(program)//.then(() => this.props.history.push("/edit_program/pid"))


  render(){

    return (
      <Container fluid style={{ paddingTop: "0.4rem" }}>
      <div id="title-container" style={{ marginBottom: "1rem" }}>
        <h1>Új edzésprogram létrehozása</h1>
        <hr />
      </div>
      <NewProgramForm submit={this.submit}/>
    </Container>
    )
  };
}

NewProgramPage.propTypes = {
  addProgram: PropTypes.func.isRequired
};

export default connect(null, {addProgram})(NewProgramPage);
