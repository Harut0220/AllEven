import { Router } from "express"
import ShareEventController from "../controllers/share/ShareEventController.js"
import { isEmpParamObjId } from "../middlewares/isEmpty.js"

const shareRoutes = Router()

shareRoutes.get("/event/:id",isEmpParamObjId, ShareEventController.index)
shareRoutes.get("/meeting/:id",isEmpParamObjId, ShareEventController.meetIndex)
shareRoutes.get("/company/:id",isEmpParamObjId, ShareEventController.companyIndex)
shareRoutes.get("/service/:id",isEmpParamObjId, ShareEventController.serviceIndex)

export default shareRoutes