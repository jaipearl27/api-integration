import _ from "lodash";
import dotenv from "dotenv";
dotenv.config();

const apiKeysString = process.env.API_KEYS;
const apiKeys = JSON.parse(apiKeysString);

const processData = (data, params) => {

  let cleanedArr = [];

  const result = data.map((project) => {
    project[params.y1Axis.value] = removeCommaFromNum(
      project[params.y1Axis.value]
    );
    project[params.y2Axis.value] = removeCommaFromNum(
      project[params.y2Axis.value]
    );
    return project;
  });
  let tempArr = [...result];

  let groupedResult = _.groupBy(tempArr, "dept_name");
  _.keys(groupedResult).forEach((e) => {
    let tempObj = {};
    tempObj = groupedResult[`${e}`];
    cleanedArr.push(tempObj);
  });

  let calcArr = cleanedArr.map((dept) => {
    const projects = dept;
    const y1Total = projects.reduce(
      (sum, project) => sum + parseFloat(project[params.y1Axis.value]),
      0
    );
    const y2Total = projects.reduce(
      (sum, project) => sum + parseFloat(project[params.y2Axis.value]),
      0
    );

    const projectCount = projects.length;

    const y1 = y1Total / projectCount;
    const y2 = y2Total / projectCount;

    return {
      xAxis: Number(projects[0][params.xAxis.value]) - 543,
      y1,
      y2,
    };
  });

  return calcArr || [];
};

const removeCommaFromNum = (item) => {
  return item.replace(/\,/g, "");
};

const generateChartData = (data, params) => {
  let chartStructure = {
    labels: [],
    datasets: [
      {
        label: `${params.y1Axis.label}`,
        backgroundColor: "red",
        data: [], // y axis
      },
      {
        label: `${params.y2Axis.label}`,
        backgroundColor: "orange",
        data: [], // y axis
      },
    ],
  };

  data.forEach((item) => {
    chartStructure.labels.push(item.xAxis);
    // first column
    chartStructure.datasets[0].data.push(item.y1);
    // second column
    chartStructure.datasets[1].data.push(item.y2);
  });
  return chartStructure;
};

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

      const response = await fetch(url, options);
      const res = await response.json(); // Convert response body to JSON

      if (res.message !== "API rate limit exceeded" && i < apiKeysLength) {
        allResult = [...allResult, ...res.result];
        break;
      } else {
        allResult = { status: false, message: "API rate limit exceeded" };
        return;
      }
    }
    year -= 1;
  }

  let finalData = [];

  if (allResult.length > 0) {
    const calcArr = processData(allResult, data);
    finalData = generateChartData(calcArr, data);
  }

  return finalData; // Return the JSON data
};

export const getVisualizationData = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
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
