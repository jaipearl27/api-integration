import express from "express";
import { getCompanyProjectsData, getData, getDepartmentData } from "../controller/projects.js";
import { getVisualizationData } from "../controller/visualization.js";


const projectsRouter = express.Router();
projectsRouter.route("/find").post(getData);
projectsRouter.route("/companyprojects").post(getCompanyProjectsData);
projectsRouter.route("/department").post(getDepartmentData)

// route for projects data for visualization page
projectsRouter.route("/visualization").post(getVisualizationData)


export default projectsRouter;
 