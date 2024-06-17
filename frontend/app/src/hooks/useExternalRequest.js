import https from "https";
import logger from "../../../../backend/api/V1/utils/logger.util.js";

const useExternalApi = (url, callback, method, data) => {
  if (method.toUpperCase() == "GET") {
    https
      .get(url, data, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => callback(data));
      })
      .on("error", (error) => {
        console.log("Error: ", error.message);
        logger.error(error.message);
      });
  }

  // if (method.toUpperCase() == "POST") {
  //   https
  //     .post(url, data, (response) => {
  //       let data = "";

  //       response.on("data", (chunk) => {
  //         data += chunk;
  //       });

  //       response.on("end", () => callback(data));
  //     })
  //     .on("error", (error) => {
  //       console.log("Error: ", error.message);
  //       logger.error(error.message);
  //     });
  // }
};

export default useExternalApi;
