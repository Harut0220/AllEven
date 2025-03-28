import mongoose from "mongoose";
import meetingImages from "../models/meeting/meetingImages.js";
// import meetingImages from "../models/meeting/meetingImages.js";
import meetingModel from "../models/meeting/meetingModel.js";
import meetingVerify from "../models/meeting/meetingVerify.js";
import MeetingVerify from "../models/meeting/meetingVerify.js";
import MeetingParticipants from "../models/meeting/meetingParticipant.js";
import User from "../models/User.js";
import meetingFavorit from "../models/meeting/meetingFavorit.js";
// import moment from "moment-timezone";
import jwt from "jsonwebtoken";
// import meetingComment from "../models/meeting/meetingComment.js";
import Role from "../models/Role.js";
import NotificatationList from "../models/NotificationList.js";
import Notification from "../models/Notification.js";
import UserService from "./UserService.js";
import NotificationService from "./NotificationService.js";
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
import e from "express";
import meetingComment from "../models/meeting/meetingComment.js";
import meetingView from "../models/meeting/meetingView.js";
import companyModel from "../models/company/companyModel.js";
import meetingImpressionImage from "../models/meeting/meetingImpressionImage.js";
import ImpressionsMeeting from "../models/ImpressionsMeeting.js";
import AnswerLikes from "../models/meeting/meetingCommentAnswerLike.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Report from "../models/Report.js";

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
      function separateUpcomingAndPassed(events) {
        const upcoming = [];
        const passed = [];

        events.forEach((event) => {
          const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

          if (event.date > dateNow) {
            upcoming.push(event);
          } else {
            passed.push(event);
          }
        });

        return { upcoming, passed };
      }

      const upcomPass = separateUpcomingAndPassed(resArray);
      const data = {};
      data.upcoming = upcomPass.upcoming;
      data.passed = upcomPass.passed;

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
      for (let i = 0; i < des_events.length; i++) {
        const meeting = await meetingModel.findById(des_events[i]);
        await Notification.deleteMany({ meetingId: des_events[i] });
        await Report.deleteMany({ meeting: des_events[i] });
        if (!meeting) {
          throw new Error("Meeting not found");
        }

        const comments = await meetingComment.find({
          meetingId: des_events[i],
        });

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
        await ImpressionsMeeting.deleteMany({ meeting: des_events[i] });

        await meetingComment.deleteMany({ meetingId: des_events[i] });
        await meetingImages.deleteMany({ meetingId: des_events[i] });
        await meetingLikes.deleteMany({ meetingId: des_events[i] });
        await meetingFavorit.deleteMany({ meetingId: des_events[i] });
        await meetingParticipantSpot.deleteMany({ meetingId: des_events[i] });
        await meetingView.deleteMany({ meetingId: des_events[i] });
        await meetingRating.deleteMany({ meetingId: des_events[i] });
        await meetingParticipant.deleteMany({ meetingId: des_events[i] });
        await meetingImpressionImage.deleteMany({ meetingId: des_events[i] });

        await User.findByIdAndUpdate(meeting.user.toString(), {
          $pull: { meetings: meeting._id, meeting_favorites: meeting._id },
          // $pull: { meeting_favorites: meeting._id },
        });
        await meeting.remove();
        console.log("Meetings and all related data deleted successfully");
      }
    }
    if (typeof des_events === "string") {
      const meeting = await meetingModel.findById(des_events);
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
        // $pull: { meeting_favorites: meeting._id },
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
    function separateUpcomingAndPassed(events) {
      const upcoming = [];
      const passed = [];

      events.forEach((event) => {
        if (event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")) {
          upcoming.push(event);
        } else {
          passed.push(event);
        }
      });

      return { upcoming, passed };
    }
    const separatedEvents = separateUpcomingAndPassed(meetings);
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

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        // Haversine formula
        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }
      // const userDb=await User.findById(user.id)

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

      function separateUpcomingAndPassed(events) {
        const now = new Date();
        const upcoming = [];
        const passed = [];

        events.forEach((event) => {
          if (
            event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
          ) {
            upcoming.push(event);
          } else {
            passed.push(event);
          }
        });

        return { upcoming, passed };
      }
      const separatedEvents = separateUpcomingAndPassed(meetings);
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
        const differenceInMinutes = timeDifference / 60000; // Convert ms to minutes

        
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
        // passed: filter,
      };
    } else if (!authHeader && longitude && latitude) {
      const myLatitude = latitude;
      const myLongitude = longitude;

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }
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

      function separateUpcomingAndPassed(events) {
        const upcoming = [];
        const passed = [];

        events.forEach((event) => {
          if (
            event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
          ) {
            upcoming.push(event);
          } else {
            passed.push(event);
          }
        });

        return { upcoming, passed };
      }

      const separatedEvents = separateUpcomingAndPassed(meetings);

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
        const differenceInMinutes = timeDifference / 60000; // Convert ms to minutes

        
        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;        }
      }
      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
        // passed: filter,
      };
    } else if (
      !authHeader &&
      longitude === "undefined" &&
      latitude === "undefined"
    ) {
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }
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

      function separateUpcomingAndPassed(events) {
        const upcoming = [];
        const passed = [];

        events.forEach((event) => {
          if (
            event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
          ) {
            upcoming.push(event);
          } else {
            passed.push(event);
          }
        });

        return { upcoming, passed };
      }
      const separatedEvents = separateUpcomingAndPassed(meetings);
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
        const differenceInMinutes = timeDifference / 60000; // Convert ms to minutes

        
        if (differenceInMinutes <= 60 && differenceInMinutes >= -180) {
          element.hour = true;
        }
      }
      return {
        message: "success",
        upcoming: separatedEvents.upcoming,
        // passed: filter,
      };
    } else if (authHeader && longitude && latitude) {
      const token = authHeader.split(" ")[1];
      const user = jwt.decode(token);
      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }
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
      // for (let i = 0; i < meetings.length; i++) {
      //   const isRating = await meetingRating.findOne({
      //     meetingId: meetings[i]._id,
      //     user: user,
      //   });
      //   meetings[i].isRating = isRating ? true : false;
      //   const findLike = await meetingLikes.findOne({
      //     meetingId: meetings[i]._id,
      //     user: user.id,
      //   });
      //   meetings[i].isLike = findLike ? true : false;
      //   const findFavorite = await meetingFavorit.findOne({
      //     meetingId: meetings[i]._id,
      //     user: user.id,
      //   });
      //   meetings[i].isFavorite = findFavorite ? true : false;
      // }
      function separateUpcomingAndPassed(events) {
        const upcoming = [];
        const passed = [];

        events.forEach((event) => {
          if (
            event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
          ) {
            upcoming.push(event);
          } else {
            passed.push(event);
          }
        });

        return { upcoming, passed };
      }
      const separatedEvents = separateUpcomingAndPassed(meetings);
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
        const differenceInMinutes = timeDifference / 60000; // Convert ms to minutes

        
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
        // passed: filter,
      };
    } else {
      return {
        message: "error",
        upcoming: [],
        // passed: [],
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
        const evLink = `alleven://myMeeting/${updatedMeeting._id}`;
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
      function calculateAverageRating(ratings) {
        if (ratings.length === 0) return 0;

        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);

        const average = total / ratings.length;

        return Math.round(average * 10) / 10;
      }
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
          // $set: { rating },
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
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: companyDb.user._id.toString(),
          type: "message",
          navigate: true,
          message: `У вас новое сообщение.`,
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
              message: `У вас новое сообщение.`,
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
      const evLink = `alleven://myMeeting/${updatedMeeting._id}`;
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: commentDb.user._id.toString(),
        type: "message",
        navigate: true,
        message: `У вас новое сообщение.`,
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
            message: `У вас новое сообщение. `,
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
        message: `Пользователь ${userDb.name} пришел на ваше встрече ${updatedMeeting.purpose}. `,
        meetingId,
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
            message: `Пользователь ${userDb.name} пришел на ваше встрече ${updatedMeeting.purpose}. `,
            link: evLink,
          })
        );
      }

      return { message: "Вас добавлен в список на место" };
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

    function calculateAverageRating(ratings) {
      if (ratings.length === 0) return 0;

      const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);

      const average = total / ratings.length;

      return Math.round(average * 10) / 10;
    }

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

        function separateUpcomingAndPassed(events) {
          const upcoming = [];
          const passed = [];

          events.forEach((event) => {
            if (
              event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
            ) {
              upcoming.push(event);
            } else {
              passed.push(event);
            }
          });

          return { upcoming, passed };
        }

        const separatedEvents = separateUpcomingAndPassed(resDb);
        const filter = separatedEvents.passed.filter(
          (event) => event.status === 1
        );
        let passed = [];
        for (let i = 0; i < filter.length; i++) {
          for (let j = 0; j < filter[i].participants.length; j++) {
            if (filter[i].participants[j]._id.toString() === user) {
              passed.push(filter[i]);
            }
          }
        }

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
        function calculateDistance(lat1, lon1, lat2, lon2) {
          const earthRadius = 6371;

          const latRad1 = (lat1 * Math.PI) / 180;
          const lonRad1 = (lon1 * Math.PI) / 180;
          const latRad2 = (lat2 * Math.PI) / 180;
          const lonRad2 = (lon2 * Math.PI) / 180;

          const dLat = latRad2 - latRad1;
          const dLon = lonRad2 - lonRad1;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latRad1) *
              Math.cos(latRad2) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadius * c;

          return distance;
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
        passed.forEach((meeting) => {
          meeting.kilometr = calculateDistance(
            myLatitude,
            myLongitude,
            meeting.latitude,
            meeting.longitude
          );
        });

        separatedEvents.upcoming.sort((a, b) => a.kilometr - b.kilometr);
        passed.sort((a, b) => a.kilometr - b.kilometr);

        return {
          message: "success",
          upcoming: separatedEvents.upcoming,
          passed,
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
        function separateUpcomingAndPassed(events) {
          const upcoming = [];
          const passed = [];

          events.forEach((event) => {
            if (
              event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")
            ) {
              upcoming.push(event);
            } else {
              passed.push(event);
            }
          });

          return { upcoming, passed };
        }
        const separatedEvents = separateUpcomingAndPassed(resDb);

        function calculateDistance(lat1, lon1, lat2, lon2) {
          const earthRadius = 6371;

          const latRad1 = (lat1 * Math.PI) / 180;
          const lonRad1 = (lon1 * Math.PI) / 180;
          const latRad2 = (lat2 * Math.PI) / 180;
          const lonRad2 = (lon2 * Math.PI) / 180;

          const dLat = latRad2 - latRad1;
          const dLon = lonRad2 - lonRad1;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latRad1) *
              Math.cos(latRad2) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = earthRadius * c;

          return distance;
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
        separatedEvents.passed.forEach((meeting) => {
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

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }

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
    } else if (!authHeader && longitude && latitude) {
      const meetings = await meetingModel
        .find()
        .populate("images")
        .populate({ path: "user", select: "-password" })
        .populate("participants")
        .populate("comments")
        .populate("likes")
        .populate("images");
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }

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

      function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;

        const latRad1 = (lat1 * Math.PI) / 180;
        const lonRad1 = (lon1 * Math.PI) / 180;
        const latRad2 = (lat2 * Math.PI) / 180;
        const lonRad2 = (lon2 * Math.PI) / 180;

        const dLat = latRad2 - latRad1;
        const dLon = lonRad2 - lonRad1;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latRad1) *
            Math.cos(latRad2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
      }

      const myLatitude = 55.7558;
      const myLongitude = 37.6173;

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
          message: `Пользователь ${userDb.name} поставил лайк встрече ${meetingDb.purpose}.`,
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
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `Пользователь ${userDb.name} поставил лайк встрече ${meetingDb.purpose}.`,
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
      // const store = async (data) => {
      //   let ex_notif_type = false;
      //   if (data.user && data.type) {
      //     const user = await User.findById(data.user);
      //     if (
      //       user &&
      //       user.list_of_notifications &&
      //       user.list_of_notifications.length
      //     ) {
      //       for (let l = 0; l < user.list_of_notifications.length; l++) {
      //         if (data.notif_type == user.list_of_notifications[l].name) {
      //           ex_notif_type = true;
      //           break;
      //         }
      //       }
      //     }
      //   }
      //   const getNotificatationListByName = async (name) => {
      //     return await NotificatationList.findOne({ name });
      //   };
      //   const notificationLists = await getNotificatationListByName(data.type);

      //   if (!ex_notif_type && notificationLists) {
      //     return 1;
      //   }

      //   let roles = await Role.find({ name: data.sent }, { _id: 1 });
      //   data.sent = roles;
      //   return await Notification.create(data);
      // };
      const evLink = `alleven://myMeeting/${meetingDb._id}`;

      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format(),
        user: userDb._id,
        type: "message",
        message: `К сожалению, ваше событие ${meetingDb.purpose} ${meetingDb.description} отклонено модератором, причина - ${status}`,
        // categoryIcon: meetingDb.images[0].path,
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
            // categoryIcon: meetingDb.images[0].path,
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
        const evLink = `alleven://myMeeting/${meeting._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: commentDb.user._id.toString(),
          type: "message",
          navigate: true,
          message: `У вас новое сообщение.`,
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
              message: `У вас новое сообщение.`,
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
    const msg = `К сожалению, ваше данные паспорта отклонено модератором, причина - ${data.status}`;
    const dataNotif = {
      status: 2,
      date_time: moment.tz(process.env.TZ).format(),
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

    // await event.updateOne(data);
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
        const evLink = `alleven://myMeeting/${meeting._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: meeting.user._id.toString(),
          type: "message",
          navigate: true,
          message: `У вас новое сообщение.`,
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
              message: `У вас новое сообщение.`,
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
          const dataNotif = {
            status: 2,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            user: meeting.user._id.toString(),
            type: "message",
            navigate: true,
            message: `У вас новое сообщение.`,
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
                message: `У вас новое сообщение.`,
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
              { path: "user", select: "_id name surname avatar" }, // Populate user in comments
              {
                path: "answer", // Populate the answer array
                populate: { path: "user", select: "name surname avatar" }, // Populate user in the nested answer array
              },
            ],
          })
          .populate("ratings");
        function calculateAverageRating(ratings) {
          if (ratings.length === 0) return 0;

          const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);

          const average = total / ratings.length;

          return Math.round(average * 10) / 10;
        }

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
            .populate("participants")
            .populate("likes")
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            })
            .populate("images")
            .populate("participantSpot")
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
            .populate("participants")
            .populate({
              path: "impression_images",
              populate: { path: "user", select: "name surname avatar" },
            })
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
                { path: "user", select: "_id name surname avatar isLike" }, // Populate user in comments
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
        // let resultChanged1;
        const resDb = await meetingModel
          .findById(id)
          .populate({
            path: "impression_images",
            populate: { path: "user", select: "name surname avatar" },
          })
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "_id name surname avatar" }, // Populate user in comments
              {
                path: "answer", // Populate the answer array
                populate: { path: "user", select: "name surname avatar" }, // Populate user in the nested answer array
              },
            ],
          })
          .populate("ratings");
        function calculateAverageRating(ratings) {
          if (ratings.length === 0) return 0;

          const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);

          const average = total / ratings.length;

          return Math.round(average * 10) / 10;
        }

        const averageRating = calculateAverageRating(resDb.ratings);
        resultChanged1 = await meetingModel
          .findOneAndUpdate(
            { _id: id },
            {
              $set: { ratingCalculated: averageRating }, // Set new rating
            },
            { new: true } // Return the updated document
          )
          .populate({ path: "user", select: "-password" })
          .populate("participants")
          .populate("likes")
          .populate("images")
          .populate({
            path: "impression_images",
            populate: { path: "user", select: "name surname avatar" },
          })
          .populate("participantSpot")
          .populate("view")
          .populate("favorites")
          .populate({
            path: "ratings",
            populate: { path: "user", select: "_id name surname avatar" },
          })
          .populate({
            path: "comments",
            populate: [
              { path: "user", select: "_id name surname avatar" }, // Populate user in comments
              {
                path: "answer",
                populate: { path: "user", select: "name surname avatar" }, // Populate user in the nested answer array
              },
            ],
          })
          .exec();
      }

      const timeMoscow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");
      const eventTime = new Date(resultChanged1.date);
      const dateNow = new Date(timeMoscow);
      
      
      const timeDifference = eventTime - dateNow;
      const differenceInMinutes = timeDifference / 60000; // Convert ms to minutes

      
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

        // const resDb=await MeetingVerify.find({passport:body.passport})
        // const userDb=await User.findById(user)
        // userDb.meetings.push(db._id)
        // const user=(await userDb.save()).populate("meetings").exec()
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
    const session = await mongoose.startSession();
    session.startTransaction();
    const imagePaths = meeting.images;
    try {
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

      await meetingDb.save({ session });

      const imageDocs = imagePaths.map((path) => ({
        meetingId: meetingDb._id,
        path,
      }));

      const savedImages = await meetingImages.insertMany(imageDocs, {
        session,
      });

      meetingDb.images = savedImages.map((image) => image._id);
      await meetingDb.save({ session });

      await session.commitTransaction();
      session.endSession();

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
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      throw new Error("Failed to save meeting and images");
    }
  },
  editMeeting: async (id, data) => {
    try {
      const d = data;

      if (d.images && d.images.length) {
        let imgArr = [];
        for (const image of d.images) {
          let img = await meetingImages.create({ path: image, meetingId: id });

          imgArr.push(img);
        }
        d.images = imgArr;
      }

      let event = await meetingModel.updateOne(d);

      return event;

      // let event = await meetingModel.findById(id);
      // if (!event) {
      //   return 0;
      // }
      // const newObj = { id, ...data };

      // delete newObj.images;

      // const evLink = `alleven://myMeeting/${event._id}`;

      // const updatedCompany = await meetingModel
      //   .findByIdAndUpdate(
      //     id,
      //     { ...newObj, updatedAt: moment.tz(process.env.TZ).format() },
      //     { new: true }
      //   )
      //   .populate("images");
      // const __filename = fileURLToPath(import.meta.url);
      // const __dirname = dirname(__filename);
      // // const dirPath = __dirname.split("");

      // for (let i = 0; i < updatedCompany.images.length; i++) {

      //   const element = updatedCompany.images[i];
      //   try {
      //     const filePath = path.join(__dirname, "..", "storage", element.name);

      //     if (fs.existsSync(filePath)) {
      //       await fs.promises.unlink(filePath);
      //       console.log("File deleted successfully:", filePath);
      //     } else {
      //       console.log("File not found:", filePath);
      //     }
      //   } catch (err) {
      //     console.error("Error deleting file:", err);
      //   }
      //   await meetingImages.findByIdAndDelete(element._id);
      // }
      // await meetingModel.findByIdAndUpdate(id, { $set: { images: [] } });

      // await data.images.map(async (el) => {
      //   const evImg = new meetingImages({
      //     name: el,
      //   });

      //   const evimgDb = await evImg.save();
      //   // console.log(evimgDb,"new image");
      //   await meetingModel.findByIdAndUpdate(id, {
      //     $push: { images: evimgDb._id },
      //   });
      // });
      // // console.log(updatedCompany,"updatedCompany res");

      // return updatedCompany;
    } catch (err) {
      console.error(err);
    }
  },
};

export default meetingService;
