import api from "../api";

export const addExercise = (exercise) => (dispatch) => 
    api.exercise.addExercise(exercise)

export const createThumbnail = (thumbnail) => (dispatch) => 
    api.exercise.createThumbnail(thumbnail)

export const uploadFile = (formData) => (dispatch) => 
    api.exercise.uploadFile(formData)

export const getExercises = (user) => (dispatch) =>
    api.exercise.getExercises(user)

export const deleteFiles = (data) => (dispatch) =>
    api.exercise.deleteFiles(data)