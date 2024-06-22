import axios from "axios";
import logger from "./logger.util.js";

const useExternalApi = (url, method, data, params) => {
  try {
    if (method.toUpperCase() === "GET") {
      return axios
        .get(url)
        .then((response) => response)
        .catch((err) => err);
    } else if (method.toUpperCase() === "POST") {
      return axios
        .post(url, data)
        .then((response) => response)
        .catch((err) => err);
    } else if (method.toUpperCase() === "PUT") {
      return axios
        .put(url, data, { params })
        .then((response) => response)
        .catch((err) => err);
    } else if (method.toUpperCase() === "PATCH") {
      return axios
        .patch(url, data, { params })
        .then((response) => response)
        .catch((err) => err);
    } else {
      return axios
        .delete(url, { params })
        .then((response) => response)
        .catch((err) => err);
    }
  } catch (error) {
    return logger.error(error);
  }
};

export default useExternalApi;
