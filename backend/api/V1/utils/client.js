import axios from "axios";
import logger from "./logger.util.js";

const useExternalApi = async (url, method, data, params) => {
  if (method === "GET") {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return logger.error(error.message);
    }
  } else if (method === "POST") {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      return logger.error(error.message);
    }
  } else if (method === "PUT") {
    try {
      const response = await axios.put(url, data, { params });
      return response.data;
    } catch (error) {
      return logger.error(error.message);
    }
  } else if (method === "PATCH") {
    try {
      const response = await axios.patch(url, data, { params });
      return response.data;
    } catch (error) {
      return logger.error(error.message);
    }
  } else {
    try {
      const response = await axios.delete(url, { params });
      return response.data;
    } catch (error) {
      return logger.error(error.message);
    }
  }
};

export default useExternalApi;
