import axiosClient from "./axiosClient";

export const GetUsers = () => axiosClient.get('users/');

export const GetUserById = (id) => axiosClient.get(`users/${id}`);

export const PostUser = (user) => axiosClient.post('users/', user);
