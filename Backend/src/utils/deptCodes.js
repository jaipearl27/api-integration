import dotenv from "dotenv";
dotenv.config();

const apiKeysString = process.env.API_KEYS;
const apiKeys = JSON.parse(apiKeysString);

export const findDeptCodes = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let resp;
  
        for (let i = 0; i < apiKeys.length; i++) {
          const url = `https://opend.data.go.th/govspending/egpdepartment?api-key=${apiKeys[i]}&dept_name=${data?.dept_name}`;
  
          const options = {
            method: "GET",
          };
  
          const response = await fetch(url, options);
          const res = await response.json(); // Convert response body to JSON
  
          if (res.message !== "API rate limit exceeded") {
            console.log(res)
            resp = res.result;
            break;
          }
        }
  
        // Resolve the promise with the response or a default value
        resolve(resp || undefined);
      } catch (error) {
        // Reject the promise with the error
        reject({
          status: false,
          message: "An error occurred",
          error: error.message,
        });
      }
    });
  }
  