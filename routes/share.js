import { Router } from "express"
import ShareEventController from "../controllers/share/ShareEventController.js"
import { isEmpParamObjId } from "../middlewares/isEmpty.js"

const shareRoutes = Router()
//isEmpParamObjId,
shareRoutes.get("/event/:id", ShareEventController.index)
shareRoutes.get("/event/share/:id",ShareEventController.indexshare)
shareRoutes.get("/meeting/share/:id", ShareEventController.meetIndex)
shareRoutes.get("/company/share/:id", ShareEventController.companyIndex)
shareRoutes.get("/service/:id", ShareEventController.serviceIndex)

export default shareRoutes