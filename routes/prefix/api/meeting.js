import { Router } from "express";
import meetingController from "../../../controllers/api/meeting/meetingController.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";
import authenticateJWT from "../../../middlewares/authJWT.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";
import {
  createPassport,
  meeting,
} from "../../../middlewares/validate/api/meeting.js";

const meetingRouter = Router();

meetingRouter.post(
  "/notif/opportunity",
  newAuthJWT,
  meetingController.opportunity
);

meetingRouter.post(
  "/verify",
  newAuthJWT,
  createPassport,
  meetingController.verify
);

// meetingRouter.post("/admin/verify",meetingController.adminVerify)

// meetingRouter.post("/single/:id",meetingController.single)

meetingRouter.post("/add", newAuthJWT, meeting, meetingController.addMeeting);

meetingRouter.post(
  "/add/participant",
  newAuthJWT,
  meetingController.addParticipant
);

meetingRouter.put("/edit/:id", isEmpParamObjId, meetingController.editMeeting);

meetingRouter.get("/near/:id", isEmpParamObjId, meetingController.near);

meetingRouter.get(
  "/single/:id",
  newAuthJWT,
  isEmpParamObjId,
  meetingController.single
);

meetingRouter.post("/add/favorite", newAuthJWT, meetingController.addFavorit);

meetingRouter.post("/add/comment", newAuthJWT, meetingController.addComment);

meetingRouter.post("/add/rating", newAuthJWT, meetingController.addRating);

meetingRouter.post("/comment/like", newAuthJWT, meetingController.commentLike);

meetingRouter.post("/like", newAuthJWT, meetingController.like);

// meetingRouter.get("/page",meetingController.index)

meetingRouter.get("/myMeetings", meetingController.myMeeting); //kilometer success

meetingRouter.get("/allMeetings", meetingController.allMeeting); //kilometer success

meetingRouter.get("/meetings", meetingController.meetings); //kilometer success

meetingRouter.post(
  "/add/participantSpot",
  newAuthJWT,
  meetingController.participantSpot
);

meetingRouter.post(
  "/comment/answer",
  newAuthJWT,
  meetingController.commentAnswer
);

meetingRouter.post(
  "/comment/answer/like",
  newAuthJWT,
  meetingController.commentAnswerLike
);

meetingRouter.delete("/delete/comment", meetingController.deleteComment);

meetingRouter.delete(
  "/delete/comment/answer",
  meetingController.deleteCommentAnswer
);

meetingRouter.get(
  "/my/participant",
  newAuthJWT,
  meetingController.myParticipant
);

meetingRouter.post(
  "/impression-images/store",
  newAuthJWT,
  meetingController.impressionImagesStore
);

meetingRouter.get(
  "/my/meeting/impressions",
  newAuthJWT,
  meetingController.myMeetingImpressions
);

meetingRouter.get("/my/impressions",newAuthJWT, meetingController.myImpressions);
export default meetingRouter;
