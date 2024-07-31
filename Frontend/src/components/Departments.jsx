import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const Departments = ({ formData, departmentName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deptSummary, setDeptSummary] = useState(null);
  const [deptProjects, setDeptProjects] = useState(null);

  useEffect(() => {
    let data = {
      limit: 20,
      year: 2024,
      dept_name: departmentName,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/projects/department`, data)
      .then((res) => {
        console.log(res, "department data");
        setDeptSummary(res?.data?.summaryResult);
        setDeptProjects(res?.data?.deptProjects);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-2">
      {isLoading ? (
        <Skeleton count={10} className="h-[40px] col-span-2 w-full" />
      ) : (
        <>
          <div className="col-span-1 flex flex-col gap-4">
            <div className="pl-2 text-2xl font-semibold">
              Department Summary
            </div>
            {deptSummary?.total_project ? (
              <div className="relative overflow-x-auto sm:rounded-lg shadow-[0_0_1px_0px#000] mb-10">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500  ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd:bg-white  even:bg-gray-50  border-b ">
                      <td className="px-6 py-4 font-bold">Department Name</td>
                      <td className="px-6 py-4">{deptSummary?.year} </td>
                    </tr>
                    <tr className="odd:bg-white  even:bg-gray-50  border-b ">
                      <td className="px-6 py-4 font-bold">Year</td>
                      <td className="px-6 py-4">{deptSummary?.year} </td>
                    </tr>
                    <tr className="odd:bg-white  even:bg-gray-50  border-b ">
                      <td className="px-6 py-4 font-bold">Total Projects</td>
                      <td className="px-6 py-4">
                        {deptSummary?.total_project}{" "}
                      </td>
                    </tr>

                    <tr className="odd:bg-white  even:bg-gray-50  border-b ">
                      <td className="px-6 py-4 font-bold">
                        Total Projects Value
                      </td>
                      <td className="px-6 py-4">
                        {`฿ ${deptSummary?.total_price.toLocaleString(
                          "en-US"
                        )}`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="pl-2 mb-10 font-medium">
                No Dept Summary Found till {deptSummary?.year}
              </div>
            )}
          </div>

          <div className="col-span-2 ">
            <div className="pl-2 pb-2 text-2xl font-semibold">
              Similar Projects by this department
            </div>
            {deptProjects ? (
              <table className="text-sm text-left rtl:text-right text-gray-500  ">
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
                  {deptProjects &&
                    deptProjects?.map((item, idx) => (
                      <tr
                        key={`deptProject${idx}`}
                        className="odd:bg-gray-100  even:bg-white  border-b font-[500] hover:!text-black "
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
                            state={{ data: item, formData: formData }}
                          >
                            {item?.project_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{item?.dept_name}</td>
                        <td className="px-6 py-4">
                          {item?.contract[0]?.winner}
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
            ) : (
              <div>No Data Found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Departments;
