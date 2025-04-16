import mongoose from "mongoose";
import meetingImages from "../models/meeting/meetingImages.js";
import meetingModel from "../models/meeting/meetingModel.js";
import meetingVerify from "../models/meeting/meetingVerify.js";
import MeetingVerify from "../models/meeting/meetingVerify.js";
import MeetingParticipants from "../models/meeting/meetingParticipant.js";
import User from "../models/User.js";
import meetingFavorit from "../models/meeting/meetingFavorit.js";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";
import notifEvent from "../events/NotificationEvent.js";
import meetingCommentLikes from "../models/meeting/meetingCommentLikes.js";
import meetingLikes from "../models/meeting/meetingLikes.js";
import MeetingViews from "../models/meeting/meetingView.js";
import moment from "moment-timezone";
import meetingParticipant from "../models/meeting/meetingParticipant.js";
import meetingCommentAnswer from "../models/meeting/meetingCommentAnswer.js";
import meetingRating from "../models/meeting/meetingRating.js";
import MeetingAnswerLikes from "../models/meeting/meetingCommentAnswerLike.js";
import meetingParticipantSpot from "../models/meeting/meetingParticipantSpot.js";
import meetingComment from "../models/meeting/meetingComment.js";
import meetingView from "../models/meeting/meetingView.js";
import meetingImpressionImage from "../models/meeting/meetingImpressionImage.js";
import ImpressionsMeeting from "../models/ImpressionsMeeting.js";
import AnswerLikes from "../models/meeting/meetingCommentAnswerLike.js";
import Report from "../models/Report.js";
import calculateAverageRating from "../helper/ratingCalculate.js";
import calculateDistance from "../helper/distanceCalculate.js";
import { __dirname } from "../index.js";
import deleteImage from "../helper/imageDelete.js";
import { separateUpcomingAndPassedMeetings } from "../helper/upcomingAndPassed.js";

