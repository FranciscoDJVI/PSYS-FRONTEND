import axiosClient from "./axiosClient"

// Relative Url for pagination of API.
export const GetSell = (url = "sells/") => {
  const relativeUrl = url.startsWith('http') ? url.replace(axiosClient.defaults.baseURL, '') : url;
  return axiosClient.get(relativeUrl);
};

export const PostSell = (sell) => axiosClient.post("sells/", sell);

