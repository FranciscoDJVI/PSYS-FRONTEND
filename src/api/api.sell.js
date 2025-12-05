import axiosClient from "./axiosClient"

export const GetSell = () => axiosClient.get("/sells/");

export const PostSell = (sell) => axiosClient.post("/Sell/", sell);

