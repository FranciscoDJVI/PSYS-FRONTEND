import axiosClient from "./axiosClient";

// Relative Url for pagination of API.
export const GetProducts = (url = "products/") => {
  const relativeUrl = url.startsWith('http') ? url.replace(axiosClient.defaults.baseURL, '') : url;
  return axiosClient.get(relativeUrl);
};

// Endpoint for list products without pagination.
export const GetproductsSearch = () => axiosClient.get('prods/');

// Others
export const GetProduct = (id) => axiosClient.get(`products/${id}`);

export const PostProducts = (product) => axiosClient.post('products/', product);

export const DeleteProduct = (id) => axiosClient.delete(`products/${id}/`);

export const UpdateProduct = (id, product) => axiosClient.put(`products/${id}/`, product);

