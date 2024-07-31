import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";

const VisualizationForm = () => {
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (localStorage.getItem("apiData")) {
      localStorage.clear();
    }
    populateYears();
    // if (apiData?.data) {
    //   resultTableRef.current.scrollIntoView({
    //     top: 0,
    //     left: 0,
    //     behaviour: "smooth",
    //   });
    // }
  }, []);

  function onSubmit(data) {
    console.log(data);
    setIsLoading(true);
    // axios
    //   .post(`${import.meta.env.VITE_API_URL}/projects/find`, data)
    //   .then((res) => {
    //     let resData = { data: res.data.result, formData: data };
    //     setApiData(resData);
    //     localStorage.setItem("apiData", JSON.stringify(resData));
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setIsLoading(false);
    //   })
  }



  // X axes
  // 1. 
  // 2. 
  // 3. 
  // 4. 
  // 5. 
  // 6. 
  // 7. 
  // 8. 
  // 9. 
  
  // Y1/y2 axis
  // 1. 
  // 2. 
  // 3. 
  // 4. ⁠lead time (project award date - project announce date)
  
  
  
  // Functions
  // sum
  // ⁠average
  // ⁠median
  // ⁠count
  // ⁠%total
  
const xAxesData = [
  {value: 'Year', label: 'Year'},
  {value: '⁠month', label: '⁠month'},
  {value: '⁠department name', label: '⁠department name'},
  {value: '⁠company name', label: '⁠company name'},
  {value: '⁠purchase method', label: '⁠purchase method'},
  {value: '⁠sub purchase method', label: '⁠sub purchase method'},
  {value: '⁠project status', label: '⁠project status'},
  {value: '⁠location', label: '⁠location'},
  {value: '⁠budget range', label: '⁠budget range'},
  
]
  
  
const yAxesData = [
  {value: 'Project budget value', label: 'Project budget value'},
  {value: '⁠winning bid value', label: '⁠winning bid value'},
  {value: '⁠project id', label: '⁠project id'},
  {value: '⁠lead time', label: '⁠lead time'},
]

const groupByData = [
  {value: 'sum', label: 'sum'},
  {value: '⁠average', label: '⁠average'},
  {value: '⁠median', label: '⁠median'},
  {value: '⁠count', label: '⁠count'},
  {value: '⁠%total', label: '⁠%total'},

]
  

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="text-3xl font-semibold">
        Visualize Data
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
              <option key={"Thailand"} value={"Thailand"} selected>
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
            <select
              id="announceDateTo"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
              {...register("announceDateTo", { required: false })}
            >
              {years &&
                years.map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
            </select>
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
                render={({ field }) => (
                  <Select
                    {...field}
                    options={xAxesData}
                  />
                )}
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
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yAxesData}
                  />
                )}
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
                  <Select
                    {...field}
                    options={groupByData}
                  />
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
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yAxesData}
                  />
                )}
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
                  <Select
                    {...field}
                    options={groupByData}
                  />
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

      {isLoading && <Skeleton count={6} className="  w-[55vw] h-[40px]" />}
    </div>
  );
};

export default VisualizationForm;
