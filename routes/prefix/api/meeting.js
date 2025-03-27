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

meetingRouter.post("/add", newAuthJWT, meeting, meetingController.addMeeting);//notif+

meetingRouter.post(
  "/add/participant",
  newAuthJWT,
  meetingController.addParticipant
);//notif+

meetingRouter.put("/edit/:id", isEmpParamObjId, meetingController.editMeeting);

meetingRouter.get("/near/:id", isEmpParamObjId, meetingController.near);

meetingRouter.get(
  "/single/:id",
  newAuthJWT,
  isEmpParamObjId,
  meetingController.single
);

meetingRouter.post("/add/favorite", newAuthJWT, meetingController.addFavorit);//notif+

meetingRouter.post("/add/comment", newAuthJWT, meetingController.addComment);//notif+

meetingRouter.post("/add/rating", newAuthJWT, meetingController.addRating);//notif+

meetingRouter.post("/comment/like", newAuthJWT, meetingController.commentLike);//notif+

meetingRouter.post("/like", newAuthJWT, meetingController.like);//notif+

// meetingRouter.get("/page",meetingController.index)

meetingRouter.get("/myMeetings", meetingController.myMeeting); //kilometer success

meetingRouter.get("/allMeetings", meetingController.allMeeting); //kilometer success

meetingRouter.get("/meetings", meetingController.meetings); //kilometer success

meetingRouter.post(
  "/add/participantSpot",
  newAuthJWT,
  meetingController.participantSpot
);//notif+

meetingRouter.post(
  "/comment/answer",
  newAuthJWT,
  meetingController.commentAnswer
);//notif+

meetingRouter.post(
  "/comment/answer/like",
  newAuthJWT,
  meetingController.commentAnswerLike
);//notif+

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
);//notif+

meetingRouter.get(
  "/my/meeting/impressions",
  newAuthJWT,
  meetingController.myMeetingImpressions
);

meetingRouter.get("/my/impressions",newAuthJWT, meetingController.myImpressions);

meetingRouter.post("/in_place",authenticateJWT,meetingController.in_place)
export default meetingRouter;
