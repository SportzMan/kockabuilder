import api from "../api";

export const addEvent = (event) => (dispatch) => 
    api.event.addEvent(event)


export const getEvents = (user) => (dispatch) =>
    api.event.getEvents(user)
