import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";
import { BeatLoader } from "react-spinner";
import Skeleton from "react-loading-skeleton";
import {toast, Toaster} from 'sonner'

const Form = () => {
  const [apiData, setApiData] = useState(
    JSON.parse(localStorage.getItem("apiData"))
  );
  const [countries, setCountries] = useState(null);
  const [years, setYears] = useState([]);
  const [apiUrl, setApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // refs
  const resultTableRef = useRef(null);
  const [formData, setFormData] = useState(null);

  const {
    control,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // sample data

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
    if (apiData?.data) {
      resultTableRef.current.scrollTo({
        top: 0,
        left: 0,
        behaviour: "smooth",
      });
    }
  }, []);

  const onSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/projects/find`, data)
      .then((res) => {
        let resData = { data: res.data.result, formData: data };
        setApiData(resData);
        if(resData?.data?.length > 0) {
          toast.success('Projects Data Found', {
            style: {
              background: "green",
              color: "white",
            },
          })
        } else {
          toast.error('No Data Found', {
            style: {
              background: "red",
              color: "white",
            },
          })
        }
        resultTableRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        localStorage.setItem("apiData", JSON.stringify(resData));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const projectType = [
    { label: "ซื้อ", value: "ซื้อ" },
    { label: "จ้างก่อสร้าง", value: "จ้างก่อสร้าง" },
    { label: "จ้างทำของ/จ้างเหมาบริการ", value: "จ้างทำของ/จ้างเหมาบริการ" },
    { label: "จ้างที่ปรึกษา", value: "จ้างที่ปรึกษา" },
    { label: "จ้างออกแบบ", value: "จ้างออกแบบ" },
    { label: "จ้างควบคุมงาน", value: "จ้างควบคุมงาน" },
    {
      label: "จ้างออกแบบและควบคุมงานก่อสร้าง",
      value: "จ้างออกแบบและควบคุมงานก่อสร้าง",
    },
  ];

  const purchaseMethod = [
    {
      label: "ตลาดอิเล็กทรอนิกส์ (e-market)",
      value: "ตลาดอิเล็กทรอนิกส์ (e-market)",
    },
    {
      label: "ประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
      value: "ประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
    },
    { label: "คัดเลือก", value: "คัดเลือก" },
    { label: "เฉพาะเจาะจง", value: "เฉพาะเจาะจง" },
  ];

  const purchaseSubMethod = [
    { label: "ซื้อ", value: "ซื้อ" },
    { label: "⁠จ้างก่อสร้าง", value: "⁠จ้างก่อสร้าง" },
    { label: "⁠จ้างทำของ/จ้างเหมาบริการ", value: "⁠จ้างทำของ/จ้างเหมาบริการ" },
    { label: "⁠เช่า", value: "⁠เช่า" },
    { label: "⁠จ้างที่ปรึกษา", value: "⁠จ้างที่ปรึกษา" },
    { label: "⁠จ้างออกแบบ", value: "⁠จ้างออกแบบ" },
    { label: "⁠จ้างควบคุมงาน", value: "⁠จ้างควบคุมงาน" },
    {
      label: "⁠จ้างออกแบบและควบคุมงานก่อสร้าง",
      value: "⁠จ้างออกแบบและควบคุมงานก่อสร้าง",
    },
  ];

  const projectStatus = [
    { label: "ระหว่างดำเนินการ ", value: "ระหว่างดำเนินการ " },
    { label: "จัดทำสัญญา/PO แล้ว", value: "จัดทำสัญญา/PO แล้ว" },
    { label: "แล้วเสร็จตามสัญญา", value: "แล้วเสร็จตามสัญญา" },
    { label: "ยกเลิกสัญญา", value: "ยกเลิกสัญญา" },
    { label: "ยกเลิกโครงการ ", value: "ยกเลิกโครงการ " },
  ];

  return (
    <div className="flex flex-col gap-10 justify-center py-10">
      <Toaster />
      <div className="flex flex-col justify-center  items-center gap-4">
        <div className="text-2xl font-semibold">Data Request Form:</div>
        <form
          className="w-full px-10 md:px-0 md:w-[800px] z-[99999]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-2">
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
                <option key={"Thailand"} defaultValue={"Thailand"}>
                  {"Thailand"}
                </option>
              </select>
            </div>

            <div className="mb-1">
              <label
                htmlFor="winningCompany"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Winning Company Name
              </label>
              <input
                type="text"
                id="winningCompany"
                placeholder="winningCompany"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                {...register("winningCompany", { required: false })}
              />
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
                Year From
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
                htmlFor="yearTo"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                To
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

          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label
                htmlFor="purchaseMethod"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Purchase Method
              </label>
              <Controller
                name="purchaseMethod"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={purchaseMethod} />
                )}
              />
            </div>

            <div className="mb-1">
              <label
                htmlFor="purchaseSubmethod"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Purchase Sub-Method
              </label>
              <Controller
                name="purchaseSubMethod"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={purchaseSubMethod} />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="mb-1">
              <label
                htmlFor="xaxis"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Department
              </label>
              <input
                type="text"
                id="xaxis"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="yaxis2"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Sub department
              </label>
              <input
                type="text"
                id="yaxis2"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              />
            </div>
            <div className="mb-1">
              <label
                htmlFor="projectType"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Project Type
              </label>
              <Controller
                name="projectType"
                control={control}
                render={({ field }) => (
                  <Select {...field} options={projectType} />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label
                htmlFor="announceDateFrom"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Announce Date From
              </label>
              <select
                id="announceDateFrom"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                {...register("announceDateFrom", { required: false })}
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

          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label
                htmlFor="referencePriceFrom"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Reference Price From
              </label>
              <input
                type="number"
                min={0}
                id="referencePriceFrom"
                placeholder="Price From"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                {...register("referencePriceFrom", { required: false })}
              />
            </div>

            <div className="mb-1">
              <label
                htmlFor="referencePriceTo"
                className="block mb-1 text-sm font-medium text-gray-90"
              >
                Till
              </label>
              <input
                type="number"
                min={0}
                id="referencePriceTo"
                placeholder="Price Till"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                {...register("referencePriceTo", { required: false })}
              />
            </div>
          </div>
          <div className="mb-1">
            <label
              htmlFor="projectStatus"
              className="block mb-1 text-sm font-medium text-gray-90"
            >
              Project Status
            </label>
            <Controller
              name="projectStatus"
              control={control}
              render={({ field }) => (
                <Select {...field} options={projectStatus} />
              )}
            />
          </div>

          <div className="mt-2 flex gap-2 justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={() => setApiData(null)}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>

            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
              onClick={() => {
                reset();
                localStorage.removeItem("apiData");
                setApiData(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
        
      </div>
      <div ref={resultTableRef}>
        {isLoading && <Skeleton count={10} className="h-[40px]" />}
        {apiData?.data?.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="text-2xl text-center font-semibold">Result:</div>
            <div className="relative overflow-x-auto sm:rounded-lg shadow-[0_0_1px_0px#000] mb-10">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500  ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Winning Company
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3"
                      style={{ width: "200px" }}
                    >
                      Reference Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3"
                      style={{ width: "200px" }}
                    >
                      Winning Bid
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3"
                      style={{ width: "150px" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiData?.data &&
                    apiData?.data?.map((item, idx) => (
                      <tr
                        key={`data${idx}`}
                        className="odd:bg-indigo-100  even:bg-violet-100  border-b font-[500] hover:!text-black "
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {idx + 1}
                        </th>
                        <td className="px-6 py-4 text-blue-500 hover:text-blue-700 hover:underline transition duration-300">
                          <Link
                            to="/report"
                            state={{ data: item, formData: apiData.formData }}
                          >
                            {item?.project_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{item?.dept_name}</td>
                        <td className="px-6 py-4">
                          {item?.contract[0]?.winner} {item?.contract[0]?.winner_tin}
                        </td>
                        <td className="px-6 py-4">{item?.province}</td>
                        <td className="px-6 py-4">
                          &#3647; {item?.price_build}
                        </td>
                        <td className="px-6 py-4">
                          &#3647; {item?.contract[0]?.price_agree}
                        </td>
                        <td className="px-6 py-4">
                          {item?.contract[0]?.status}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Form;
