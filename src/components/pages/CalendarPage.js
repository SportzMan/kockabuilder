import React from "react";
import Calendar from 'react-awesome-calendar'; // https://www.npmjs.com/package/react-awesome-calendar
import { Container } from "react-bootstrap";
import {getEvents} from "../../actions/events";
import {connect} from "react-redux";


class CalendarPage extends React.Component {
  state={
    events: []
  }

componentDidMount(){
  this.props.getEvents(this.props.user).then(events => { 
    this.setState({...this.events, events: events})})
}

render(){
  
  const {events} = this.state;

  return(
    <Container fluid>
      <Calendar events={events} />
    </Container>
    )

  }
}

function mapStateToProps(state){
  return{
    user: state.user
  }
}
export default connect(mapStateToProps, {getEvents})(CalendarPage)