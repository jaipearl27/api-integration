import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { Toaster, toast } from "sonner";
import axios from "axios";
import BarChart from '../components/BarChart'

const VisualizationForm = () => {
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const populateYears = () => {
    let currentYear = new Date().getFullYear();
    let earliestYear = 1970;
    let yearsArr = [];
    while (currentYear >= earliestYear) {
      yearsArr.push(currentYear);
      currentYear -= 1;
    }
    setYears(yearsArr);
  };

  useEffect(() => {
    // if (localStorage.getItem("apiData")) {
    //   localStorage.clear();
    // }
    populateYears();
  }, []);

  const processData = (data) => {
    let tempArr = [];
    let cleanedArr = [];
    for (let i = 0; i < data?.length; i++) {
      const result = data[i].result.map((project) => {
        project.project_money = removeCommaFromNum(project.project_money);
        project.sum_price_agree = removeCommaFromNum(project.sum_price_agree);
        return project;
      });
      tempArr = [...tempArr, ...result];
    }
    let groupedResult = Object.groupBy(tempArr, ({ budget_year }) => budget_year);
    Object.keys(groupedResult).forEach((e) => {
      let tempObj = {};
      tempObj = groupedResult[`${e}`];
      cleanedArr.push(tempObj);
    });

    let calcArr = cleanedArr.map((dept) => {
      const projects = dept;
      const totalReferencePrice = projects.reduce(
        (sum, project) => sum + parseFloat(project.price_build),
        0
      );
      const totalWinningPrice = projects.reduce(
        (sum, project) => sum + parseFloat(project.sum_price_agree),
        0
      );

      const projectCount = projects.length;

      const y1 = totalReferencePrice / projectCount;
      const y2 = totalWinningPrice / projectCount;

      return {
        xAxis: Number(projects[0][`budget_year`]) - 543,
        y1,
        y2,
      };
    });

    return calcArr || [];
  };

  const removeCommaFromNum = (item) => {
    return item.replace(/\,/g, "");
  };

  const generateChartData = (data) => {
    let chartStructure = {
      labels: [],
      datasets: [
        {
          label: "y1", // x axis
          backgroundColor: "red",
          data: [], // y axis
        },
        {
          label: "y2", // x axis
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
    console.log(chartStructure)
    setChartData(chartStructure);
  };

  useEffect(() => {
    if (!apiData && apiData?.length <= 0) return;

    const calcArr = processData(apiData?.data)

    generateChartData(calcArr);
  }, [apiData]);

  const onSubmit = (data) => {
    if (Number(data?.yearsTo?.value) - Number(data?.yearsFrom?.value) > 10) {
      toast.error("Year range must be 10 years max", {
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    if (Number(data?.yearsFrom?.value) > Number(data?.yearsTo?.value)) {
      toast.error("Year From needs to be equal to/smaller than Year To", {
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/projects/visualization`, data)
      .then((res) => {
        console.log(res)
        let resData = { data: res.data, formData: data };
        setApiData(resData);
        if (resData?.data?.length > 0) {
          toast.success("Projects Data Found", {
            style: {
              background: "green",
              color: "white",
            },
          });
        } else {
          toast.error("No Data Found", {
            style: {
              background: "red",
              color: "white",
            },
          });
        }
        chartRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        localStorage.setItem("apiData", JSON.stringify(resData));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.status === 404) {
          toast.error(err?.response?.data?.message, {
            style: {
              background: "red",
              color: "white",
            },
          });
        } else {
          toast.error(err?.message, {
            style: {
              background: "red",
              color: "white",
            },
          });
        }
        setIsLoading(false);
      });
  };

  const xAxesData = [
    { value: "Year", label: "Year" },
    { value: "⁠month", label: "⁠month" },
    { value: "⁠department name", label: "⁠department name" },
    { value: "⁠company name", label: "⁠company name" },
    { value: "⁠purchase method", label: "⁠purchase method" },
    { value: "⁠sub purchase method", label: "⁠sub purchase method" },
    { value: "⁠project status", label: "⁠project status" },
    { value: "⁠location", label: "⁠location" },
    { value: "⁠budget range", label: "⁠budget range" },
  ];

  const yAxesData = [
    { value: "Project budget value", label: "Project budget value" },
    { value: "⁠winning bid value", label: "⁠winning bid value" },
    { value: "⁠project id", label: "⁠project id" },
    { value: "⁠lead time", label: "⁠lead time" }, // (project award date - project announce date)
  ];

  // { value: "⁠lead time", label: "⁠lead time" }, // (project award date - project announce date)

  const groupByData = [
    { value: "sum", label: "sum" },
    { value: "⁠average", label: "⁠average" },
    { value: "⁠median", label: "⁠median" },
    { value: "⁠count", label: "⁠count" },
    { value: "⁠%total", label: "⁠%total" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <Toaster />
      <div className="text-xl md:text-2xl font-semibold pb-4">
        Visualize Data (in development)
      </div>
      <form
        className="w-full px-10 md:px-0 md:w-[800px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="">
          <div className="mb-1">
            <label
              htmlFor="Country"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Country
            </label>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
              {...register("country", { required: false })}
            >
              <option
                key={"Thailand"}
                value={"Thailand"}
                defaultValue={"Thailand"}
              >
                {"Thailand"}
              </option>
            </select>
          </div>
        </div>

        <div className="mb-1">
          <label
            htmlFor="keyword"
            className="block mb-1 text-sm font-medium text-gray-90"
          >
            Keyword
          </label>
          <input
            type="text"
            id="keyword"
            placeholder="keyword"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            {...register("keyword", { required: true })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="mb-1">
            <label
              htmlFor="yearFrom"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Year
            </label>
            <Controller
              name="yearsFrom"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={years.map((year) => ({
                    value: year,
                    label: year,
                  }))}
                  required
                />
              )}
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="announceDateTo"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Till
            </label>
            <Controller
              name="yearsTo"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={years.map((year) => ({
                    value: year,
                    label: year,
                  }))}
                />
              )}
            />
          </div>
        </div>

        <div className="w-1/2">
          <div className="mb-1">
            <label
              htmlFor="x_axes"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              X Axes
            </label>
            <Controller
              name="xAxes"
              control={control}
              render={({ field }) => <Select {...field} options={xAxesData} />}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="mb-1">
            <label
              htmlFor="y_axes_1"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Y Axes1
            </label>
            <Controller
              name="yAxes1"
              control={control}
              render={({ field }) => <Select {...field} options={yAxesData} />}
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="y_axes_1_group_by"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Group By
            </label>
            <Controller
              name="groupBy1"
              control={control}
              render={({ field }) => (
                <Select {...field} options={groupByData} />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="mb-1">
            <label
              htmlFor="y_axes_2"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Y Axes2
            </label>
            <Controller
              name="yAxes2"
              control={control}
              render={({ field }) => <Select {...field} options={yAxesData} />}
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="y_axes_2_group_by"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Group By
            </label>
            <Controller
              name="groupBy2"
              control={control}
              render={({ field }) => (
                <Select {...field} options={groupByData} />
              )}
            />
          </div>
        </div>

        <div className="mt-2 flex gap-2 justify-center">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            //   onClick={() => setApiData(null)}
          >
            {isLoading ? "Loading..." : "Visualise"}
          </button>

          <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            onClick={() => {
              reset();
              // localStorage.removeItem("apiData");
              // setApiData(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div ref={chartRef}>
        {isLoading && <Skeleton count={6} className="  w-[55vw] h-[40px]" />}
        {chartData && <BarChart data={chartData} />}
      </div>
    </div>
  );
};

export default VisualizationForm;
