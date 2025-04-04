import UserService from "../../../services/UserService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import User from "../../../models/User.js";
import Event from "../../../models/event/Event.js";
import meetingModel from "../../../models/meeting/meetingModel.js";
import companyModel from "../../../models/company/companyModel.js";
import Role from "../../../models/Role.js";
import EventCommentAnswerLike from "../../../models/event/EventCommentAnswerLike.js";
import EventCommentAnswer from "../../../models/event/EventCommentAnswer.js";
import EventCommentLikes from "../../../models/event/EventCommentLikes.js";
import EventComment from "../../../models/event/EventComment.js";
import EventFavorites from "../../../models/event/EventFavorites.js";
import EventLike from "../../../models/event/EventLike.js";
import EventRating from "../../../models/event/EventRating.js";
import EventParticipants from "../../../models/event/EventParticipants.js";
import EventParticipantsSpot from "../../../models/event/EventParticipantsSpot.js";
import EventView from "../../../models/event/EventView.js";
import EventImpressionImages from "../../../models/event/EventImpressionImages.js";
import companyCommentAnswerLike from "../../../models/company/companyCommentAnswerLike.js";
import companyCommentAnswer from "../../../models/company/companyCommentAnswer.js";
import companyCommentLike from "../../../models/company/companyCommentLike.js";
import companyComment from "../../../models/company/companyComment.js";
import companyFavorit from "../../../models/company/companyFavorit.js";
import companyLikes from "../../../models/company/companyLikes.js";
import companyRating from "../../../models/company/companyRating.js";
import companyView from "../../../models/company/companyView.js";
import companyImpressionImages from "../../../models/company/companyImpressionImages.js";
import companyHotDeals from "../../../models/company/companyHotDeals.js";
import companyService from "../../../models/company/companyService.js";
import meetingCommentAnswerLike from "../../../models/meeting/meetingCommentAnswerLike.js";
import meetingCommentAnswer from "../../../models/meeting/meetingCommentAnswer.js";
import meetingCommentLikes from "../../../models/meeting/meetingCommentLikes.js";
import meetingComment from "../../../models/meeting/meetingComment.js";
import meetingFavorit from "../../../models/meeting/meetingFavorit.js";
import meetingLikes from "../../../models/meeting/meetingLikes.js";
import meetingRating from "../../../models/meeting/meetingRating.js";
import meetingParticipant from "../../../models/meeting/meetingParticipant.js";
import meetingParticipantSpot from "../../../models/meeting/meetingParticipantSpot.js";
import meetingView from "../../../models/meeting/meetingView.js";
import meetingImpressionImage from "../../../models/meeting/meetingImpressionImage.js";
import meetingImages from "../../../models/meeting/meetingImages.js";
import servicesRegistrations from "../../../models/services/servicesRegistrations.js";
import companyHotDealRegistration from "../../../models/company/companyHotDealRegistration.js";
import companyParticipants from "../../../models/company/companyParticipants.js";
import moment from "moment-timezone"

class UserController {
  constructor() {
    this.UserService = new UserService();
  }

  index = async (req, res) => {
    let view = "";
    let usersInfo = {};

    if (req.user.roles.name == "MODERATOR") {
      const getUsers = async (roles, params = {}) => {
        let limit = params.limit ? +params.limit : 10;
        let skip = params && +params.page ? +params.page * limit - limit : 0;
        let r = await Role.find({ name: roles }, { _id: 1 }).lean();
        const findObj = {
          roles: r,
        };
        if (params.name) {
          findObj.name = params.name;
        }
        if (params.surname) {
          findObj.surname = params.surname;
        }
        if (params.phone_number) {
          findObj.phone_number = params.phone_number;
        }
        if (params.date_from && params.date_to) {
          findObj.createdAt = {
            $gte: new Date(params.date_from).toISOString(),
            $lte: new Date(params.date_to).toISOString(),
          };
        } else if (params.date_from) {
          findObj.createdAt = {
            $gte: new Date(params.date_from).toISOString(),
          };
        } else if (params.date_to) {
          findObj.createdAt = {
            $lte: new Date(params.date_to).toISOString(),
          };
        }
        let users = User.find(findObj).sort({ createdAt: "desc" });
        let usersCount = await User.countDocuments({ roles: r });
        users = await users.populate("roles").limit(limit).skip(skip).lean();

        return { users, usersCount };
      };

      usersInfo.users = await getUsers(["USER", "USER"], req.query);

      view = "profile/moderator/users";
      res.render(view, {
        layout: "profile",
        title: "Profile",
        user: req.user,
        users: usersInfo.users.users,
        usersCount: usersInfo.usersCount,
        q: req.query,
      });
    } else if (req.user.roles.name == "ADMIN") {
      let roles = ["USER", "USER"];
      if (req.query.role) {
        roles = [req.query.role];
      }
      const [users, organizers, visitors, moderators] = await Promise.all([
        this.UserService.getUsersByRole(roles, req.query),
        this.UserService.getUsersByRole(["USER"], req.query),
        this.UserService.getUsersByRole(["USER"], req.query),
        this.UserService.getUsersByRole(["MODERATOR"], req.query),
      ]);
      usersInfo.users = users.users;
      usersInfo.usersCount = users.usersCount;
      usersInfo.organizers = organizers.users;
      usersInfo.visitors = visitors.users;
      usersInfo.moderators = moderators.users;
      view = "profile/admin/users";
      res.render(view, {
        layout: "profile",
        title: "Profile",
        user: req.user,
        users: usersInfo,
        usersCount: usersInfo.usersCount,
        q: req.query,
      });
    }
  };

