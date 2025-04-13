import { Router } from "express"
import ShareEventController from "../controllers/share/ShareEventController.js"
import { isEmpParamObjId } from "../middlewares/isEmpty.js"

const shareRoutes = Router()
shareRoutes.get("/event/share/:id",isEmpParamObjId,ShareEventController.indexshare)
shareRoutes.get("/meeting/share/:id",isEmpParamObjId, ShareEventController.meetIndex)
shareRoutes.get("/company/share/:id",isEmpParamObjId, ShareEventController.companyIndex)

export default shareRoutes