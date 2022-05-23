import api from "../api";
import {userLoggedIn} from './auth';
import {USER_UPDATED, USERS_FETCHED} from "../types";

export const ProfileUpdated = (user) => ({
    type: USER_UPDATED,
    user
});

export const register = (data) => (dispatch) => api.user.register(data).then(user => {
    localStorage.kockaJWT = user.token;
    dispatch(userLoggedIn(user))
    });

export const updateMyProfile = (data) => (dispatch) => api.user.updateMyProfile(data).then(user => {
    localStorage.kockaJWT = user.token;
    dispatch(ProfileUpdated(user))
});

export const getUserInfo = ()  => api.user.getUserInfo();

export const updateUserProfile = (data) => (dispatch) => api.user.updateUserProfile(data);

export const updateMembership = (data) => (dispatch) => api.user.updateMembership(data);

export const getAllUsers = () => (dispatch) => api.user.getAllUsers();