  single = async (req, res) => {
    // let singleUser1 = await this.UserService.getById(req.params.id);
    let singleUser = await User.findById(req.params.id)
      .populate("event_categories")
      .populate("roles")
      .populate({
        path: "event_visits",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate({
        path: "event_likes",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate({
        path: "event_favorites",
        populate: [
          {
            path: "images",
          },
        ],
      })
      .populate("event_impression_image")
      .populate("event_comment")
      .lean();
    const events = await Event.find({ owner: req.params.id })
      .populate("images")
      .populate("category")
      .populate({ path: "owner", select: "-password" })
      .lean();
    const meetings = await meetingModel
      .find({ owner: req.params.id })
      .populate("images")
      .populate({ path: "userId", select: "-password" })
      .lean();

    const company = await companyModel
      .find({ owner: req.params.id })
      .populate("images")
      .populate("category")
      .populate("phoneNumbers")
      .populate({
        path: "services",
        populate: {
          path: "serviceRegister",
          select: "serviceId date status userId text time",
        },
      })
      .lean();
    let view = "profile/users-profile/moderator";
    let partCount = 0;
    for (let z = 0; z < company.length; z++) {
      for (let x = 0; x < company[z].services.length; x++) {
        partCount = company[z].services[x].serviceRegister.length + partCount;

        // for (let e = 0; e < company[z].services[x].serviceRegister.length; e++) {
        //   partCount++

        // }
      }
      company[z].participantsCount = partCount;
    }

    // for (let i = 0; i < company.services.length; i++) {

    // }

    if (singleUser.roles.name == "USER") {
      view = "profile/users-profile/organizer";
    }
    // else if(singleUser.roles.name == 'USER'){
    //     view = 'profile/users-profile/visitor'
    // }

    if (req.query.type && req.query.type == "json") {
      return res.json({
        dataEvent: events,
        dataMeet: meetings,
        dataComp: company,
      });
    }

    res.render(view, {
      layout: "profile",
      title: "Profile Visitor",
      user: req.user,
      singleUser,
      event_categories: singleUser.event_categories,
      events,
      meetings,
      company,
    });
  };

  block = async (req, res) => {
    let user = await this.UserService.blockOrUnblock(req.params.id);

    let msg = "Ваш аккаунт заблокирован администратором";
    if (user.block == 1) {
      msg = "Ваш аккаунт разблокирован администратором";
    }

    notifEvent.emit(
      "send",
      user._id.toString(),
      JSON.stringify({
        type: "message",
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        message: msg,
        notif_type: "",
      })
    );
    return res.redirect("back");
  };

  destroy = async (req, res) => {
    const user1 = { id: req.params.id };
    const eventsDb = await Event.find({ owner: user1.id });
    // const companiesDb = await companyModel.findOne({ owner: user1.id });
    const meetingsDb = await meetingModel.find({ user: user1.id });

    setTimeout(async () => {
      const companiesDb = await companyModel.find({ owner: user1.id });
      const CompanyParticipantsDb = await companyParticipants.find({
        user: user1.id,
      });

      for (let z = 0; z < CompanyParticipantsDb.length; z++) {
        await companyModel.findByIdAndUpdate(
          CompanyParticipantsDb[z].companyId,
          { $pull: { participants: CompanyParticipantsDb[z]._id } }
        );
      }
      await companyParticipants.deleteMany({ user: user1.id });
      for await (const company of companiesDb) {
        await companyModel.findByIdAndUpdate(company._id, {
          $pull: { participants: user1.id },
        });
      }

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

      for (let i = 0; i < EventIpressionImageDb.length; i++) {
        await Event.findByIdAndUpdate(EventIpressionImageDb[i].eventId, {
          $pull: { impression_images: EventIpressionImageDb[i]._id },
        });
      }
      await EventImpressionImages.deleteMany({ user: user1.id });

      for (let i = 0; i < EventViewsDb.length; i++) {
        await Event.findByIdAndUpdate(EventViewsDb[i].eventId, {
          $pull: { views: EventViewsDb[i]._id },
        });
      }
      await EventView.deleteMany({ user: user1.id });

      for (let i = 0; i < EventParticipantsSpotDb.length; i++) {
        await Event.findByIdAndUpdate(EventParticipantsSpotDb[i].eventId, {
          $pull: { participantsSpot: EventParticipantsSpotDb[i]._id },
        });
      }
      await EventParticipantsSpot.deleteMany({ user: user1.id });

      for (let i = 0; i < EventParticipantsDb.length; i++) {
        await Event.findByIdAndUpdate(EventParticipantsDb[i].eventId, {
          $pull: { participants: EventParticipantsDb[i]._id },
        });
      }
      await EventParticipants.deleteMany({ user: user1.id });

      for (let i = 0; i < EventRatingDb.length; i++) {
        await Event.findByIdAndUpdate(EventRatingDb[i].eventId, {
          $pull: { ratings: EventRatingDb[i]._id },
        });
      }
      await EventRating.deleteMany({ user: user1.id });

      for (let i = 0; i < EventLikeDb.length; i++) {
        await Event.findByIdAndUpdate(EventLikeDb[i].eventId, {
          $pull: { likes: EventLikeDb[i]._id },
        });
      }
      await EventLike.deleteMany({ user: user1.id });

      for (let i = 0; i < EventFavoriteDb.length; i++) {
        await Event.findByIdAndUpdate(EventFavoriteDb[i].eventId, {
          $pull: { favorites: EventFavoriteDb[i]._id },
        });
      }
      await EventFavorites.deleteMany({ user: user1.id });

      for (let z = 0; z < EventAnswerLikeDb.length; z++) {
        await EventCommentAnswer.findByIdAndUpdate(
          EventAnswerLikeDb[z].answerId,
          {
            $pull: { likes: EventAnswerLikeDb[z]._id },
          }
        );
      }
      await EventCommentAnswerLike.deleteMany({ user: user1.id });

      for (let z = 0; z < EventAnswerDb.length; z++) {
        await EventComment.findByIdAndUpdate(EventAnswerDb[z].answerId, {
          $pull: { answer: EventAnswerDb[z]._id },
        });
      }
      await EventCommentAnswer.deleteMany({ user: user1.id });

      for (let z = 0; z < EventCommentLike.length; z++) {
        await EventComment.findByIdAndUpdate(EventCommentLike[z].commentId, {
          $pull: { likes: EventCommentLike[z]._id },
        });
      }
      await EventCommentLikes.deleteMany({ user: user1.id });

      for (let z = 0; z < EventMyComment.length; z++) {
        await Event.findByIdAndUpdate(EventMyComment[z].event, {
          $pull: { comments: EventMyComment[z]._id },
        });
      }
      await EventComment.deleteMany({ user: user1.id });

      if (eventsDb.length) {
        for (let i = 0; i < eventsDb.length; i++) {
          const event = await Event.findById(eventsDb[i]._id);

          if (!event) {
            throw new Error("Event not found");
          }

          const comments = await EventComment.find({
            event: eventsDb[i]._id,
          });

          for (const comment of comments) {
            await EventCommentLikes.deleteMany({ commentId: comment._id });

            const answers = await EventCommentAnswer.find({
              commentId: comment._id,
            });

            for (const answer of answers) {
              await EventCommentAnswerLike.deleteMany({ answerId: answer._id });
            }

            await EventCommentAnswer.deleteMany({ commentId: comment._id });
          }

          await EventComment.deleteMany({ event: eventsDb[i]._id });
          await EventCommentLikes.deleteMany({ eventId: eventsDb[i]._id });
          await EventFavorites.deleteMany({ eventId: eventsDb[i]._id });
          await EventView.deleteMany({ eventId: eventsDb[i]._id });
          await EventRating.deleteMany({ event: eventsDb[i]._id });
          await EventImpressionImages.deleteMany({ event: eventsDb[i]._id });
          await EventParticipantsSpot.deleteMany({ eventId: eventsDb[i]._id });
          await EventParticipants.deleteMany({ eventId: eventsDb[i]._id });
          await event.remove();
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
      const dealRegisters = await companyHotDealRegistration.find({
        user: user1.id,
      });

      for (let i = 0; i < dealRegisters.length; i++) {
        const hotDeal = await companyHotDeals.find({
          registration: dealRegisters[i],
        });
        await hotDeal.remove();
      }
      await companyHotDealRegistration.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyAnswerLikeDb.length; i++) {
        await companyCommentAnswer.findByIdAndUpdate(
          CompanyAnswerLikeDb[i].answerId,
          {
            $pull: { likes: CompanyAnswerLikeDb[i]._id },
          }
        );
      }
      await companyCommentAnswerLike.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyAnswerDb.length; i++) {
        await companyComment.findByIdAndUpdate(CompanyAnswerDb[i].commentId, {
          $pull: { answer: CompanyAnswerDb[i]._id },
        });
      }
      await companyCommentAnswer.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyCommentLike.length; i++) {
        await companyComment.findByIdAndUpdate(
          CompanyCommentLike[i].commentId,
          {
            $pull: { likes: CompanyCommentLike[i]._id },
          }
        );
      }
      await companyCommentLike.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyMyComment.length; i++) {
        await companyModel.findByIdAndUpdate(CompanyMyComment[i].companyId, {
          $pull: { comments: CompanyMyComment[i]._id },
        });
      }
      await companyComment.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyFavoriteDb.length; i++) {
        await companyModel.findByIdAndUpdate(CompanyFavoriteDb[i].companyId, {
          $pull: { favorites: CompanyFavoriteDb[i]._id },
        });
      }
      await companyFavorit.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyLikeDb.length; i++) {
        await companyModel.findByIdAndUpdate(CompanyLikeDb[i].companyId, {
          $pull: { likes: CompanyLikeDb[i]._id },
        });
      }
      await companyLikes.deleteMany({ user: user1.id });

      for (let i = 0; i < CompanyRatingDb.length; i++) {
        await companyModel.findByIdAndUpdate(CompanyRatingDb[i].companyId, {
          $pull: { ratings: CompanyRatingDb[i]._id },
        });
      }
      await companyRating.deleteMany({ user: user1.id });

      for (let z = 0; z < CompanyViewsDb.length; z++) {
        await companyModel.findByIdAndUpdate(CompanyViewsDb[z].companyId, {
          $pull: { view: CompanyViewsDb[z]._id },
        });
      }
      await companyView.deleteMany({ user: user1.id });

      for (let z = 0; z < CompanyIpressionImageDb.length; z++) {
        await companyModel.findByIdAndUpdate(
          CompanyIpressionImageDb[z].companyId,
          {
            $pull: { impression_images: CompanyIpressionImageDb[z]._id },
          }
        );
      }
      await companyImpressionImages.deleteMany({ user: user1.id });

      for (let z = 0; z < registerDb.length; z++) {
        await companyService.findByIdAndUpdate(registerDb[z].serviceId, {
          $pull: { serviceRegister: registerDb[z]._id },
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

        for (const comment of comments) {
          await companyCommentLike.deleteMany({ commentId: comment._id });

          const answers = await companyCommentAnswer.find({
            commentId: comment._id,
          });

          for (const answer of answers) {
            await companyCommentAnswerLike.deleteMany({ answerId: answer._id });
          }

          await companyCommentAnswer.deleteMany({ commentId: comment._id });
        }

        await companyComment.deleteMany({ companyId: companiesDb._id });
        await companyImage.deleteMany({ companyId: companiesDb._id });
        await companyLikes.deleteMany({ companyId: companiesDb._id });
        await companyFavorit.deleteMany({ companyId: companiesDb._id });
        await companyView.deleteMany({ companyId: companiesDb._id });
        await companyRating.deleteMany({ companyId: companiesDb._id });
        await companyPhones.deleteMany({ companyId: companiesDb._id });
        await companyService.deleteMany({ companyId: companiesDb._id });
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

      const MeetingIpressionImageDb = await meetingImpressionImage.find({
        user: user1.id,
      });

      for (let i = 0; i < MeetingIpressionImageDb.length; i++) {
        await meetingModel.findByIdAndUpdate(
          MeetingIpressionImageDb[i].meeting,
          {
            $pull: { impression_images: MeetingIpressionImageDb[i]._id },
          }
        );
      }
      await meetingImpressionImage.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingViewsDb.length; i++) {
        await meetingModel.findByIdAndUpdate(MeetingViewsDb[i].meetingId, {
          $pull: { views: MeetingViewsDb[i]._id },
        });
      }
      await meetingView.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingParticipantsSpotDb.length; i++) {
        await meetingModel.findByIdAndUpdate(
          MeetingParticipantsSpotDb[i].meetingId,
          {
            $pull: { participantsSpot: MeetingParticipantsSpotDb[i]._id },
          }
        );
      }
      await meetingParticipantSpot.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingParticipantsDb.length; i++) {
        await meetingModel.findByIdAndUpdate(
          MeetingParticipantsDb[i].meetingId,
          {
            $pull: { participants: MeetingParticipantsDb[i]._id },
          }
        );
      }
      await meetingParticipant.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingRatingDb.length; i++) {
        await meetingModel.findByIdAndUpdate(MeetingRatingDb[i].meetingId, {
          $pull: { ratings: MeetingRatingDb[i]._id },
        });
      }
      await meetingRating.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingLikeDb.length; i++) {
        await meetingModel.findByIdAndUpdate(MeetingLikeDb[i].meetingId, {
          $pull: { likes: MeetingLikeDb[i]._id },
        });
      }
      await meetingLikes.deleteMany({ user: user1.id });

      for (let i = 0; i < MeetingFavoriteDb.length; i++) {
        await meetingModel.findByIdAndUpdate(MeetingFavoriteDb[i].meetingId, {
          $pull: { favorites: MeetingFavoriteDb[i]._id },
        });
      }
      await meetingFavorit.deleteMany({ user: user1.id });

      for (let z = 0; z < MeetingAnswerLikeDb.length; z++) {
        await meetingCommentAnswer.findByIdAndUpdate(
          MeetingAnswerLikeDb[z].answerId,
          {
            $pull: { likes: MeetingAnswerLikeDb[z]._id },
          }
        );
      }
      await meetingCommentAnswerLike.deleteMany({ user: user1.id });

      for (let z = 0; z < MeetingAnswerDb.length; z++) {
        await meetingComment.findByIdAndUpdate(MeetingAnswerDb[z].commentId, {
          $pull: { answer: MeetingAnswerDb[z]._id },
        });
      }
      await meetingCommentAnswer.deleteMany({ user: user1.id });

      for (let z = 0; z < MeetingCommentLike.length; z++) {
        await meetingComment.findByIdAndUpdate(
          MeetingCommentLike[z].commentId,
          {
            $pull: { likes: MeetingCommentLike[z]._id },
          }
        );
      }
      await meetingCommentLikes.deleteMany({ user: user1.id });

      for (let z = 0; z < MeetingMyComment.length; z++) {
        await meetingModel.findByIdAndUpdate(MeetingMyComment[z].meetingId, {
          $pull: { comments: MeetingMyComment[z]._id },
        });
      }
      await meetingComment.deleteMany({ user: user1.id });
      //user datas meeting
      if (meetingsDb.length) {
        for (let i = 0; i < meetingsDb.length; i++) {
          const meeting = await meetingModel.findById(meetingsDb[i]._id);

          if (!meeting) {
            throw new Error("Meeting not found");
          }

          const comments = await meetingComment.find({
            meetingId: meetingsDb[i]._id,
          });

          for (const comment of comments) {
            await meetingCommentLikes.deleteMany({ commentId: comment._id });

            const answers = await meetingCommentAnswer.find({
              commentId: comment._id,
            });

            for (const answer of answers) {
              await meetingCommentAnswerLike.deleteMany({
                answerId: answer._id,
              });
            }

            await meetingCommentAnswer.deleteMany({ commentId: comment._id });
          }

          await meetingComment.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingImages.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingLikes.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingFavorit.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingParticipantSpot.deleteMany({
            meetingId: meetingsDb[i]._id,
          });
          await meetingView.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingRating.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingParticipant.deleteMany({ meetingId: meetingsDb[i]._id });
          await meetingImpressionImage.deleteMany({
            meetingId: meetingsDb[i]._id,
          });
          await meetingVerify.deleteMany({ user: user1.id });
          await meeting.remove();
          console.log("Meetings and all related data deleted successfully");
        }
      }
      ///////////////////////////////////////////////////////////////////////////////
      //meeting deleteMany
    }, 1000);
    let user = await this.UserService.destroy(req.params.id);
    return res.redirect("back");
  };

  edit = async (req, res) => {
    const { name, surname, phone_number, email } = req.body;
    let id = req.params.id;
    await this.UserService.update(id, { name, surname, phone_number, email });
    return res.redirect("back");
  };
}

export default new UserController();
