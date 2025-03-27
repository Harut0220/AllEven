import { Router } from "express";
import companyController from "../../../controllers/api/company/companyController.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";

const companyAdminRouter=Router()

companyAdminRouter.get("/single/:id",isEmpParamObjId, companyController.singleCompany);

companyAdminRouter.get("/online/single/:id",isEmpParamObjId, companyController.OnlineSingleCompany);

// companyAdminRouter.get("/single/pay/:id",isEmpParamObjId, companyController.singlePay);

companyAdminRouter.get("/show/:id",isEmpParamObjId, companyController.companyShow);

companyAdminRouter.post("/destroy/many", companyController.destroyCompany);//must be DELETE

companyAdminRouter.delete("/image/:id",isEmpParamObjId, companyController.destroyCompanyImage);

companyAdminRouter.post("/resolve/:id",isEmpParamObjId, companyController.resolve);

companyAdminRouter.get("/resolve/:id",isEmpParamObjId, companyController.resolve);

companyAdminRouter.post("/online/resolve/:id",isEmpParamObjId, companyController.OnlineResolve);

companyAdminRouter.get("/online/resolve/:id",isEmpParamObjId, companyController.OnlineResolve);

companyAdminRouter.post("/reject/:id",isEmpParamObjId,companyController.reject)

companyAdminRouter.get("/reject/:id",isEmpParamObjId,companyController.reject)

companyAdminRouter.post("/online/reject/:id",isEmpParamObjId,companyController.OnlineReject)

companyAdminRouter.get("/online/reject/:id",isEmpParamObjId,companyController.OnlineReject)

companyAdminRouter.get("/online",companyController.onlinePage);

companyAdminRouter.get("/page",companyController.index);

companyAdminRouter.get("/pays/:id",companyController.pays);

companyAdminRouter.get("/price/page",companyController.pricePage)

companyAdminRouter.post("/commission/edit/:id",isEmpParamObjId,companyController.priceEdit)

companyAdminRouter.delete("/service/image/:id",companyController.deleteServiceImage)



export default companyAdminRouter