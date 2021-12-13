import api from "../api";

export const addProgram = (workout) => (dispatch) => 
    api.program.addProgram(workout)

export const uploadFile = (formData) => (dispatch) => 
    api.program.uploadFile(formData)

export const deleteFile = (file) => (dispatch) => 
    api.program.deleteFile(file)

export const getPrograms = (user) => (dispatch) =>
    api.program.getPrograms(user)

