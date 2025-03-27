import { Router } from "express";
const reportRoutes = Router();
import ReportController from "../controllers/report/ReportController.js";
import {storeReport} from "../middlewares/validate/web/report_validation.js";
import authCookieJWT from "../middlewares/authCookieJWT.js";
import authenticateJWT from "../middlewares/authJWT.js";


reportRoutes.get('/report/',authCookieJWT,ReportController.list);

reportRoutes.get('/report/:report_type/:id',ReportController.index);
//storeReport,
reportRoutes.post('/report',ReportController.mobileStore);


export {reportRoutes};
