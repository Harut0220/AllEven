import { Router } from "express";
import EventController from "../../../controllers/api/event/EventController.js";
import EventCategoryController from "../../../controllers/api/event/EventCategoryController.js";
import FavoriteController from "../../../controllers/api/event/FavoriteController.js";
import LikeController from "../../../controllers/api/event/LikeController.js";
import {
  eventCategory,
  event,
  likeDislike,
  rating,
  comment,
  commentLike,
  ImpressionImage,
} from "../../../middlewares/validate/api/event.js";
import RatingController from "../../../controllers/api/event/RatingController.js";
import CommentController from "../../../controllers/api/event/CommentController.js";
import { empObj, isEmpParamObjId } from "../../../middlewares/isEmpty.js";
import authenticateJWT from "../../../middlewares/authJWT.js";
import authenticateJWTWithoutCheck from "../../../middlewares/authJWTwithoutCheck.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";
import InPlaceController from "../../../controllers/api/event/InPlaceController.js";
const eventRoutes = Router();
eventRoutes.post("/notif/opportunity", newAuthJWT, EventController.opportunity);
eventRoutes.get(
  "/",
  newAuthJWT,
  authenticateJWTWithoutCheck,
  EventController.index
);

eventRoutes.get("/single/:id", isEmpParamObjId, EventController.single);

eventRoutes.post("/store", newAuthJWT, event, EventController.store);
eventRoutes.post(
  "/add/participant",
  newAuthJWT,
  EventController.addParticipant
);
eventRoutes.post(
  "/add/participant/spot",
  newAuthJWT,
  EventController.addParticipantSpot
);

eventRoutes.put("/edit/:id", isEmpParamObjId, empObj, EventController.edit);

eventRoutes.get("/near/:id", isEmpParamObjId, EventController.nearEvent);

eventRoutes.post("/favorite", newAuthJWT, FavoriteController.favorite);//notif+

eventRoutes.post("/like", newAuthJWT, likeDislike, LikeController.like);//notif+

eventRoutes.post(
  "/add/comment",
  newAuthJWT,
  comment,
  CommentController.addComment
);//notif+

eventRoutes.delete("/comment/delete", CommentController.deleteComment);

eventRoutes.post(
  "/comment/like",
  newAuthJWT,
  commentLike,
  CommentController.commentLike
);//notif+
eventRoutes.post(
  "/comment/answer",
  newAuthJWT,
  CommentController.commentAnswer
);//notif+

eventRoutes.delete(
  "/comment/answer/delete",
  newAuthJWT,
  CommentController.deleteCommentAnswer
);
eventRoutes.post(
  "/comment/answer/like",
  newAuthJWT,
  CommentController.commentAnswerLike
);//notif+
eventRoutes.post("/add/rating", newAuthJWT, rating, RatingController.addRating);//notif+

eventRoutes.get("/events", EventController.upcoming); //kilometr motikic heru

eventRoutes.get("/allEvent", EventController.allEvent); //kilometr motikic heru

eventRoutes.get("/allFilter", EventController.allFilter); //shatic qich

eventRoutes.get("/radius", EventController.radius); //kilometr motikic heru

eventRoutes.get("/my/events", EventController.myEvents);

eventRoutes.get("/my/participant", newAuthJWT, EventController.myParticipant); //kilometr motikic heru

eventRoutes.post("/socketTest", EventController.socket);

// eventRoutes.get("/test/upcoming",EventController.testUpcoming)

/////////////////////////////////////////// //authenticateJWT,
// eventRoutes.put('/edit/:id',empObj,authenticateJWT,EventController.edit);
// //authenticateJWTWithoutCheck,
eventRoutes.get(
  "/categories",
  authenticateJWTWithoutCheck,
  EventCategoryController.index
);
//authenticateJWT,eventCategory,
eventRoutes.post(
  "/category/store",
  eventCategory,
  EventCategoryController.store
);
// //authenticateJWT,
// eventRoutes.get("/like", authenticateJWT, LikeController.index);
eventRoutes.post(
  "/impression-images/store",
  newAuthJWT,
  ImpressionImage,
  EventController.ImpressionImage
);//notif+

eventRoutes.get(
  "/my/event/impressions",
  newAuthJWT,
  EventController.myEventImpressions
);

eventRoutes.get("/my/impressions", newAuthJWT, EventController.myImpressions);
// //authenticateJWT,
// eventRoutes.post('/favorite',authenticateJWT,likeDislike,FavoriteController.store);
// //authenticateJWT,
// eventRoutes.get('/favorite',FavoriteController.index);
// //authenticateJWT,
// eventRoutes.post('/visit',likeDislike,VisitController.store);
// //authenticateJWT,
// eventRoutes.get('/visit',VisitController.index);
// //authenticateJWT,
// eventRoutes.post('/view',authenticateJWT,likeDislike,ViewController.store);
// //authenticateJWT,
eventRoutes.get('/in_place',authenticateJWT,InPlaceController.index);//spotPartisipant
// //authenticateJWT,likeDislike,
eventRoutes.post('/in_place',authenticateJWT,InPlaceController.store);//spot participant
// //authenticateJWT,
// eventRoutes.post('/rating/store',authenticateJWT,rating,RatingController.store);
// //authenticateJWT,
// eventRoutes.post('/comment/store',comment,CommentController.store);

// eventRoutes.get('/comment/get',CommentController.index);
// //authenticateJWT,
// eventRoutes.post('/comment/like/store',authenticateJWT,commentLike,CommentController.like);
// //authenticateJWT,

// //userImpression,
// eventRoutes.get('/user/impressions',userImpression,EventController.userImpressions)
// //authenticateJWT,
// eventRoutes.get('/impressions',authenticateJWT, EventController.eventImpressions)

// eventRoutes.get("/my/events",EventController.myEventList)

// eventRoutes.get('/single/:id',EventController.single);
//authenticateJWT

export { eventRoutes };
