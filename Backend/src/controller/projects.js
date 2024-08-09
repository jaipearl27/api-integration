import dotenv from "dotenv";
dotenv.config();

const apiKeysString = process.env.API_KEYS;
const apiKeys = JSON.parse(apiKeysString);

const findProjectsData = async (data) => {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let projectsLimit = 900;
  let allResult = { result: [] };
  const apiKeysLength = apiKeys?.length;

  let year = Number(data?.yearsTo?.value) || data?.year;
  let floorYear = data?.year;

  while (year >= floorYear) {
    for (let i = 0; i < apiKeysLength; i++) {
      const url = `${process.env.API1}?api-key=${apiKeys[i]}&year=${
        year ? year + 543 : new Date().getFullYear() + 543
      }&keyword=${data?.keyword || " "}&limit=${
        data?.limit || projectsLimit
      }&offset=${data?.offset || 0}&winner_tin=${
        data?.winnerTin || ""
      }&dept_code=${data?.dept_code || ""}&budget_start=${
        data?.referencePriceFrom || 0
      }&budget_end=${data?.referencePriceTo || ""}`;

      const options = {
        method: "GET",
      };

      console.log(url);

      const response = await fetch(url, options);
      const res = await response.json(); // Convert response body to JSON

      if (res.message !== "API rate limit exceeded" && i < apiKeysLength) {
        allResult.result = [...allResult.result, ...res.result]
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

const findCompanyData = async (data) => {
  const result = `https://dataapi.moc.go.th/juristic?juristic_id=${data.winnerTin}`;
  const options = {
    method: "GET",
  };
  const response = await fetch(url, options);
  const res = await response.json(); // Convert response body to JSON
  return res; // Return the JSON data
};

export const getData = async (req, res) => {
  try {
    let data = req.body;
    data.year = Number(data?.yearsFrom?.value);
    data.referencePriceFrom = Number(data?.referencePriceFrom);
    data.referencePriceTo =
      Number(data?.referencePriceFrom) > Number(data?.referencePriceTo)
        ? ""
        : Number(data?.referencePriceTo);

    if (data?.winningCompany && data?.winningCompany?.length > 0) {
      const winnerTins = await findWinnerTin(data?.winningCompany, 20);
      if (!winnerTins) {
        res.status(200).json({
          status: false,
          message: "No data found for this winner",
          data: [],
        });
      } else {
        let result;
        const winnerTinLength = winnerTins.length;
        for (let i = 0; i < winnerTinLength; i++) {
          data.winnerTin = winnerTins[i]?.winner_tin;
          const projectRes = await findProjectsData(data);
          if (projectRes?.status === false) {
            res.status(404).send(projectRes);
          }
          // console.log(projectRes?.result);
          if (projectRes?.result?.length > 0) {
            result = projectRes;
          }
        }
        // console.log(result, "result");
        res.status(200).send(result);
      }
    } else {
      const projectRes = await findProjectsData(data);
      if (projectRes?.status === false) {
        res.status(404).send(projectRes);
        return;
      }
      res.status(200).send(projectRes);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyData = async (req, res) => {
  try {
    const companyData = await findCompanyData(req.body.winnerTin);
    res.status(200).json({
      status: true,
      companyData: companyData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err });
  }
};

export const getCompanyProjectsData = async (req, res) => {
  try {
    const companyProjectsData = [];
    let i = Number(req.body.yearsFrom.value);

    // getting last x year data
    let floorYear = i - 3;
    let totalProjects = 0;

    for (i; i >= floorYear; i--) {
      let data = req.body;
      data.year = i;
      let projectRes = await findProjectsData(data);
      if (projectRes?.status === false) {
        res.status(404).send(projectRes);
      }
      totalProjects += projectRes.result.length;
      companyProjectsData.push(projectRes);
    }
    let totalPotentialEarning = 0;
    companyProjectsData.forEach((item) => {
      item.result.forEach((subItem) => {
        totalPotentialEarning += parseFloat(
          subItem.contract[0].price_agree.replace(/,/g, "")
        );
      });
    });

    res.status(200).json({
      status: true,
      companyProjectsData: companyProjectsData,
      totalProjects: totalProjects,
      totalPotentialEarning: totalPotentialEarning,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err });
  }
};

// get department data

const findDepartmentCodeAndProjects = async (data) => {
  let resp;
  for (let i = 0; i < apiKeys.length; i++) {
    const url = `https://opend.data.go.th/govspending/egpdepartment?api-key=${apiKeys[i]}&dept_name=${data?.dept_name}`;

    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const res = await response.json(); // Convert response body to JSON
    if (res.message !== "API rate limit exceeded") resp = res;
  }
  const departmentCodeRes = resp?.result;
  let result = [];
  if (departmentCodeRes) {
    for (let i = 0; i < departmentCodeRes.length; i++) {
      data.dept_code = departmentCodeRes[i].dept_code;
      let year = Number(data?.year);
      let floorYear1 = year - 5;
      console.log(departmentCodeRes[i].dept_code);
      while (result.length < 5 && year >= floorYear1) {
        console.log(
          "============================getting department projects==========================="
        );
        const projectRes = await findProjectsData(data);
        console.log(projectRes);
        if (projectRes?.status === false) {
          return projectRes;
        }
        result.push(...projectRes?.result);
        year -= 1;
        data.year = year;
      }
    }
    return result;
  }
  return [];
};

const findDepartmentSummary = async (data) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const url = `https://opend.data.go.th/govspending/summary_cgdcontract?api-key=${
      apiKeys[i]
    }&year=${data?.year + 543}&dept_code=${data?.dept_code}`;

    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const res = await response.json(); // Convert response body to JSON
    if (res.message !== "API rate limit exceeded") return res;
  }

  if (res?.summary) {
    return { status: true, summary: res?.summary }; // Return the JSON data
  }
  return { status: false, message: "department summary not found" };
};

export const getDepartmentData = async (req, res) => {
  try {
    const data = { ...req.body };
    const result = await findDepartmentCodeAndProjects(data);
    const initialYear = Number(data?.year);
    data.year = initialYear;
    let summaryResult = { total_project: "", total_price: "" };
    let summaryYear = Number(data.year);
    let floorYear = summaryYear - 3;

    while (
      summaryResult?.total_project?.length <= 0 &&
      summaryYear >= floorYear
    ) {
      // console.log("dept summary", summaryYear);
      const summaryRes = await findDepartmentSummary(data);

      summaryResult = {
        total_project: summaryRes?.summary?.total_project || "",
        total_price: summaryRes?.summary?.total_price || "",
        year: summaryYear,
      };

      summaryYear -= 1;
      data.year = summaryYear;
    }

    res.status(200).json({ deptProjects: result, summaryResult });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("There seems to be some technical issue while fetching the data");
  }
};

//winner data

const filterWinnerTins = (data, winner) => {
  return data.filter(
    (entry) => entry.winner_tin.startsWith("0") && entry.winner === winner
  );
};

export const findWinnerTin = async (winner, limit = 20) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const url = `https://opend.data.go.th/govspending/egpwinner?api-key=${
      apiKeys[i]
    }&winner=${winner}&limit=${limit || 20}&offset=0`;

    // console.log(i, url);

    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const res = await response.json(); // Convert response body to JSON
    const winnerTins = filterWinnerTins(res.result, winner);
    if (res?.message !== "API rate limit exceeded") return winnerTins;
  }
};
