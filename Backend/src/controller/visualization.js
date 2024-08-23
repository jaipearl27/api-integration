import dotenv from "dotenv";
dotenv.config();

const apiKeysString = process.env.API_KEYS;
const apiKeys = JSON.parse(apiKeysString);

const findProjectsData = async (data) => {
  let projectsLimit = 900;
  let allResult = [];
  const apiKeysLength = apiKeys?.length;
  let year = Number(data?.yearsTo?.value) || data?.year;
  let floorYear = data?.year;

  while (year >= floorYear) {
    for (let i = 0; i < apiKeysLength; i++) {
      const url = `${process.env.API1}?api-key=${apiKeys[i]}&year=${
        year ? year + 543 : new Date().getFullYear() + 543
      }&keyword=${data?.keyword || " "}&limit=${
        data?.limit || projectsLimit
      }&offset=${data?.offset || 0}`;

      const options = {
        method: "GET",
      };

      console.log(url);

      const response = await fetch(url, options);
      const res = await response.json(); // Convert response body to JSON

      if (res.message !== "API rate limit exceeded" && i < apiKeysLength) {
        allResult.push({ result: res.result });
        break;
      } else {
        allResult = { status: false, message: "API rate limit exceeded" };
        return;
      }
    }
    year -= 1;
  }
  return allResult; // Return the JSON data
};

export const getVisualizationData = async (req, res) => {
  try {
    let data = req.body;
    data.year = Number(data?.yearsFrom?.value);

    const projectRes = await findProjectsData(data);
    if (projectRes?.status === false) {
      res.status(404).send(projectRes);
      return;
    }
    res.status(200).send(projectRes);
  } catch (error) {
    console.error(error);
  }
};
