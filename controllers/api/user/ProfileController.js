import UserService from "../../../services/UserService.js";
import NodeCache from "node-cache";
import GenerateRand from "../../../services/GenerateRand.js";
import SmsProstoService from "../../../services/SmsProstoService.js";
import NotificationListService from "../../../services/NotificationListService.js";
import EventService from "../../../services/EventService.js";
import AccessTokenService from "../../../services/AccessTokenService.js";
import User from "../../../models/User.js";
import jwt from "jsonwebtoken";
import meetingModel from "../../../models/meeting/meetingModel.js";
import Notification from "../../../models/Notification.js";
import companyModel from "../../../models/company/companyModel.js";
import EventCategory from "../../../models/event/EventCategory.js";
import { set } from "mongoose";
import Event from "../../../models/event/Event.js";
import EventComment from "../../../models/event/EventComment.js";
// import EventCommentLikes from "../../../models/event/EventCommentLikes.js";
import EventCommentAnswer from "../../../models/event/EventCommentAnswer.js";
import EventCommentAnswerLike from "../../../models/event/EventCommentAnswerLike.js";
import EventFavorites from "../../../models/event/EventFavorites.js";
import EventViews from "../../../models/event/EventView.js";
import EventRating from "../../../models/event/EventRating.js";
import EventImpressionImages from "../../../models/event/EventImpressionImages.js";
import EventParticipantsSpot from "../../../models/event/EventParticipantsSpot.js";
import EventParticipants from "../../../models/event/EventParticipants.js";
import companyComment from "../../../models/company/companyComment.js";
import companyCommentLike from "../../../models/company/companyCommentLike.js";
import companyCommentAnswer from "../../../models/company/companyCommentAnswer.js";
import companyCommentAnswerLike from "../../../models/company/companyCommentAnswerLike.js";
import companyImage from "../../../models/company/companyImage.js";
import companyLikes from "../../../models/company/companyLikes.js";
import companyFavorit from "../../../models/company/companyFavorit.js";
import companyView from "../../../models/company/companyView.js";
import companyRating from "../../../models/company/companyRating.js";
import companyPhones from "../../../models/company/companyPhones.js";
import CompanyServiceModel from "../../../models/company/companyService.js";
import companyImpressionImages from "../../../models/company/companyImpressionImages.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import meetingComment from "../../../models/meeting/meetingComment.js";
import meetingCommentLikes from "../../../models/meeting/meetingCommentLikes.js";
import meetingCommentAnswer from "../../../models/meeting/meetingCommentAnswer.js";
import MeetingAnswerLikes from "../../../models/meeting/meetingCommentAnswerLike.js";
import meetingImages from "../../../models/meeting/meetingImages.js";
import meetingLikes from "../../../models/meeting/meetingLikes.js";
import meetingFavorit from "../../../models/meeting/meetingFavorit.js";
import meetingParticipantSpot from "../../../models/meeting/meetingParticipantSpot.js";
import meetingView from "../../../models/meeting/meetingView.js";
import meetingRating from "../../../models/meeting/meetingRating.js";
import meetingParticipant from "../../../models/meeting/meetingParticipant.js";
import MeetingImpressionImage from "../../../models/meeting/meetingImpressionImage.js";
import meetingVerify from "../../../models/meeting/meetingVerify.js";
import EventCommentLikes from "../../../models/event/EventCommentLikes.js";
import EventLike from "../../../models/event/EventLike.js";
import EventView from "../../../models/event/EventView.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyService from "../../../models/company/companyService.js";
import companyHotDealRegistrations from "../../../models/company/companyHotDealRegistration.js";
import meetingCommentAnswerLike from "../../../models/meeting/meetingCommentAnswerLike.js";
import companyParticipants from "../../../models/company/companyParticipants.js";
import Report from "../../../models/Report.js";
// import EventCommentLikes from "../../../models/event/EventCommentLikes.js";
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

class ProfileController {
  constructor() {
    this.UserService = new UserService();
    this.SmsProstoService = new SmsProstoService();
    this.GenerateRand = new GenerateRand();
    this.NotificationListService = new NotificationListService();
    this.EventService = new EventService();
    this.AccessTokenService = new AccessTokenService();
  }

