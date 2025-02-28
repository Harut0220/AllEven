import { Router } from "express";
import EventController from "../../../controllers/user/profile/EventController.js";
import meetingController from "../../../controllers/api/meeting/meetingController.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";

const meetingAdminRouter=Router()

meetingAdminRouter.get("/single/:id",isEmpParamObjId, EventController.singleMeeting);

meetingAdminRouter.post("/verify/resolve/:id",isEmpParamObjId, meetingController.resolve);

meetingAdminRouter.post("/verify/reject/:id",isEmpParamObjId,meetingController.reject)

meetingAdminRouter.get("/verify/reject/:id",isEmpParamObjId,meetingController.reject)

meetingAdminRouter.post("/verify/destroy/many",meetingController.destroyVerify)

meetingAdminRouter.get("/participants/:id",isEmpParamObjId,meetingController.participantsPage)

meetingAdminRouter.post("/destroy/many",meetingController.destroy)

meetingAdminRouter.get("/page",meetingController.index)

meetingAdminRouter.get("/verify",meetingController.verifies)

export default meetingAdminRouter