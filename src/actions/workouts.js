import api from "../api";

export const addWorkout = (workout) => (dispatch) => 
    api.workout.addWorkout(workout)

export const uploadFile = (formData) => (dispatch) => 
    api.workout.uploadFile(formData)

export const deleteFile = (file) => (dispatch) => 
    api.workout.deleteFile(file)

export const getWorkouts = (user) => (dispatch) =>
    api.workout.getWorkouts(user)

