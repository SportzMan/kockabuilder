import api from "../api";
import {userLoggedIn} from './auth';
import {USER_UPDATED, USERS_FETCHED} from "../types";
import { userSchema } from "../schemas";
import {normalize} from "normalizr";

export const ProfileUpdated = (user) => ({
    type: USER_UPDATED,
    user
});

export const userFetched = (user) => ({
    type: USERS_FETCHED,
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

export const getUserInfo = () => (dispatch) => api.user.getUserInfo()
    .then(user => {
        dispatch(userFetched(normalize(user, [userSchema])))
    });

export const updateUserProfile = (data) => (dispatch) => api.user.updateUserProfile(data).then(() =>
    dispatch(ProfileUpdated())
);

export const getAllUsers = () => (dispatch) => api.user.getAllUsers()