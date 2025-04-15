import { Router } from "express";
import UserController from "../../../controllers/user/profile/UserController.js";
import NotificationController from "../../../controllers/user/profile/NotificationController.js";
import StatisticController from "../../../controllers/user/profile/StatisticController.js";
import CategoryController from "../../../controllers/user/profile/CategoryController.js";
import adminOrModerator from "../../../middlewares/adminOrModerator.js";
import DocumentController from "../../../controllers/user/profile/DocumentController.js";
import EventController from "../../../controllers/user/profile/EventController.js";
import EventCategoryController from "../../../controllers/user/profile/EventCategoryController.js";
import { eventCategory } from "../../../middlewares/validate/web/event.js";
import EventCommentController from "../../../controllers/event/EventCommentController.js";
import { store } from "../../../middlewares/validate/web/document.js";
import { store as notStore } from "../../../middlewares/validate/web/notification.js";
import meetingController from "../../../controllers/api/meeting/meetingController.js";
import companyController from "../../../controllers/api/company/companyController.js";
import companyAdminRouter from "./company.js";
import meetingAdminRouter from "./meeting.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";
const profileRoutes = Router();

profileRoutes.get("/", async (req, res) => {
  res.redirect("/admin/profile/users");
});

profileRoutes.get("/users", UserController.index);

profileRoutes.get("/users/:id",isEmpParamObjId, UserController.single);

profileRoutes.post("/users/block/:id",isEmpParamObjId, adminOrModerator, UserController.block); //This must be patch

profileRoutes.post(
  "/users/destroy/:id",
  adminOrModerator,isEmpParamObjId,
  UserController.destroy
); //This must be delete

profileRoutes.post("/users/update/:id", adminOrModerator,isEmpParamObjId, UserController.edit); //This must be put

profileRoutes.get("/notification", NotificationController.indexForAdmin);

profileRoutes.post("/notification/confirm/:id",NotificationController.notificationAdminConfirm)

profileRoutes.get("/notifications/admin",NotificationController.getNotifsAdmin)

profileRoutes.post(
  "/notification/store",
  notStore,
  NotificationController.store
);

profileRoutes.get("/notification/edit/:id",isEmpParamObjId, NotificationController.edit);

profileRoutes.get("/notification/create", NotificationController.create);

profileRoutes.get("/notification/feedback", NotificationController.feedback);

profileRoutes.post(
  "/notification/feedback/store",
  NotificationController.storeFeedback
);

profileRoutes.get(
  "/notification/categories",
  NotificationController.categories
);

profileRoutes.post(
  "/notification/categories/destroy",
  NotificationController.destroyManyCatgs
); //must be DELETE

profileRoutes.post("/notification/update/:id",isEmpParamObjId, NotificationController.update);

profileRoutes.post("/notification/destroy/:id",isEmpParamObjId, NotificationController.destroy); //must be DELETE

profileRoutes.post(
  "/notification/change/status/:id",isEmpParamObjId,
  NotificationController.changeStatus
); //must be PATCH

profileRoutes.get("/statistic", StatisticController.index);

profileRoutes.get("/caregories", CategoryController.index);

profileRoutes.get("/events", EventController.index);

profileRoutes.delete("/event/image/:id",isEmpParamObjId, EventController.destroyImage);

profileRoutes.delete("/meet/image/:id",isEmpParamObjId, meetingController.destroyImage);

profileRoutes.post("/events/destroy/many", EventController.destroy); //must be DELETE

profileRoutes.get("/event/single/:id",isEmpParamObjId, EventController.single);

profileRoutes.get("/event/show/:id",isEmpParamObjId, EventController.show);

profileRoutes.post("/event/edit/:id",isEmpParamObjId, EventController.edit); // must be PUT

profileRoutes.post("/event/reject/:id",isEmpParamObjId, EventController.reject); // must be PATCH

profileRoutes.get("/event/reject/:id",isEmpParamObjId, EventController.reject); // must be PATCH

profileRoutes.get("/event-categories", EventCategoryController.index);

profileRoutes.post(
  "/event-category/edit/:id",
  eventCategory,isEmpParamObjId,
  EventCategoryController.edit
); //must be PUT

profileRoutes.post(
  "/event-category/store",
  eventCategory,
  EventCategoryController.store
);

profileRoutes.get("/documents", DocumentController.index);
//store,
profileRoutes.post("/document/store", store, DocumentController.store);

profileRoutes.get("/document/edit/:id",isEmpParamObjId, DocumentController.edit);

profileRoutes.post("/document/update/:id",isEmpParamObjId, DocumentController.update); //must be PUT

profileRoutes.get(
  "/documents/subscribed-users",
  DocumentController.subscribedUsers
);

profileRoutes.post(
  "/event/comment/destroy/:id",isEmpParamObjId,
  EventCommentController.destroy
); 

profileRoutes.use("/company",companyAdminRouter)

profileRoutes.use("/meeting",meetingAdminRouter)

profileRoutes.get("/meet/single/:id",isEmpParamObjId,meetingController.meetSingle)

profileRoutes.get("/meet/show/:id",isEmpParamObjId,meetingController.meetShow)

profileRoutes.post("/meet/reject/:id",isEmpParamObjId,meetingController.meetReject)

profileRoutes.post("/meet/resolve/:id",isEmpParamObjId,meetingController.show)

profileRoutes.post("/meet/edit/:id",isEmpParamObjId,meetingController.edite)
// profileRoutes.post("/meet/image/delete/:id",meetingController.destroyImage)


export { profileRoutes };