  index = async (req, res) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const user = jwt.decode(token);

    let u = await User.findById(user.id)
      .populate("roles")
      .populate({ path: "company", select: "_id services companyName" });
    if (u) {
      u.unread_notifications = await this.UserService.getCountNotif(user.id);
      u, "u   user profil";

      return res.status(200).send({ success: true, data: u });
    } else {
      return res
        .status(403)
        .send({ success: false, message: "User not found" });
    }
    const user1 = await this.UserService.findAndLean(user.id);
  };

  update = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token1 = authHeader.split(" ")[1];
    const user1 = jwt.decode(token1);

    const user = await this.UserService.update(user1.id, req.body);
    const token = await this.AccessTokenService.jwtSignByPhone(
      user.phone_number
    );
    return res.json({
      status: "success",
      message: "Updated successfully",
      user,
      token,
    });
  };

  updateAvatar = async (req, res) => {
    let user = await this.UserService.updateAvatar(
      req.user.id,
      req.files.avatar
    );
    const token = await this.AccessTokenService.jwtSignByPhone(
      user.phone_number
    );
    return res.json({ status: "success", data: user, token });
  };

  destroy = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token1 = authHeader.split(" ")[1];
    const user1 = jwt.decode(token1);
    const eventsDb = await Event.find({ owner: user1.id });
    const companiesDb = await companyModel.findOne({ owner: user1.id });
    const hotDeals = await companyHotDeals.find({ companyId: companiesDb._id });
    for await (const hotDeal of hotDeals) {
      await Notification.deleteMany({ dealId: hotDeal._id });
    }
    const meetingsDb = await meetingModel.find({ user: user1.id });
    await Notification.deleteMany({ user: user1.id });
    for await (const element of eventsDb) {
      await Notification.deleteMany({ eventId: element._id });
    }
    await Notification.deleteMany({ companyId: companiesDb._id });
    for await (const element of meetingsDb) {
      await Notification.deleteMany({ meetingId: element._id });
    }

    for await (const element of eventsDb) {
      await Notification.deleteMany({ eventId: element._id });
    }

    await Notification.deleteMany({ companyId: companiesDb._id });
    setTimeout(async () => {
      await Report.deleteMany({});
      const CompanyParticipantsDb = await companyParticipants.find({
        user: user1.id,
      });

      for await (const participant of CompanyParticipantsDb) {
        await companyModel.findByIdAndUpdate(participant.companyId, {
          $pull: { participants: participant._id },
        });
      }

      await companyParticipants.deleteMany({ user: user1.id });
      const EventAnswerLikeDb = await EventCommentAnswerLike.find({
        user: user1.id,
      });
      const EventAnswerDb = await EventCommentAnswer.find({ user: user1.id });
      const EventCommentLike = await EventCommentLikes.find({ user: user1.id });
      const EventMyComment = await EventComment.find({ user: user1.id });
      const EventFavoriteDb = await EventFavorites.find({ user: user1.id });
      const EventLikeDb = await EventLike.find({ user: user1.id });
      const EventRatingDb = await EventRating.find({ user: user1.id });
      const EventParticipantsDb = await EventParticipants.find({
        user: user1.id,
      });
      const EventParticipantsSpotDb = await EventParticipantsSpot.find({
        user: user1.id,
      });
      const EventViewsDb = await EventView.find({ user: user1.id });
      const EventIpressionImageDb = await EventImpressionImages.find({
        user: user1.id,
      });

      for await (const impressionImage of EventIpressionImageDb) {
        await Event.findByIdAndUpdate(impressionImage.event, {
          $pull: { impression_images: impressionImage._id },
        });
      }

      await EventImpressionImages.deleteMany({ user: user1.id });

      for await (const view of EventViewsDb) {
        await Event.findByIdAndUpdate(view.eventId, {
          $pull: { views: view._id },
        });
      }

      await EventView.deleteMany({ user: user1.id });

      for await (const participantSpot of EventParticipantsSpotDb) {
        await Event.findByIdAndUpdate(participantSpot.eventId, {
          $pull: { participantsSpot: participantSpot._id },
        });
      }

      await EventParticipantsSpot.deleteMany({ user: user1.id });

      for await (const participant of EventParticipantsDb) {
        await Event.findByIdAndUpdate(participant.eventId, {
          $pull: { participants: participant._id },
        });
      }

      await EventParticipants.deleteMany({ user: user1.id });

      for await (const rating of EventRatingDb) {
        await Event.findByIdAndUpdate(rating.event, {
          $pull: { ratings: rating._id },
        });
      }

      await EventRating.deleteMany({ user: user1.id });

      for await (const like of EventLikeDb) {
        await Event.findByIdAndUpdate(like.eventId, {
          $pull: { likes: like._id },
        });
      }

      await EventLike.deleteMany({ user: user1.id });

      for await (const favorite of EventFavoriteDb) {
        await Event.findByIdAndUpdate(favorite.eventId, {
          $pull: { favorites: favorite._id },
        });
      }

      await EventFavorites.deleteMany({ user: user1.id });

      for await (const answerLike of EventAnswerLikeDb) {
        await EventCommentAnswer.findByIdAndUpdate(answerLike.answerId, {
          $pull: { likes: answerLike._id },
        });
      }

      await EventCommentAnswerLike.deleteMany({ user: user1.id });

      for await (const answer of EventAnswerDb) {
        await EventComment.findByIdAndUpdate(answer.answerId, {
          $pull: { answer: answer._id },
        });
      }

      await EventCommentAnswer.deleteMany({ user: user1.id });

      for await (const commentLike of EventCommentLike) {
        await EventComment.findByIdAndUpdate(commentLike.commentId, {
          $pull: { likes: commentLike._id },
        });
      }

      await EventCommentLikes.deleteMany({ user: user1.id });

      for await (const myComment of EventMyComment) {
        await Event.findByIdAndUpdate(myComment.event, {
          $pull: { comments: myComment._id },
        });
      }

      await EventComment.deleteMany({ user: user1.id });

      if (eventsDb.length) {
        for await (const event of eventsDb) {
          const foundEvent = await Event.findById(event._id);

          if (!foundEvent) {
            throw new Error("Event not found");
          }

          const comments = await EventComment.find({ event: event._id });

          for await (const comment of comments) {
            await EventCommentLikes.deleteMany({ commentId: comment._id });

            const answers = await EventCommentAnswer.find({
              commentId: comment._id,
            });

            for await (const answer of answers) {
              await EventCommentAnswerLike.deleteMany({ answerId: answer._id });
            }

            await EventCommentAnswer.deleteMany({ commentId: comment._id });
          }

          await EventComment.deleteMany({ event: event._id });
          await EventCommentLikes.deleteMany({ eventId: event._id });
          await EventFavorites.deleteMany({ eventId: event._id });
          await EventViews.deleteMany({ eventId: event._id });
          await EventRating.deleteMany({ event: event._id });
          await EventImpressionImages.deleteMany({ event: event._id });
          await EventParticipantsSpot.deleteMany({ eventId: event._id });
          await EventParticipants.deleteMany({ eventId: event._id });
          await foundEvent.remove();
          console.log("Event and all related data deleted successfully");
        }

        await EventCategory.deleteMany({ owner: user1.id });
      }

      //user datas other company
      const CompanyAnswerLikeDb = await companyCommentAnswerLike.find({
        user: user1.id,
      });
      const CompanyAnswerDb = await companyCommentAnswer.find({
        user: user1.id,
      });
      const CompanyCommentLike = await companyCommentLike.find({
        user: user1.id,
      });
      const CompanyMyComment = await companyComment.find({ user: user1.id });
      const CompanyFavoriteDb = await companyFavorit.find({ user: user1.id });
      const CompanyLikeDb = await companyLikes.find({ user: user1.id });
      const CompanyRatingDb = await companyRating.find({ user: user1.id });
      const CompanyViewsDb = await companyView.find({ user: user1.id });
      const CompanyIpressionImageDb = await companyImpressionImages.find({
        user: user1.id,
      });
      const registerDb = await servicesRegistrations.find({ user: user1.id });
      const dealRegisters = await companyHotDealRegistrations.find({
        user: user1.id,
      });

      for await (const dealRegister of dealRegisters) {
        const hotDeal = await companyHotDeals.find({
          registration: dealRegister,
        });
        await hotDeal.remove();
      }

      await companyHotDeals.deleteMany({ user: user1.id });
      await companyHotDealRegistrations.deleteMany({ user: user1.id });

      for await (const answerLike of CompanyAnswerLikeDb) {
        await companyCommentAnswer.findByIdAndUpdate(answerLike.answerId, {
          $pull: { likes: answerLike._id },
        });
      }

      await companyCommentAnswerLike.deleteMany({ user: user1.id });

      for await (const answer of CompanyAnswerDb) {
        await companyComment.findByIdAndUpdate(answer.commentId, {
          $pull: { answer: answer._id },
        });
      }

      await companyCommentAnswer.deleteMany({ user: user1.id });

      for await (const commentLike of CompanyCommentLike) {
        await companyComment.findByIdAndUpdate(commentLike.commentId, {
          $pull: { likes: commentLike._id },
        });
      }

      await companyCommentLike.deleteMany({ user: user1.id });

      for await (const myComment of CompanyMyComment) {
        await companyModel.findByIdAndUpdate(myComment.companyId, {
          $pull: { comments: myComment._id },
        });
      }

      await companyComment.deleteMany({ user: user1.id });

      for await (const favorite of CompanyFavoriteDb) {
        await companyModel.findByIdAndUpdate(favorite.companyId, {
          $pull: { favorites: favorite._id },
        });
      }

      await companyFavorit.deleteMany({ user: user1.id });

      for await (const like of CompanyLikeDb) {
        await companyModel.findByIdAndUpdate(like.companyId, {
          $pull: { likes: like._id },
        });
      }

      await companyLikes.deleteMany({ user: user1.id });

      for await (const rating of CompanyRatingDb) {
        await companyModel.findByIdAndUpdate(rating.companyId, {
          $pull: { ratings: rating._id },
        });
      }

      await companyRating.deleteMany({ user: user1.id });

      for await (const view of CompanyViewsDb) {
        await companyModel.findByIdAndUpdate(view.companyId, {
          $pull: { view: view._id },
        });
      }

      await companyView.deleteMany({ user: user1.id });

      for await (const impressionImage of CompanyIpressionImageDb) {
        await companyModel.findByIdAndUpdate(impressionImage.companyId, {
          $pull: { impression_images: impressionImage._id },
        });
      }

      await companyImpressionImages.deleteMany({ user: user1.id });

      for await (const register of registerDb) {
        await companyService.findByIdAndUpdate(register.serviceId, {
          $pull: { serviceRegister: register._id },
        });
      }

      await servicesRegistrations.deleteMany({ user: user1.id });

      //user datas other company

      if (companiesDb) {
        const company = await companyModel.findById(companiesDb._id);

        if (!company) {
          throw new Error("Event not found");
        }

        const comments = await companyComment.find({
          companyId: companiesDb._id,
        });

        for await (const comment of comments) {
          await companyCommentLike.deleteMany({ commentId: comment._id });

          const answers = await companyCommentAnswer.find({
            commentId: comment._id,
          });

          for await (const answer of answers) {
            await companyCommentAnswerLike.deleteMany({ answerId: answer._id });
          }

          await companyCommentAnswer.deleteMany({ commentId: comment._id });
        }

        const servicesDbByNotif = await CompanyServiceModel.find({
          companyId: companiesDb._id,
        });

        for await (const element of servicesDbByNotif) {
          await Notification.deleteMany({ serviceId: element._id });
        }

        await companyComment.deleteMany({ companyId: companiesDb._id });
        await companyImage.deleteMany({ companyId: companiesDb._id });
        await companyLikes.deleteMany({ companyId: companiesDb._id });
        await companyFavorit.deleteMany({ companyId: companiesDb._id });
        await companyView.deleteMany({ companyId: companiesDb._id });
        await companyRating.deleteMany({ companyId: companiesDb._id });
        await companyPhones.deleteMany({ companyId: companiesDb._id });
        await CompanyServiceModel.deleteMany({ companyId: companiesDb._id });
        await companyImpressionImages.deleteMany({
          companyId: companiesDb._id,
        });
        await companyHotDeals.deleteMany({ companyId: companiesDb._id });
        await company.remove();
        console.log("Company and all related data deleted successfully");
      }
      //company deleteMany

      //meeting deleteMany
      ///////////////////////////////////////////////////////////////////////////////

      //user datas meeting
      const MeetingAnswerLikeDb = await meetingCommentAnswerLike.find({
        user: user1.id,
      });
      const MeetingAnswerDb = await meetingCommentAnswer.find({
        user: user1.id,
      });
      const MeetingCommentLike = await meetingCommentLikes.find({
        user: user1.id,
      });
      const MeetingMyComment = await meetingComment.find({ user: user1.id });
      const MeetingFavoriteDb = await meetingFavorit.find({ user: user1.id });
      const MeetingLikeDb = await meetingLikes.find({ user: user1.id });
      const MeetingRatingDb = await meetingRating.find({ user: user1.id });
      const MeetingParticipantsDb = await meetingParticipant.find({
        user: user1.id,
      });
      const MeetingParticipantsSpotDb = await meetingParticipantSpot.find({
        user: user1.id,
      });
      const MeetingViewsDb = await meetingView.find({ user: user1.id });

      const MeetingIpressionImageDb = await MeetingImpressionImage.find({
        user: user1.id,
      });

      for await (const impressionImage of MeetingIpressionImageDb) {
        await meetingModel.findByIdAndUpdate(impressionImage.meeting, {
          $pull: { impression_images: impressionImage._id },
        });
      }

      await MeetingImpressionImage.deleteMany({ user: user1.id });

      for await (const view of MeetingViewsDb) {
        await meetingModel.findByIdAndUpdate(view.meetingId, {
          $pull: { views: view._id },
        });
      }

      await meetingView.deleteMany({ user: user1.id });

      for await (const participantSpot of MeetingParticipantsSpotDb) {
        await meetingModel.findByIdAndUpdate(participantSpot.meetingId, {
          $pull: { participantsSpot: participantSpot._id },
        });
      }

      await meetingParticipantSpot.deleteMany({ user: user1.id });

      for await (const participant of MeetingParticipantsDb) {
        await meetingModel.findByIdAndUpdate(participant.meetingId, {
          $pull: { participants: participant._id },
        });
      }

      await meetingParticipant.deleteMany({ user: user1.id });

      for await (const rating of MeetingRatingDb) {
        await meetingModel.findByIdAndUpdate(rating.meetingId, {
          $pull: { ratings: rating._id },
        });
      }

      await meetingRating.deleteMany({ user: user1.id });

      for await (const like of MeetingLikeDb) {
        await meetingModel.findByIdAndUpdate(like.meetingId, {
          $pull: { likes: like._id },
        });
      }

      await meetingLikes.deleteMany({ user: user1.id });

      for await (const favorite of MeetingFavoriteDb) {
        await meetingModel.findByIdAndUpdate(favorite.meetingId, {
          $pull: { favorites: favorite._id },
        });
      }

      await meetingFavorit.deleteMany({ user: user1.id });

      for await (const answerLike of MeetingAnswerLikeDb) {
        await meetingCommentAnswer.findByIdAndUpdate(answerLike.answerId, {
          $pull: { likes: answerLike._id },
        });
      }

      await meetingCommentAnswerLike.deleteMany({ user: user1.id });

      for await (const answer of MeetingAnswerDb) {
        await meetingComment.findByIdAndUpdate(answer.commentId, {
          $pull: { answer: answer._id },
        });
      }

      await meetingCommentAnswer.deleteMany({ user: user1.id });

      for await (const commentLike of MeetingCommentLike) {
        await meetingComment.findByIdAndUpdate(commentLike.commentId, {
          $pull: { likes: commentLike._id },
        });
      }

      await meetingCommentLikes.deleteMany({ user: user1.id });

      for await (const comment of MeetingMyComment) {
        await meetingModel.findByIdAndUpdate(comment.meetingId, {
          $pull: { comments: comment._id },
        });
      }

      await meetingComment.deleteMany({ user: user1.id });
      //user datas meeting
      if (meetingsDb.length) {
        for await (const meetingDb of meetingsDb) {
          const meeting = await meetingModel.findById(meetingDb._id);

          if (!meeting) {
            throw new Error("Meeting not found");
          }

          const comments = await meetingComment.find({
            meetingId: meetingDb._id,
          });

          for await (const comment of comments) {
            await meetingCommentLikes.deleteMany({ commentId: comment._id });

            const answers = await meetingCommentAnswer.find({
              commentId: comment._id,
            });

            for await (const answer of answers) {
              await MeetingAnswerLikes.deleteMany({ answerId: answer._id });
            }

            await meetingCommentAnswer.deleteMany({ commentId: comment._id });
          }

          await meetingComment.deleteMany({ meetingId: meetingDb._id });
          await meetingImages.deleteMany({ meetingId: meetingDb._id });
          await meetingLikes.deleteMany({ meetingId: meetingDb._id });
          await meetingFavorit.deleteMany({ meetingId: meetingDb._id });
          await meetingParticipantSpot.deleteMany({ meetingId: meetingDb._id });
          await meetingView.deleteMany({ meetingId: meetingDb._id });
          await meetingRating.deleteMany({ meetingId: meetingDb._id });
          await meetingParticipant.deleteMany({ meetingId: meetingDb._id });
          await MeetingImpressionImage.deleteMany({ meetingId: meetingDb._id });
          await meetingVerify.deleteMany({ user: user1.id });

          await meeting.remove();
          console.log("Meetings and all related data deleted successfully");
        }

        // for (let i = 0; i < meetingsDb.length; i++) {
        //   const meeting = await meetingModel.findById(meetingsDb[i]._id);

        //   if (!meeting) {
        //     throw new Error("Meeting not found");
        //   }

        //   const comments = await meetingComment.find({
        //     meetingId: meetingsDb[i]._id,
        //   });

        //   for (const comment of comments) {
        //     await meetingCommentLikes.deleteMany({ commentId: comment._id });

        //     const answers = await meetingCommentAnswer.find({
        //       commentId: comment._id,
        //     });

        //     for (const answer of answers) {
        //       await MeetingAnswerLikes.deleteMany({ answerId: answer._id });
        //     }

        //     await meetingCommentAnswer.deleteMany({ commentId: comment._id });
        //   }

        //   await meetingComment.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingImages.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingLikes.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingFavorit.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingParticipantSpot.deleteMany({
        //     meetingId: meetingsDb[i]._id,
        //   });
        //   await meetingView.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingRating.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await meetingParticipant.deleteMany({ meetingId: meetingsDb[i]._id });
        //   await MeetingImpressionImage.deleteMany({
        //     meetingId: meetingsDb[i]._id,
        //   });
        //   await meetingVerify.deleteMany({ user: user1.id });
        //   await meeting.remove();
        //   console.log("Meetings and all related data deleted successfully");
        // }
      }
      ///////////////////////////////////////////////////////////////////////////////
      //meeting deleteMany
    }, 1000);
    await this.UserService.destroy(user1.id);

    return res.json({ status: "success", message: "User succesfuly deleted" });
  };

  updatePhoneNumber = async (req, res) => {
    const { phone_number } = req.body;
    const exUser = await this.UserService.findByPhoneNumber(phone_number);
    if (exUser) {
      res.status(400);
      return res.json({
        satatus: false,
        message: "Номер телефона уже используется",
      });
    }
    const rand = await this.GenerateRand.pin();
    const sms = await this.SmsProstoService.sendMessage(phone_number, rand);
    if (sms != "0") {
      res.status(400);
      return res.json({
        satatus: false,
        message: "Неверный формат номер телефона",
      });
    }
    myCache.set(
      `update_phone_number_${req.user.id}`,
      `${rand}_${phone_number}`,
      54000
    );
    return res.json({
      satatus: "success",
      message: "Проверьте свой телефон, через 15 минут код исчезнет",
    });
  };

  updatePhoneNumberConfirm = async (req, res) => {
    const { phone_number_code } = req.body;

    const ph_num_c = myCache.get(`update_phone_number_${req.user.id}`);
    if (!ph_num_c) {
      return res.json({
        status: "fail",
        message: "15-минутный лимит исчерпан, попробуйте еще раз",
      });
    }
    const data = ph_num_c.split("_");

    if (data[0] != phone_number_code) {
      return res.json({ status: "fail", message: "Неверный код" });
    }

    const nUser = await this.UserService.update(req.user.id, {
      phone_number: data[1],
    });
    const token = await this.AccessTokenService.jwtSignByPhone(
      nUser.phone_number
    );

    return res.json({
      status: "success",
      message: "Номер телефона успешно обновлен",
      token,
    });
  };

  storeFavoriteCategory = async (req, res) => {
    const category = req.body.event_category_id;
    const data = await this.UserService.pushInCollection(
      req.user.id,
      category,
      "event_favorite_categories"
    );
    return res.json({ message: "success" });
  };

  destroyFavoriteCategory = async (req, res) => {
    const category = req.body.event_category_id;
    const data = await this.UserService.destroyFromCollection(
      req.user.id,
      category,
      "event_favorite_categories"
    );
    return res.json({ message: "success" });
  };

  getFavoriteCategory = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader !== "null") {
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const data = await this.UserService.getSpecCol(
        user.id,
        "event_favorite_categories"
      );
      if (data) {
        return res
          .status(200)
          .json({ message: "success", data: data.event_favorite_categories });
      } else {
        return res.status(403).json({ message: "success", data: [] });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  };

  getNotification = async (req, res) => {
    // const data = await this.NotificationListService.get();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader !== "null") {
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const data = await this.NotificationListService.getByRole(user.role);

      const userNotificationList = await this.UserService.getSpecCol(
        user.id,
        "list_of_notifications"
      );
      if (userNotificationList) {
        for (let d = 0; d < data.length; d++) {
          for (
            let c = 0;
            c < userNotificationList.list_of_notifications.length;
            c++
          ) {
            if (
              data[d]._id ==
              userNotificationList.list_of_notifications[c]._id.toString()
            ) {
              data[d].confirmed = true;
            }
          }
          if (!userNotificationList.list_of_notifications.length) {
            data[d].confirmed = false;
          }
        }

        return res.status(200).send({ success: true, data });
      } else {
        return res.status(403).send({ success: true, data: [] });
      }
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  };

  storeNotification = async (req, res) => {
    const notification = req.body.notifications_list_id;
    const data = await this.UserService.pushInCollection(
      req.user.id,
      notification,
      "list_of_notifications"
    );
    return res.json({ message: "success" });
  };

  destroyNotification = async (req, res) => {
    const notification = req.body.notifications_list_id;
    const data = await this.UserService.destroyFromCollection(
      req.user.id,
      notification,
      "list_of_notifications"
    );
    return res.json({ message: "success" });
  };

  userEdit = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const { name, path } = req.body;
      const result = await User.findById(user.id);
      if (path && name && path !== "null" && name !== "null") {
        const names = name.split(" ");
        result.name = names[0];
        result.surname = names[1];
        result.avatar = path;
        await result.save();
        return res.status(200).send({ message: "success" });
      } else {
        if (name && name !== "null") {
          const names = name.split(" ");
          result.name = names[0];
          result.surname = names[1];
          await result.save();
          return res.status(200).send({ message: "success" });
        } else if (path && path !== "null") {
          result.avatar = path;
          await result.save();
          return res.status(200).send({ message: "success" });
        } else {
          return res.status(400).send({ message: "wrong data" });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "wrong data" });
    }
  };
}

export default new ProfileController();
