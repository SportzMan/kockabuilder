import React from "react";
import {connect} from "react-redux";
import {addProgram} from "../../actions/programs";
import PropTypes from "prop-types";
import NewProgramForm from "../forms/NewProgramForm";
import {Container} from "react-bootstrap";

class UpdateProgramPage extends React.Component {

  submit = (program) => this.props.addProgram(program).then(res => 
    this.props.history.push({
        pathname: "/update_program",
        state: {name: res.name, owner: res.owner, description: res.description, thumbnailPath: res.thumbnailPath, workouts: res.workouts, isfree: res.isFree}
    })
  )


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

UpdateProgramPage.propTypes = {
  addProgram: PropTypes.func.isRequired
};

export default connect(null, {addProgram})(UpdateProgramPage);
