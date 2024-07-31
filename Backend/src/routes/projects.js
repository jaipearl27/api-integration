import express from "express";
import { getCompanyProjectsData, getData, getDepartmentData } from "../controller/projects.js";


const projectsRouter = express.Router();
projectsRouter.route("/find").post(getData);
projectsRouter.route("/companyprojects").post(getCompanyProjectsData);
projectsRouter.route("/department").post(getDepartmentData)

export default projectsRouter;
 