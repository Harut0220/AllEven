import { Router } from "express";
import AuthController from "../controllers/api/user/AuthController.js";
import {
  signup,
  signin,
  passwordReset,
  passwordResetConfirm,
  passwordResetNewPass,
  existsPhoneNumber,
  confirmPhoneNumber,
} from "../middlewares/validate/api/auth-validation.js";
import authenticateJWT from "../middlewares/authJWT.js";
import { eventRoutes } from "./prefix/api/event.js";
import DocumentController from "../controllers/api/user/DocumentController.js";
import { store } from "../middlewares/validate/api/document.js";
import FeedbackController from "../controllers/api/user/FeedbackController.js";
import { profileRoutes } from "./prefix/api/profile.js";
import NotificationController from "../controllers/api/user/NotificationController.js";
import FileUploadController from "../controllers/upload/FileUploadController.js";
import {
  storeOne,
  storeMulti,
} from "../middlewares/validate/api/uploadFile.js";
import { storeReport } from "../middlewares/validate/web/report_validation.js";
import ReportController from "../controllers/report/ReportController.js";
import companyRouter from "./prefix/api/company.js";
import meetingRouter from "./prefix/api/meeting.js";
import serviceRouter from "./prefix/api/service.js";
import newAuthJWT from "../middlewares/newAuthJWT.js";
import payRouter from "./prefix/api/payRouter.js";
import { reportRoutes } from "./report.js";

const apiRoutes = Router();

apiRoutes.use(reportRoutes);

apiRoutes.get("/", (req, res) => {
  res.json({ name: "tesName" });
});



apiRoutes.post("/", (req, res) => {
  res.json(req.body);
});

apiRoutes.get(
  "/get_phone_code",
  existsPhoneNumber,
  AuthController.getPhoneCode
);

apiRoutes.post(
  "/phone_code_confirm",
  confirmPhoneNumber,
  AuthController.signupConfirmPhoneCode
);
//
apiRoutes.post("/sign_up", signup, AuthController.signUp);

apiRoutes.get("/login", AuthController.login);

apiRoutes.post("/login", signin, AuthController.signIn);

apiRoutes.post("/logout", authenticateJWT, newAuthJWT, AuthController.logout);

apiRoutes.post("/password/reset", passwordReset, AuthController.passwordReset);

apiRoutes.post(
  "/password/reset/confirm",
  passwordResetConfirm,
  AuthController.passwordResetConfirm
);

apiRoutes.post(
  "/password/reset/new",
  passwordResetNewPass,
  AuthController.passwordResetNewPass
);

apiRoutes.get(
  "/user/notif/status",
  newAuthJWT,
  NotificationController.opportunity
);

apiRoutes.use("/event", eventRoutes); //notif+

apiRoutes.use("/company", companyRouter);

apiRoutes.use("/service", serviceRouter);

apiRoutes.use("/meeting", meetingRouter); //notif+

apiRoutes.use("/pay", payRouter);

apiRoutes
  .route("/document")
  .get(authenticateJWT, DocumentController.get)
  .post(authenticateJWT, store, DocumentController.store);

apiRoutes.get("/get/documents", newAuthJWT, DocumentController.getDocuments);

apiRoutes.get("/get/documents/global", DocumentController.getDocumentsGlobal);

apiRoutes
  .route("/feedback")
  .get(authenticateJWT, FeedbackController.index)
  .post(authenticateJWT, FeedbackController.store);

apiRoutes
  .route("/notifications")
  .get(authenticateJWT, NotificationController.index)
  .delete(authenticateJWT, NotificationController.read);

apiRoutes.delete(
  "/notification/destroy/:id",
  authenticateJWT,
  NotificationController.destroyOne
);

apiRoutes.delete(
  "/notifications/destroy",
  authenticateJWT,
  NotificationController.destroy
);

apiRoutes
  .route("/upload_single_file")
  .post(storeOne, FileUploadController.storeSingle);

apiRoutes
  .route("/upload_multi_file")
  .post(storeMulti, FileUploadController.storeMulti);

apiRoutes.use("/profile", authenticateJWT, profileRoutes);

apiRoutes.post("/report", storeReport, ReportController.mobileStore);

export { apiRoutes };
