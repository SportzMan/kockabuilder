import api from "../api";

export const addProgram = (program) => (dispatch) => 
    api.program.addProgram(program)

export const updateProgram = (program) => (dispatch) => 
    api.program.updateProgram(program)

export const deleteProgram = (program) => (dispatch) => 
    api.program.deleteProgram(program)

export const uploadFile = (formData) => (dispatch) => 
    api.program.uploadFile(formData)

export const deleteFile = (file) => (dispatch) => 
    api.program.deleteFile(file)

export const getPrograms = (user) => (dispatch) =>
    api.program.getPrograms(user)