const meetingService = {
  myParticipant: async (user) => {
    try {
      const meetings = await meetingParticipant
        .find({ user })
        .populate({
          path: "meetingId",
          populate: [{ path: "images" }],
        })
        .exec();
      const resArray = [];
      for (let i = 0; i < meetings.length; i++) {
        resArray.push(meetings[i].meetingId);
      }


      const upcomPass = separateUpcomingAndPassedMeetings(resArray);
      const data = {};
      data.upcoming = upcomPass.upcoming;
      data.passed = upcomPass.passed;

      for (let i = 0; i < data.upcoming.length; i++) {
        const element = data.upcoming[i];

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(element.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: element._id,
          user,
        });
        if (findParticipant) {
          element.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: element._id,
          user,
        });
        if (findParticipantSpot) {
          element.joinStatus = 3;
        }

        const isRating = await meetingRating.findOne({
          meetingId: element._id,
          user,
        });
        element.isRating = isRating ? true : false;
        const findLike = await meetingLikes.findOne({
          meetingId: element._id,
          user,
        });
        element.isLike = findLike ? true : false;
        const findFavorite = await meetingFavorit.findOne({
          meetingId: element._id,
          user,
        });
        element.isFavorite = findFavorite ? true : false;
      }
      return { message: "success", data };
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  destroyVerify: async (des_events) => {
    if (Array.isArray(des_events)) {
      for (let i = 0; i < des_events.length; i++) {
        const meeting = await meetingVerify.findById(des_events[i]);
        if (!meeting) {
          throw new Error("Meeting not found");
        }
        await meeting.remove();
        console.log("Meetings and all related data deleted successfully");
      }
    }
    if (typeof des_events === "string") {
      const meeting = await meetingVerify.findById(des_events);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      await meeting.remove();
      console.log("Meetings and all related data deleted successfully");
    }
    return { message: "success" };
  },
  destroy: async (des_events) => {
    if (Array.isArray(des_events)) {
      for await (const meetingId of des_events) {
        const meeting = await meetingModel.findById(meetingId);
        console.log(meetingId,"meetingId");
        
        await Notification.deleteMany({ meetingId });
        await Report.deleteMany({ meeting: meetingId });
      
        if (!meeting) {
          throw new Error("Meeting not found");
        }
      
        const comments = await meetingComment.find({ meetingId });
      
        for await (const comment of comments) {
          await meetingCommentLikes.deleteMany({ commentId: comment._id });
      
          const answers = await meetingCommentAnswer.find({ commentId: comment._id });
      
          for await (const answer of answers) {
            await MeetingAnswerLikes.deleteMany({ answerId: answer._id });
          }
      
          await meetingCommentAnswer.deleteMany({ commentId: comment._id });
        }
      
        await ImpressionsMeeting.deleteMany({ meeting: meetingId });
        await meetingComment.deleteMany({ meetingId });
        await meetingImages.deleteMany({ meetingId });
        await meetingLikes.deleteMany({ meetingId });
        await meetingFavorit.deleteMany({ meetingId });
        await meetingParticipantSpot.deleteMany({ meetingId });
        await meetingView.deleteMany({ meetingId });
        await meetingRating.deleteMany({ meetingId });
        await meetingParticipant.deleteMany({ meetingId });
        await meetingImpressionImage.deleteMany({ meetingId });
      
        await User.findByIdAndUpdate(meeting.user.toString(), {
          $pull: { meetings: meeting._id, meeting_favorites: meeting._id },
        });
      
        await meeting.remove();
        console.log("Meetings and all related data deleted successfully");
      }
      
      // for (let i = 0; i < des_events.length; i++) {
      //   const meeting = await meetingModel.findById(des_events[i]);
      //   await Notification.deleteMany({ meetingId: des_events[i] });
      //   await Report.deleteMany({ meeting: des_events[i] });
      //   if (!meeting) {
      //     throw new Error("Meeting not found");
      //   }

      //   const comments = await meetingComment.find({
      //     meetingId: des_events[i],
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
      //   await ImpressionsMeeting.deleteMany({ meeting: des_events[i] });

      //   await meetingComment.deleteMany({ meetingId: des_events[i] });
      //   await meetingImages.deleteMany({ meetingId: des_events[i] });
      //   await meetingLikes.deleteMany({ meetingId: des_events[i] });
      //   await meetingFavorit.deleteMany({ meetingId: des_events[i] });
      //   await meetingParticipantSpot.deleteMany({ meetingId: des_events[i] });
      //   await meetingView.deleteMany({ meetingId: des_events[i] });
      //   await meetingRating.deleteMany({ meetingId: des_events[i] });
      //   await meetingParticipant.deleteMany({ meetingId: des_events[i] });
      //   await meetingImpressionImage.deleteMany({ meetingId: des_events[i] });

      //   await User.findByIdAndUpdate(meeting.user.toString(), {
      //     $pull: { meetings: meeting._id, meeting_favorites: meeting._id },
      //   });
      //   await meeting.remove();
      //   console.log("Meetings and all related data deleted successfully");
      // }
    }
    if (typeof des_events === "string") {
      const meeting = await meetingModel.findById(des_events);
      console.log(des_events,"des_events");
      
      await Notification.deleteMany({ meetingId: des_events });
      await Report.deleteMany({ meeting: des_events });
      if (!meeting) {
        throw new Error("Meeting not found");
      }

      const comments = await meetingComment.find({ meetingId: des_events });

      for (const comment of comments) {
        await meetingCommentLikes.deleteMany({ commentId: comment._id });

        const answers = await meetingCommentAnswer.find({
          commentId: comment._id,
        });

        for (const answer of answers) {
          await MeetingAnswerLikes.deleteMany({ answerId: answer._id });
        }

        await meetingCommentAnswer.deleteMany({ commentId: comment._id });
      }
      await ImpressionsMeeting.deleteMany({ meeting: des_events });

      await meetingComment.deleteMany({ meetingId: des_events });
      await meetingImages.deleteMany({ meetingId: des_events });
      await meetingLikes.deleteMany({ meetingId: des_events });
      await meetingFavorit.deleteMany({ meetingId: des_events });
      await meetingParticipantSpot.deleteMany({ meetingId: des_events });
      await meetingView.deleteMany({ meetingId: des_events });
      await meetingRating.deleteMany({ meetingId: des_events });
      await meetingParticipant.deleteMany({ meetingId: des_events });
      await meetingImpressionImage.deleteMany({ meetingId: des_events });
      await User.findByIdAndUpdate(meeting.user.toString(), {
        $pull: { meetings: meeting._id, meeting_favorites: meeting._id },
      });
      await meeting.remove();

      console.log("Meeting and all related data deleted successfully");
    }
    return { message: "success" };
  },
  meetingsTest: async (user) => {
    const meetings = await meetingModel
      .find({ user: { $ne: user } })
      .populate({ path: "user", select: "-password" })
      .populate("participants")
      .populate("images")
      .populate("participantSpot")
      .populate("view")
      .populate({
        path: "ratings",
        populate: { path: "user", select: "name surname avatar" },
      })
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "name surname avatar" },
          {
            path: "answer",
            populate: { path: "user", select: "name surname avatar" },
          },
        ],
      })
      .exec();
    for (let i = 0; i < meetings.length; i++) {
      const isRating = await meetingRating.findOne({
        meetingId: meetings[i]._id,
        user: user,
      });
      meetings[i].isRating = isRating ? true : false;
      const findLike = await meetingLikes.findOne({
        meetingId: meetings[i]._id,
        user: user,
      });
      meetings[i].isLike = findLike ? true : false;
      const findFavorite = await meetingFavorit.findOne({
        meetingId: meetings[i]._id,
        user: user,
      });
      meetings[i].isFavorite = findFavorite ? true : false;
    }

    const separatedEvents = separateUpcomingAndPassedMeetings(meetings);
    const filter = separatedEvents.passed.filter((event) => event.status === 1);
    return {
      message: "success",
      upcoming: separatedEvents.upcoming,
      passed: filter,
    };
  },
  meetings: async (authHeader, longitude, latitude) => {
    if (authHeader && longitude && latitude) {
      const token = authHeader.split(" ")[1];
      const userToken = jwt.decode(token);
      const user = userToken.id;
      const myLatitude = latitude;
      const myLongitude = longitude;

      const meetings = await meetingModel
        .find({ user: { $ne: user }, status: { $eq: 1 } })
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("images")
        .populate("participantSpot")
        .populate("view")
        .populate({
          path: "ratings",
          populate: { path: "user", select: "name surname avatar" },
        })
        .populate({
          path: "comments",
          populate: [
            { path: "user", select: "name surname avatar" },
            {
              path: "answer",
              populate: { path: "user", select: "name surname avatar" },
            },
          ],
        })
        .exec();


      const separatedEvents = separateUpcomingAndPassedMeetings(meetings);
      const filter = separatedEvents.passed.filter(
        (event) => event.status === 1
      );
      separatedEvents.upcoming.forEach(async (meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });
      separatedEvents.passed.forEach(async (meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
      for (let i = 0; i < separatedEvents.upcoming.length; i++) {
        const element = separatedEvents.upcoming[i];

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(element.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: element._id,
          user,
        });
        if (findParticipant) {
          element.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: element._id,
          user,
        });
        if (findParticipantSpot) {
          element.joinStatus = 3;
        }

        const isRating = await meetingRating.findOne({
          meetingId: element._id,
          user,
        });
        element.isRating = isRating ? true : false;
        const findLike = await meetingLikes.findOne({
          meetingId: element._id,
          user,
        });
        element.isLike = findLike ? true : false;
        const findFavorite = await meetingFavorit.findOne({
          meetingId: element._id,
          user,
        });
        element.isFavorite = findFavorite ? true : false;
      }

      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
      };
    } else if (!authHeader && longitude && latitude) {
      const myLatitude = latitude;
      const myLongitude = longitude;

      const meetings = await meetingModel
        .find({ status: 1 })
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("images")
        .populate("participantSpot")
        .populate("view")
        .populate({
          path: "ratings",
          populate: { path: "user", select: "name surname avatar" },
        })
        .populate({
          path: "comments",
          populate: [
            { path: "user", select: "name surname avatar" },
            {
              path: "answer",
              populate: { path: "user", select: "name surname avatar" },
            },
          ],
        });



      const separatedEvents = separateUpcomingAndPassedMeetings(meetings);

      const filter = separatedEvents.passed.filter(
        (event) => event.status === 1
      );
      separatedEvents.upcoming.forEach((meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
      for (let i = 0; i < separatedEvents.upcoming.length; i++) {
        const element = separatedEvents.upcoming[i];

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(element.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }
      }
      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
      };
    } else if (!authHeader && !longitude && !latitude) {
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      const meetings = await meetingModel
        .find({ status: { $eq: 1 } })
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("images")
        .populate("participantSpot")
        .populate("view")
        .populate({
          path: "ratings",
          populate: { path: "user", select: "name surname avatar" },
        })
        .populate({
          path: "comments",
          populate: [
            { path: "user", select: "name surname avatar" },
            {
              path: "answer",
              populate: { path: "user", select: "name surname avatar" },
            },
          ],
        })
        .exec();


      const separatedEvents = separateUpcomingAndPassedMeetings(meetings);
      const filter = separatedEvents.passed.filter(
        (event) => event.status === 1
      );
      separatedEvents.upcoming.forEach((meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
      for (let i = 0; i < separatedEvents.upcoming.length; i++) {
        const element = separatedEvents.upcoming[i];

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(element.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }
      }
      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
      };
    } else if (authHeader && !longitude && !latitude) {
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      const meetings = await meetingModel
        .find({ user: { $ne: user.id }, status: { $eq: 1 } })
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("images")
        .populate("participantSpot")
        .populate("view")
        .populate({
          path: "ratings",
          populate: { path: "user", select: "name surname avatar" },
        })
        .populate({
          path: "comments",
          populate: [
            { path: "user", select: "name surname avatar" },
            {
              path: "answer",
              populate: { path: "user", select: "name surname avatar" },
            },
          ],
        })
        .exec();

 
      const separatedEvents = separateUpcomingAndPassedMeetings(meetings);
      const filter = separatedEvents.passed.filter(
        (event) => event.status === 1
      );
      separatedEvents.upcoming.forEach((meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);

      for (let i = 0; i < separatedEvents.upcoming.length; i++) {
        const element = separatedEvents.upcoming[i];

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(element.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: element._id,
          user: user.id,
        });
        if (findParticipant) {
          element.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: element._id,
          user: user.id,
        });

        if (findParticipantSpot) {
          element.joinStatus = 3;
        }
        const isRating = await meetingRating.findOne({
          meetingId: element._id,
          user: user.id,
        });
        element.isRating = isRating ? true : false;
        const findLike = await meetingLikes.findOne({
          meetingId: element._id,
          user: user.id,
        });
        element.isLike = findLike ? true : false;
        const findFavorite = await meetingFavorit.findOne({
          meetingId: element._id,
          user: user.id,
        });
        element.isFavorite = findFavorite ? true : false;
      }

      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
      };
    } else {
      return {
        message: "error",
        upcoming: [],
      };
    }
  },
  deleteCommentAnswer: async (answerId) => {
    const commentDb = await meetingComment.findByIdAndUpdate(answerId, {
      $pull: { answer: answerId },
    });
    const commentAnswerDb = await meetingCommentAnswer
      .findById(answerId)
      .populate("user");
    await commentAnswerDb.remove();
    const commentAnswerLikesDb = await AnswerLikes.find({
      answerId,
    });
    await commentAnswerLikesDb.remove();
    return { message: "Комментарий удален" };
  },
  commentAnswerLike: async (user, answerId, commentId) => {
    const commentAnswerLikesDb = await AnswerLikes.find({
      user: user,
      answerId,
      commentId,
    });
    if (!commentAnswerLikesDb.length) {
      const commentAnswerLikesDb = new AnswerLikes({
        user: user,
        answerId,
        date: moment.tz(process.env.TZ).format(),
      });
      const commentAnswerDb = await meetingCommentAnswer
        .findByIdAndUpdate(answerId, {
          $push: { likes: commentAnswerLikesDb._id },
        })
        .populate("user");
      await commentAnswerLikesDb.save();
      const commentDb = await meetingComment.findById(commentId);
      const updatedMeeting = await meetingModel
        .findById(commentDb.meetingId)
        .populate("user");
      if (commentAnswerDb.user._id.toString() !== user) {
        let evLink;

        if (commentAnswerDb.user._id.toString() === updatedMeeting.user._id.toString()) {
          evLink = `alleven://myMeeting/${updatedMeeting._id}`;
        } else {
          evLink = `alleven://singleMeeting/${updatedMeeting._id}`;
        }
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: commentAnswerDb.user._id.toString(),
          type: "message",
          navigate: true,
          message: `У вас новое сообщение.`,
          meetingId: updatedMeeting._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (commentAnswerDb.user.notifMeeting) {
          notifEvent.emit(
            "send",
            commentAnswerDb.user._id.toString(),
            JSON.stringify({
              type: "message",
              meetingId: updatedMeeting._id,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `У вас новое сообщение.`,
              link: evLink,
            })
          );
        }
      }

      return { message: "Лайк добавлен" };
    } else {
      const commentAnswerLikesDb = await AnswerLikes.findById(
        commentAnswerLikesDb[0]._id
      );
      await commentAnswerLikesDb.remove();
      const commentAnswerDb = await meetingCommentAnswer.findByIdAndUpdate(
        answerId,
        { $pull: { likes: commentAnswerLikesDb._id } }
      );
      return { message: "Лайк удаленно" };
    }
  },
  addRating: async (user, meetingId, rating) => {
    const ratingIf = await meetingRating.find({ user, meetingId });
    if (!ratingIf.length) {
      const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
      const meetingRatingDb = new meetingRating({
        user,
        meetingId,
        rating,
        date,
      });
      await meetingRatingDb.save();
      const meetingDb = await meetingModel.findByIdAndUpdate(
        meetingId,
        { $push: { ratings: meetingRatingDb._id } },
        { new: true }
      );
      const ratingDb = await meetingRating.find({ meetingId });

      const averageRating = calculateAverageRating(ratingDb);
      await meetingModel.findByIdAndUpdate(meetingId, {
        rating: averageRating,
      });

      const ifImpressions = await ImpressionsMeeting.findOne({
        meeting: meetingId,
        user,
      });
      const dateTime = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const userDb = await User.findById(user);
      const companyDb = await meetingModel
        .findById(meetingId)
        .populate("images")
        .populate("user")
        .exec();
      if (ifImpressions) {
        await ImpressionsMeeting.findByIdAndUpdate(ifImpressions._id, {
          $set: { date: dateTime, rating },
        });
      } else {
        const meetingImpression = new ImpressionsMeeting({
          rating,
          comments: [],
          images: [],
          name: userDb.name,
          surname: userDb.surname,
          avatar: userDb.avatar,
          meetingName: companyDb.name,
          meetingImage: companyDb.images[0].name,
          company: companyDb._id,
          user,
          date: dateTime,
        });
        await meetingImpression.save();
      }
      const updatedMeeting = await meetingModel
        .findById(meetingId)
        .select("ratings");
      const ratings = updatedMeeting.ratings;
      if (companyDb.user._id.toString() !== user) {
        const evLink = `alleven://myMeeting/${companyDb._id}`;
        const message = `${userDb.name} ${userDb.surname} поставил(a) новую оценку.`

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: companyDb.user._id.toString(),
          type: "message",
          navigate: true,
          message,
          meetingId: companyDb._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (companyDb.user.notifMeeting) {
          notifEvent.emit(
            "send",
            companyDb.user._id.toString(),
            JSON.stringify({
              type: "message",
              meetingId: companyDb._id,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message,
              link: evLink,
            })
          );
        }
      }

      return { message: "Рейтинг добавлен", ratings, averageRating };
    } else {
      return { message: "Рейтинг уже добавлен" };
    }
  },
  deleteComment: async (id) => {
    const commentDb = await meetingComment.findById(id);
    await commentDb.remove();
    const commentAnswerDb = await meetingCommentAnswer.find({ commentId: id });
    await commentAnswerDb.remove();
    const commentLikesDb = await meetingCommentLikes.find({ commentId: id });
    await commentLikesDb.remove();
    const commentAnswerLikesDb = await AnswerLikes.find({
      answerId: commentAnswerDb[0]._id,
    });
    await commentAnswerLikesDb.remove();
    const meetingDb = await meetingModel.findByIdAndUpdate(
      commentDb.meetingId,
      { $pull: { comments: commentDb._id } }
    );
    return { message: "Комментарий удален" };
  },
  commentAnswer: async (user, commentId, text) => {
    const userDb = await User.findById(user);
    const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss");
    const commentAnswerDb = new meetingCommentAnswer({
      user,
      commentId,
      text,
      date,
    });
    await commentAnswerDb.save();
    const answerDb = await meetingCommentAnswer
      .findById(commentAnswerDb._id)
      .populate("user");
    const commentDb = await meetingComment
      .findByIdAndUpdate(
        commentId,
        { $push: { answer: commentAnswerDb._id } },
        { new: true }
      )
      .populate("user");

    const updatedMeeting = await meetingModel
      .findById(commentDb.meetingId)
      .populate("user")
      .exec();
    if (user !== commentDb.user._id.toString()) {
      let evLink;

      if (commentDb.user._id.toString() === updatedMeeting.user._id.toString()) {
        evLink = `alleven://myMeeting/${updatedMeeting._id}`;
      } else {
        evLink = `alleven://singleMeeting/${updatedMeeting._id}`;
      }

      const message =`Вам ответили на комментарии ${userDb.name} ${userDb.surname} к встрече ${updatedMeeting.purpose}.`
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: commentDb.user._id.toString(),
        type: "message",
        navigate: true,
        message,
        meetingId: updatedMeeting._id,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (commentDb.user.notifMeeting) {
        notifEvent.emit(
          "send",
          commentDb.user._id.toString(),
          JSON.stringify({
            type: "message",
            meetingId: updatedMeeting._id,
            navigate: true,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message,
            link: evLink,
          })
        );
      }
    }

    return { message: "Комментарий добавлен", answer: answerDb };
  },
  participantSpot: async (user, meetingId) => {
    const userDb = await User.findById(user);
    const resIf = await meetingParticipant.find({ user, meetingId });
    const notif = await Notification.findOne({
      user: user,
      meetingId,
      type: "confirm_come",
    });

    if (notif) {
      notif.confirmed = true;
      await notif.save();
    }
    if (resIf.length) {
      const spotDb = new meetingParticipantSpot({ user, meetingId });
      await spotDb.save();
      const updatedMeeting = await meetingModel
        .findByIdAndUpdate(
          meetingId,
          { $push: { participantSpot: spotDb._id } },
          { new: true }
        )
        .populate("images")
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("comments")
        .populate("likes")
        .populate("participantSpot");

      const evLink = `alleven://myMeeting/${meetingId}`;
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: updatedMeeting.user._id.toString(),
        type: "Присоединение",
        navigate: true,
        message: `Пользователь ${userDb.name} пришел(а) на ваше встрече ${updatedMeeting.purpose}. `,
        meetingId,
        categoryIcon: updatedMeeting.images[0].path,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (updatedMeeting.user.notifMeeting) {
        notifEvent.emit(
          "send",
          updatedMeeting.user._id.toString(),
          JSON.stringify({
            type: "Присоединение",
            meetingId,
            navigate: true,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            categoryIcon: updatedMeeting.images[0].path,
            message: `Пользователь ${userDb.name} пришел(а) на ваше встрече ${updatedMeeting.purpose}. `,
            link: evLink,
          })
        );
      }

      return { success: true, message: "Вас добавлен в список на место" };
    } else {
      return { message: "Вас нет в списке участников" };
    }
  },
  single: async (id, user) => {
    const result = await meetingModel
      .findById(id)
      .populate({ path: "user", select: "-password" })
      .populate({
        path: "participants",
        populate: { path: "user", select: "name surname avatar phone_number" },
      })
      .populate("likes")
      .populate("images")
      .populate({
        path: "participantSpot",
        populate: { path: "user", select: "name surname avatar phone_number" },
      })
      .populate("view")
      .populate("favorites")
      .populate({
        path: "ratings",
        populate: { path: "user", select: "name surname avatar" },
      })
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "name surname avatar" },
          {
            path: "answer",
            populate: { path: "user", select: "name surname avatar" },
          },
        ],
      })
      .exec();

    const averageRating = calculateAverageRating(result.ratings);
    const resultChanged1 = await meetingModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: { ratingCalculated: averageRating },
        },
        { new: true }
      )
      .populate({ path: "user", select: "name surname avatar" })
      .populate({
        path: "participants",
        populate: { path: "user", select: "name surname avatar phone_number" },
      })
      .populate("likes")
      .populate("images")
      .populate({
        path: "participantSpot",
        populate: { path: "user", select: "name surname avatar phone_number" },
      })
      .populate("view")
      .populate("favorites")
      .populate({
        path: "impression_images",
        populate: { path: "user", select: "name surname avatar" },
      })
      .populate({
        path: "ratings",
        populate: { path: "user", select: "name surname avatar" },
      })
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "name surname avatar" },
          {
            path: "answer",
            populate: { path: "user", select: "name surname avatar" },
          },
        ],
      })
      .exec();
    const isRating = await meetingRating.findOne({
      meetingId: resultChanged1._id,
      user: user,
    });
    resultChanged1.isRating = isRating ? true : false;
    const findLike = await meetingLikes.findOne({
      meetingId: resultChanged1._id,
      user: user,
    });
    resultChanged1.isLike = findLike ? true : false;
    const findFavorite = await meetingFavorit.findOne({
      meetingId: resultChanged1._id,
      user: user,
    });
    resultChanged1.isFavorite = findFavorite ? true : false;

    for (let i = 0; i < resultChanged1.comments.length; i++) {
      const findCommentLike = await meetingCommentLikes.findOne({
        commentId: resultChanged1.comments[i]._id,
        user: user,
      });
      for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
        const findAnswerLike = await AnswerLikes.findOne({
          answerId: resultChanged1.comments[i].answer[z]._id,
          user: user,
        });
        if (findAnswerLike) {
          resultChanged1.comments[i].answer[z].isLike = true;
        }
      }

      if (findCommentLike) {
        resultChanged1.comments[i].isLike = true;
      }
    }

    return resultChanged1;
  },
  myMeeting: async (authHeader) => {
    try {
      if (authHeader) {
        const token = authHeader.split(" ")[1];

        const userToken = jwt.decode(token);
        const user = userToken.id;

        const resDb = await meetingModel
          .find({ user, status: { $ne: 2 } })
          .populate({ path: "user", select: "-password" })
          .populate("participants")
          .populate("likes")
          .populate("images")
          .populate("participantSpot")
          .populate("view")
          .populate("favorites")
          .populate({
            path: "ratings",
            populate: { path: "user", select: "name surname avatar" },
          })
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "name surname avatar" },
              {
                path: "answer",
                populate: { path: "user", select: "name surname avatar" },
              },
            ],
          })
          .exec();

        let pastLikes;
        let pastComment;
        let view;
        let favorites;
        let pastParticipants;
        let countAll = 0;
        for (let i = 0; i < resDb.length; i++) {
          pastLikes = resDb[i].likes.filter((like) => {
            const parsedGivenDate = moment(like.date);

            return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
          });

          pastComment = resDb[i].comments.filter((like) => {
            const parsedGivenDate = moment(like.date);

            return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
          });

          view = resDb[i].view.filter((like) => {
            const parsedGivenDate = moment(like.date);

            return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
          });

          favorites = resDb[i].favorites.filter((like) => {
            const parsedGivenDate = moment(like.date);

            return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
          });

          pastParticipants = resDb[i].participants.filter((like) => {
            const parsedGivenDate = moment(like.date);

            return parsedGivenDate.isAfter(resDb[i].changedStatusDate);
          });

          let count =
            pastLikes.length +
            pastComment.length +
            view.length +
            pastParticipants.length +
            favorites.length;
          countAll = countAll + count;
          if (favorites.length) {
            resDb[i].changes.favorites = true;
          }
          if (pastLikes.length) {
            resDb[i].changes.like = true;
          }
          if (pastComment.length) {
            resDb[i].changes.comment = true;
          }
          if (pastParticipants.length) {
            resDb[i].changes.participant = true;
          }
          if (view.length) {
            resDb[i].changes.view = true;
          }
          if (count) {
            resDb[i].changes.count = count;
          }
          await resDb[i].save();
        }



        const separatedEvents = separateUpcomingAndPassedMeetings(resDb);
        const filter = separatedEvents.passed.filter(
          (event) => event.status === 1
        );

        const dateChange = await meetingModel.find({ user });

        for (let x = 0; x < dateChange.length; x++) {
          dateChange[x].changes.comment = false;
          dateChange[x].changes.like = false;
          dateChange[x].changes.participant = false;
          dateChange[x].changes.view = false;
          dateChange[x].changes.favorites = false;
          dateChange[x].changes.count = 0;
          dateChange[x].changedStatusDate = moment.tz(process.env.TZ).format();
          await dateChange[x].save();
        }

        const myLatitude = 55.7558;
        const myLongitude = 37.6176;
        separatedEvents.upcoming.forEach((meeting) => {
          meeting.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            meeting.latitude,
            meeting.longitude
          );
        });
        filter.forEach(async(meeting) => {
          await meetingModel.findByIdAndUpdate(meeting._id, {
            $set: { situation: "passed" },
          });
          meeting.situation = "passed";
          meeting.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            meeting.latitude,
            meeting.longitude
          );
        });

        separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
        filter.sort((a, b) => a.kilometr - b.kilometr);

        return {
          message: "success",
          upcoming: separatedEvents.upcoming,
          passed: filter,
          count: countAll,
        };
      } else {
        const resDb = await meetingModel
          .find({ status: { $ne: 2 } })
          .populate({ path: "user", select: "-password" })
          .populate("participants")
          .populate("comments")
          .populate("likes")
          .populate("images")
          .populate("participantSpot");

        const separatedEvents = separateUpcomingAndPassedMeetings(resDb);

        const myLatitude = 55.7558;
        const myLongitude = 37.6176;
        separatedEvents.upcoming.forEach((meeting) => {
          meeting.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            meeting.latitude,
            meeting.longitude
          );
        });
        separatedEvents.passed.forEach(async(meeting) => {
          await meetingModel.findByIdAndUpdate(meeting._id, {
            $set: { situation: "passed" },
          });
          meeting.situation = "passed";
          meeting.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            meeting.latitude,
            meeting.longitude
          );
        });

        separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
        separatedEvents.passed.sort((a, b) => a.kilometr - b.kilometr);
        return {
          message: "success",
          upcoming: separatedEvents.upcoming,
          passed: separatedEvents.passed,
        };
      }
    } catch (error) {
      console.error(error);
    }
  },
  allMeeting: async (authHeader, longitude, latitude) => {
    if (authHeader && longitude && latitude) {
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const meetings = await meetingModel
        .find({ user: { $ne: user.id } })
        .populate("images")
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("comments")
        .populate("likes");

      const myLatitude = latitude;
      const myLongitude = longitude;

      meetings.forEach(async (meeting) => {
        const isRating = await meetingRating.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        meeting.isRating = isRating ? true : false;

        const findLike = await meetingLikes.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: meeting._id,
          user: user.id,
        });
        if (findParticipant) {
          meeting.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: meeting._id,
          user: user.id,
        });
        if (findParticipantSpot) {
          meeting.joinStatus = 3;
        }

        meeting.isLike = findLike ? true : false;

        const findFavorite = await meetingFavorit.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        meeting.isFavorite = findFavorite ? true : false;

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(meeting.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          meeting.hour = true;
        }

        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      meetings.sort((a, b) => a.kilometr - b.kilometr);
      return { message: "success", data: meetings };
    } else if (!authHeader && longitude && latitude) {
      const meetings = await meetingModel
        .find()
        .populate("images")
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("comments")
        .populate("likes")
        .populate("images");

      const myLatitude = latitude;
      const myLongitude = longitude;

      meetings.forEach((meeting) => {
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      meetings.sort((a, b) => a.kilometr - b.kilometr);

      return { message: "success", data: meetings };
    } else if (authHeader && !longitude && !latitude) {
      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const meetings = await meetingModel
        .find({ user: { $ne: user.id } })
        .populate("images")
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("comments")
        .populate("likes");

      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      meetings.forEach(async (meeting) => {
        const isRating = await meetingRating.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        meeting.isRating = isRating ? true : false;

        const findLike = await meetingLikes.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: meeting._id,
          user: user.id,
        });
        if (findParticipant) {
          meeting.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: meeting._id,
          user: user.id,
        });
        if (findParticipantSpot) {
          meeting.joinStatus = 3;
        }

        meeting.isLike = findLike ? true : false;

        const findFavorite = await meetingFavorit.findOne({
          meetingId: meeting._id,
          user: user.id,
        });

        meeting.isFavorite = findFavorite ? true : false;

        const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
        const eventTime = new Date(meeting.date);
        const dateNow = new Date(timeMoscow);

        const timeDifference = eventTime - dateNow;
        const differenceInMinutes = timeDifference / 60000;

        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          meeting.hour = true;
        }
        meeting.kilometr = calculateDistance(
          myLatitude,
          myLongitude,
          meeting.latitude,
          meeting.longitude
        );
      });

      meetings.sort((a, b) => a.kilometr - b.kilometr);
      return { message: "success", data: meetings };
    }
  },
  like: async (user, meetingId) => {
    const likeDbIf = await meetingLikes.findOne({ user, meetingId });
    const userDb = await User.findById(user).select("name");
    if (!likeDbIf) {
      const likeDb = new meetingLikes({
        user,
        meetingId,
        date: moment.tz(process.env.TZ).format(),
      });
      await likeDb.save();
      const meetingDb = await meetingModel
        .findByIdAndUpdate(
          meetingId,
          { $push: { likes: likeDb._id } },
          { new: true }
        )
        .populate({
          path: "user",
          select: "_id name surname avatar notifMeeting",
        });

      if (meetingDb.user._id.toString() !== user) {
        const evLink = `alleven://myMeeting/${meetingId}`;

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: meetingDb.user._id.toString(),
          type: "like",
          navigate: true,
          message: `Пользователь ${userDb.name} поставил(a) лайк встрече ${meetingDb.purpose}.`,
          meetingId: meetingId,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();

        if (meetingDb.user.notifMeeting) {
          notifEvent.emit(
            "send",
            meetingDb.user._id.toString(),
            JSON.stringify({
              type: "like",
              meetingId: meetingId,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `Пользователь ${userDb.name} поставил(a) лайк встрече ${meetingDb.purpose}.`,
              link: evLink,
            })
          );
        }
      }

      return { message: true, likes: meetingDb.likes };
    } else {
      const meetingDb = await meetingModel.findByIdAndUpdate(
        meetingId,
        { $pull: { likes: likeDbIf._id } },
        { new: true }
      );
      await meetingLikes.findByIdAndDelete(likeDbIf._id);
      return { message: false, likes: meetingDb.likes };
    }
  },
  meetReject: async (meetingId, status) => {
    try {
      const meetingDb = await meetingModel
        .findByIdAndUpdate(meetingId, { $set: { status: 2 } }, { new: true })
        .populate("images");

      const userDb = await User.findByIdAndUpdate(
        meetingDb.user,
        { $set: { statusMeeting: "noVerified" } },
        { new: true }
      );

      const evLink = `alleven://myMeeting/${meetingDb._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: userDb._id,
        type: "message",
        message: `К сожалению, ваше событие ${meetingDb.purpose} ${meetingDb.description} отклонено модератором, причина - ${status}`,
        meetingId: meetingDb._id,
        navigate: true,
        link: evLink,
      };
      const nt = new Notification(dataNotif);

      if (userDb.notifMeeting) {
        notifEvent.emit(
          "send",
          userDb._id.toString(),
          JSON.stringify({
            type: "message",
            date_time: moment.tz(process.env.TZ).format(),
            meetingId: meetingDb._id,
            navigate: true,
            message: `К сожалению, ваше событие ${meetingDb.purpose} ${meetingDb.description} отклонено модератором, причина - ${status}`,
            link: evLink,
          })
        );
      }

      const pushInCollection = async (user_id, col_id, col_name) => {
        let user = await User.findById(user_id);
        user[col_name].push(col_id);
        user.last_event_date = moment().format("YYYY-MM-DDTHH:mm");
        await user.save();
        return 1;
      };

      await pushInCollection(userDb.id, meetingDb._id, "meetings");
      return { message: "Отклонено" };
    } catch (error) {
      console.error(error);
    }
  },
  commentLike: async (user, commentId) => {
    const userDb = await User.findById(user).select("name surname");
    const ifLike = await meetingCommentLikes.find({ user, commentId });
    if (!ifLike.length) {
      const likeDb = new meetingCommentLikes({
        user,
        commentId,
        date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      });
      const like = await likeDb.save();
      const commentDb = await meetingComment
        .findByIdAndUpdate(
          commentId,
          { $push: { likes: like._id } },
          { new: true }
        )
        .populate("user");
      const meeting = await meetingModel
        .findById(commentDb.meetingId)
        .populate("user");
      if (commentDb.user._id.toString() !== user) {
        let evLink;

        if (commentDb.user._id.toString() === meeting.user._id.toString()) {
          evLink = `alleven://myMeeting/${meeting._id}`;
        } else {
          evLink = `alleven://singleMeeting/${meeting._id}`;
        }
        const message = `${userDb.name} ${userDb.surname} поставил(a) новый лайк на ваш комментарий.`

        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: commentDb.user._id.toString(),
          type: "message",
          navigate: true,
          message,
          meetingId: meeting._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (commentDb.user.notifMeeting) {
          notifEvent.emit(
            "send",
            commentDb.user._id.toString(),
            JSON.stringify({
              type: "message",
              meetingId: meeting._id,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message,
              link: evLink,
            })
          );
        }
      }

      return { message: "like" };
    } else {
      const ifLike = await meetingCommentLikes.findOneAndDelete({
        user,
        commentId,
      });
      const commentDb = await meetingComment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: ifLike._id } },
        { new: true }
      );
      return { message: "unlike" };
    }
  },
  reject: async (id, data) => {
    let meeting = await meetingVerify.findById(id);
    meeting.status = 2;
    meeting.rejectMessage = data.status;
    await meeting.save();
    const updatedUser = await User.findByIdAndUpdate(
      meeting.user,
      { $set: { statusMeeting: "noVerified" } },
      { new: true }
    );

    const evLink = `alleven://verifyMeeting`;
    const msg = `К сожалению, верификация паспорта отклонена модератором,  по причине: ${data.status}`;
    const dataNotif = {
      status: 2,
      date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      user: updatedUser._id.toString(),
      type: "message",
      navigate: true,
      message: msg,
      meetingId: meeting._id,
      link: evLink,
    };
    const nt = new Notification(dataNotif);
    await nt.save();
    if (updatedUser.notifMeeting) {
      notifEvent.emit(
        "send",
        updatedUser._id.toString(),
        JSON.stringify({
          type: "message",
          navigate: true,
          date_time: moment.tz(process.env.TZ).format(),
          meetingId: meeting._id,
          message: msg,
          link: evLink,
        })
      );
    }

    return meeting;
  },
  addComment: async (user, meetingId, comment) => {
    try {
      const meeting = await meetingModel.findById(meetingId).populate("user");

      const commentDb = new meetingComment({
        user,
        meetingId,
        text: comment,
        date: moment.tz(process.env.TZ).format(),
      });
      await commentDb.save();
      const commDb = await meetingComment
        .findById(commentDb._id)
        .populate("user");
      const meetingUpdate = await meetingModel.findByIdAndUpdate(meetingId, {
        $push: { comments: commentDb._id },
      });

      const ifImpressions = await ImpressionsMeeting.findOne({
        meeting: meetingId,
        user,
      });
      const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const userDb = await User.findById(user);
      const companyDb = await meetingModel
        .findById(meetingId)
        .populate("images")
        .populate("user")
        .exec();
      if (companyDb.user._id.toString() !== user) {
        const message=`${userDb.name} ${userDb.surname} добавил комментарий.`
        const evLink = `alleven://myMeeting/${meeting._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: meeting.user._id.toString(),
          type: "message",
          navigate: true,
          message,
          meetingId: meeting._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (meeting.user.notifMeeting) {
          notifEvent.emit(
            "send",
            meeting.user._id.toString(),
            JSON.stringify({
              type: "message",
              meetingId: meeting._id,
              navigate: true,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message,
              link: evLink,
            })
          );
        }
      }

      if (ifImpressions) {
        await ImpressionsMeeting.findByIdAndUpdate(ifImpressions._id, {
          $push: { comments: comment },
          $set: { date },
        });
      } else {
        const meetingImpression = new ImpressionsMeeting({
          rating: 0,
          comments: [comment],
          images: [],
          name: userDb.name,
          surname: userDb.surname,
          avatar: userDb.avatar,
          meetingName: companyDb.name,
          meetingImage: companyDb.images[0].name,
          company: companyDb._id,
          user,
          date,
        });
        await meetingImpression.save();
      }

      return { message: "Comment added successfully", comment: commDb };
    } catch (error) {
      console.error(error);
    }
  },
  favorit: async (user, meetingId) => {
    try {
      const userDb = await User.findById(user).select("name surname");
      const meetFavorit = await meetingFavorit.findOne({ user, meetingId });
      if (meetFavorit) {
        await User.findByIdAndUpdate(user, {
          $pull: { meeting_favorites: meetingId },
        });
        const meeting = await meetingModel.findByIdAndUpdate(
          meetingId,
          {
            $pull: { favorites: meetFavorit._id },
          },
          { new: true }
        );
        await meetingFavorit.findByIdAndDelete(meetFavorit._id);
        return { message: "deleted", favorites: meeting.favorites };
      } else {
        const meetNewFavorit = new meetingFavorit({
          user,
          meetingId,
          date: moment.tz(process.env.TZ).format(),
        });
        await meetNewFavorit.save();

        const resultUser = await User.findById(user);
        resultUser.meeting_favorites.push(meetingId);
        await resultUser.save();
        const meeting = await meetingModel
          .findByIdAndUpdate(
            meetingId,
            {
              $push: { favorites: meetNewFavorit._id },
            },
            { new: true }
          )
          .populate("user");
        if (meeting.user._id.toString() !== user) {
          const evLink = `alleven://myMeeting/${meeting._id}`;
          const message=`${userDb.name} ${userDb.surname} добавил(a) в избранное ваше встречу.`

          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: meeting.user._id.toString(),
            type: "message",
            navigate: true,
            message,
            meetingId: meeting._id,
            link: evLink,
          };
          const nt = new Notification(dataNotif);
          await nt.save();
          if (meeting.user.notifMeeting) {
            notifEvent.emit(
              "send",
              meeting.user._id.toString(),
              JSON.stringify({
                type: "message",
                meetingId: meeting._id,
                navigate: true,
                date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
                message,
                link: evLink,
              })
            );
          }
        }

        return { message: "added", favorites: meeting.favorites };
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  near: async (id, authHeader) => {
    try {
      let resultChanged1;

      if (authHeader) {
        const token = authHeader.split(" ")[1];

        const userToken = jwt.decode(token);
        const user = userToken.id;
        const resDb = await meetingModel
          .findById(id)
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "_id name surname avatar" },
              {
                path: "answer",
                populate: { path: "user", select: "name surname avatar" },
              },
            ],
          })
          .populate("ratings")
          .populate({
            path: "participants",
            populate: {
              path: "user",
              select: "name surname avatar phone_number",
            },
          })
          .populate({
            path: "participantSpot",
            populate: {
              path: "user",
              select: "name surname avatar phone_number",
            },
          });

        const averageRating = calculateAverageRating(resDb.ratings);
        const ifView = await MeetingViews.findOne({ meetingId: id, user });

        if (!ifView) {
          const viewDb = new MeetingViews({
            user,
            meetingId: id,
            date: moment.tz(process.env.TZ).format(),
          });
          await viewDb.save();
          resultChanged1 = await meetingModel
            .findByIdAndUpdate(
              id,
              {
                $push: { view: viewDb._id },
                $set: { ratingCalculated: averageRating },
              },
              { new: true }
            )
            .populate({ path: "user", select: "-password" })
            .populate({
              path: "participants",
              populate: {
                path: "user",
                select: "name surname avatar phone_number",
              },
            })
            .populate("likes")
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            })
            .populate("images")
            .populate({
              path: "participantSpot",
              populate: {
                path: "user",
                select: "name surname avatar phone_number",
              },
            })
            .populate("view")
            .populate("favorites")
            .populate({
              path: "ratings",
              populate: { path: "user", select: "_id name surname avatar" },
            })
            .populate({
              path: "comments",
              populate: [
                { path: "user", select: "_id name surname avatar" },
                {
                  path: "answer",
                  populate: { path: "user", select: "name surname avatar" },
                },
              ],
            })
            .exec();
        } else {
          resultChanged1 = await meetingModel
            .findOneAndUpdate(
              { _id: id },
              {
                $set: { ratingCalculated: averageRating },
              },
              { new: true }
            )
            .populate({ path: "user", select: "-password" })
            .populate({
              path: "participants",
              populate: {
                path: "user",
                select: "name surname avatar phone_number",
              },
            })
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            })
            .populate("likes")
            .populate("images")
            .populate({
              path: "participantSpot",
              populate: {
                path: "user",
                select: "name surname avatar phone_number",
              },
            })
            .populate("view")
            .populate("favorites")
            .populate({
              path: "ratings",
              populate: { path: "user", select: "name surname avatar" },
            })
            .populate({
              path: "comments",
              populate: [
                { path: "user", select: "_id name surname avatar isLike" },
                {
                  path: "answer",
                  populate: {
                    path: "user",
                    select: "_id name surname avatar isLike",
                  },
                },
              ],
            })
            .exec();
        }

        const isRating = await meetingRating.findOne({
          meetingId: resultChanged1._id,
          user: user,
        });

        resultChanged1.isRating = isRating ? true : false;

        const findLike = await meetingLikes.findOne({
          meetingId: resultChanged1._id,
          user: user,
        });

        const findParticipant = await MeetingParticipants.findOne({
          meetingId: resultChanged1._id,
          user: user,
        });
        if (findParticipant) {
          resultChanged1.joinStatus = 2;
        }

        const findParticipantSpot = await meetingParticipantSpot.findOne({
          meetingId: resultChanged1._id,
          user: user,
        });
        if (findParticipantSpot) {
          resultChanged1.joinStatus = 3;
        }

        resultChanged1.isLike = findLike ? true : false;

        const findFavorite = await meetingFavorit.findOne({
          meetingId: resultChanged1._id,
          user: user,
        });

        resultChanged1.isFavorite = findFavorite ? true : false;

        for (let i = 0; i < resultChanged1.comments.length; i++) {
          const findCommentLike = await meetingCommentLikes.findOne({
            commentId: resultChanged1.comments[i]._id,
            user: user,
          });
          for (let z = 0; z < resultChanged1.comments[i].answer.length; z++) {
            const findAnswerLike = await AnswerLikes.findOne({
              answerId: resultChanged1.comments[i].answer[z]._id,
              user: user,
            });
            if (findAnswerLike) {
              resultChanged1.comments[i].answer[z].isLike = true;
            }
          }

          if (findCommentLike) {
            resultChanged1.comments[i].isLike = true;
          }
        }
      } else {
        const resDb = await meetingModel
          .findById(id)
          .populate({
            path: "impression_images",
            populate: { path: "user", select: "name surname avatar" },
          })
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "_id name surname avatar" },
              {
                path: "answer",
                populate: { path: "user", select: "name surname avatar" },
              },
            ],
          })
          .populate("ratings");

        const averageRating = calculateAverageRating(resDb.ratings);
        resultChanged1 = await meetingModel
          .findOneAndUpdate(
            { _id: id },
            {
              $set: { ratingCalculated: averageRating },
            },
            { new: true }
          )
          .populate({ path: "user", select: "-password" })
          .populate({
            path: "participants",
            populate: {
              path: "user",
              select: "name surname avatar phone_number",
            },
          })
          .populate("likes")
          .populate("images")
          .populate({
            path: "impression_images",
            populate: { path: "user", select: "name surname avatar" },
          })
          .populate({
            path: "participantSpot",
            populate: {
              path: "user",
              select: "name surname avatar phone_number",
            },
          })          .populate("view")
          .populate("favorites")
          .populate({
            path: "ratings",
            populate: { path: "user", select: "_id name surname avatar" },
          })
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "_id name surname avatar" },
              {
                path: "answer",
                populate: { path: "user", select: "name surname avatar" },
              },
            ],
          })
          .exec();
      }

      const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const eventTime = new Date(resultChanged1.date);
      const dateNow = new Date(timeMoscow);

      const timeDifference = eventTime - dateNow;
      const differenceInMinutes = timeDifference / 60000;

      if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
        resultChanged1.hour = true;
      }
      return { message: "success", data: resultChanged1 };
    } catch (error) {
      console.error(error);
    }
  },
  addParticipant: async (user, meetingId) => {
    try {
      const meetingDb = await meetingModel
        .findById(meetingId)
        .populate("images");
      const dbParticipants = await MeetingParticipants.find({
        user,
        meetingId,
      });

      if (dbParticipants.length) {
        return { success: true, message: "Уже участвуете", status: 422 };
      } else {
        const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

        const dbParticipants = new MeetingParticipants({
          user,
          meetingId,
          date,
        });
        await dbParticipants.save();
        meetingDb.participants.push(dbParticipants._id);
        await meetingDb.save();
        const userDb = await User.findById(user).select(
          "name surname notifMeeting"
        );

        const evLink = `alleven://myMeeting/${meetingDb._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: meetingDb.user.toString(),
          type: "Присоединение",
          navigate: true,
          situation: "upcoming",
          message: `Пользователь ${userDb.name} ${userDb.surname} присоединился к встрече ${meetingDb.purpose}.`,
          meetingId: meetingDb._id,
          categoryIcon: meetingDb.images[0].path,
          link: evLink,
        };

        const nt = new Notification(dataNotif);
        await nt.save();
        if (userDb.notifMeeting) {
          notifEvent.emit(
            "send",
            meetingDb.user.toString(),
            JSON.stringify({
              type: "Присоединение",
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              categoryIcon: meetingDb.images[0].path,
              navigate: true,
              meetingId: meetingDb._id,
              situation: "upcoming",
              message: `Пользователь ${userDb.name} ${userDb.surname} присоединился к встрече ${meetingDb.purpose}.`,
              link: evLink,
            })
          );
        }

        return {
          success: true,
          message: "Ваше участие подтверждено",
          status: 200,
        };
      }
    } catch (error) {
      console.error(error);
    }
  },
  resolve: async (id) => {
    try {
      const meetVerify = await meetingVerify.findById(id);
      if (!meetVerify) {
        throw new Error("Meeting verification record not found");
      }

      meetVerify.status = 1;
      const userDb = await User.findById(meetVerify.user);

      if (!userDb) {
        throw new Error("User not found");
      }

      userDb.statusMeeting = true;

      await meetVerify.save();
      await userDb.save();

      return { message: "Ваши данные проверены" };
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while verifying the data");
    }
  },
  verify: async (body, user) => {
    try {
      const existVerify = await MeetingVerify.findOne({
        user,
      });
      if (existVerify) {
        let d = {};
        d.name = body.name;
        d.family = body.family;
        d.surname = body.surname;
        d.passport = body.passport;
        d.term = body.term;
        d.passportImage = body.passportImage;
        d.image = body.image;
        d.user = user;
        d.status = 0;
        await MeetingVerify.updateOne(d);
        return { message: "updated" };
      } else {
        const db = new MeetingVerify({
          name: body.name,
          family: body.family,
          surname: body.surname,
          passport: body.passport,
          term: body.term,
          passportImage: body.passportImage,
          image: body.image,
          user,
        });

        await db.save();


      
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: user,
          type: "message",
          navigate: false,
          message: `Ваши документы для верификации находится на рассмотрении.`,
          link: "evLink",
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        // if (companyDb.owner.notifCompany) {
          notifEvent.emit(
            "send",
            user,
            JSON.stringify({
              type: "message",
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              navigate: false,
              message: `Ваши документы для верификации находится на рассмотрении.`,
              link: "evLink",
            })
          );
        // }

        const updatedUser = await User.findByIdAndUpdate(
          user,
          { $set: { statusMeeting: "inProgress" } },
          { new: true }
        );
        return { message: "success", user: updatedUser };
      }
    } catch (error) {
      console.error(error);
    }
  },
  addMeeting: async (meeting, user, phone) => {
    const imagePaths = meeting.images;
    try {
      // Save the meeting
      const meetingDb = new meetingModel({
        purpose: meeting.purpose,
        description: meeting.description,
        ticket: meeting.ticket,
        longitude: meeting.longitude,
        latitude: meeting.latitude,
        date: meeting.date,
        address: meeting.address,
        user,
        phone,
        changedStatusDate: moment.tz(process.env.TZ).format(),
      });
  
      await meetingDb.save();
  
      // Save the images
      const imageDocs = imagePaths.map((path) => ({
        meetingId: meetingDb._id,
        path,
      }));
  
      const savedImages = await meetingImages.insertMany(imageDocs);
  
      // Update the meeting with image references
      meetingDb.images = savedImages.map((image) => image._id);
      await meetingDb.save();
  
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        user,
        { $push: { meetings: meetingDb._id } },
        { new: true }
      );
  
      return [
        { success: true, message: "Meeting and images saved successfully" },
        meetingDb,
      ];
    } catch (error) {
      console.error(error);
      throw new Error("Failed to save meeting and images");
    }
  },
  
  // addMeeting: async (meeting, user, phone) => {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   const imagePaths = meeting.images;
  //   try {
  //     const meetingDb = new meetingModel({
  //       purpose: meeting.purpose,
  //       description: meeting.description,
  //       ticket: meeting.ticket,
  //       longitude: meeting.longitude,
  //       latitude: meeting.latitude,
  //       date: meeting.date,
  //       address: meeting.address,
  //       user,
  //       phone,
  //       changedStatusDate: moment.tz(process.env.TZ).format(),
  //     });

  //     await meetingDb.save({ session });

  //     const imageDocs = imagePaths.map((path) => ({
  //       meetingId: meetingDb._id,
  //       path,
  //     }));

  //     const savedImages = await meetingImages.insertMany(imageDocs, {
  //       session,
  //     });

  //     meetingDb.images = savedImages.map((image) => image._id);
  //     await meetingDb.save({ session });

  //     await session.commitTransaction();
  //     session.endSession();

  //     const updatedUser = await User.findByIdAndUpdate(
  //       user,
  //       { $push: { meetings: meetingDb._id } },
  //       { new: true }
  //     );
  //     return [
  //       { success: true, message: "Meeting and images saved successfully" },
  //       meetingDb,
  //     ];
  //   } catch (error) {
  //     await session.abortTransaction();
  //     session.endSession();
  //     console.error(error);
  //     throw new Error("Failed to save meeting and images");
  //   }
  // },
  editMeeting: async (id, data) => {
    try {
      // const meetingDbforImg = await meetingModel.findById(id).select({ images: 1 }).populate("images");
      // meetingDbforImg.images.map(async (imgId) => {

      //  const imageDel=await deleteImage(__dirname, imgId.path);

      // });
      // const d = data;

      // if (d.images && d.images.length) {
      //   let imgArr = [];
      //   for (const image of d.images) {
      //     let img = await meetingImages.create({ path: image, meetingId: id });

      //     imgArr.push(img);
      //   }
      //   d.images = imgArr;
      // }

      // let event = await meetingModel.updateOne(d);

      // return event;
      const d = data;
      if (typeof data.images[0] === "string") {
        const meetingDbforImg = await meetingModel
          .findById(id)
          .select({ images: 1 })
          .populate("images");
        meetingDbforImg.images.map(async (imgId) => {
          const imageDel = await deleteImage(__dirname, imgId.path);
        });
        await meetingModel.findByIdAndUpdate(id, { $set: { images: [] } });
        await meetingImages.deleteMany({ meetingId: id });
        for (let i = 0; i < data.images.length; i++) {
          const newImage = new meetingImages({ path: data.images[i] });
          await newImage.save();

          const dbRes = await meetingModel.findByIdAndUpdate(id, {
            $push: { images: newImage._id },
          });
        }
        delete d.images;
        await meetingModel.findByIdAndUpdate(id, { ...d });

        const meetingDb = await meetingModel.findById(id);

        return meetingDb;
      } else {
        delete d.images;

        const meetingDb = await meetingModel.findByIdAndUpdate(
          id,
          { ...d },
          { new: true }
        );

        return meetingDb;
      }
    } catch (err) {
      console.error(err);
    }
  },
};

export default meetingService;
