import api from "../api";

export const addExercise = (exercise) => (dispatch) => 
    api.exercise.addExercise(exercise)

export const updateExercise = (exercise) => (dispatch) => 
    api.exercise.updateExercise(exercise)

export const deleteExercise = (exercise) => (dispatch) => 
    api.exercise.deleteExercise(exercise)

export const createThumbnail = (thumbnail) => (dispatch) => 
    api.exercise.createThumbnail(thumbnail)

export const uploadFile = (formData) => (dispatch) => 
    api.exercise.uploadFile(formData)

export const getExercises = (user) => (dispatch) =>
    api.exercise.getExercises(user)

export const getExercise = (exercise) =>
    api.exercise.getExercise(exercise)

export const deleteFiles = (data) => (dispatch) =>
    api.exercise.deleteFiles(data)