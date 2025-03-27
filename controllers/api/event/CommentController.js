import moment from "moment-timezone";
import Event from "../../../models/event/Event.js";
import EventComment from "../../../models/event/EventComment.js";
import EventCommentAnswer from "../../../models/event/EventCommentAnswer.js";
import EventCommentLikes from "../../../models/event/EventCommentLikes.js";
import EventCommentService from "../../../services/EventCommentService.js";
import jwt from "jsonwebtoken";
import EventAnswerLikes from "../../../models/event/EventCommentAnswerLike.js";
import ImpressionsEvent from "../../../models/ImpressionsEvent.js";
import User from "../../../models/User.js";
import Notification from "../../../models/Notification.js";
import notifEvent from "../../../events/NotificationEvent.js";

function getFormattedDate() {
  const date = new Date();

  const pad = (n) => n.toString().padStart(2, "0"); // Helper function to pad numbers to 2 digits

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are zero-indexed, so we add 1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0"); // Pad milliseconds to 3 digits

  // Timezone offset in minutes, and converting it to hours and minutes
  const tzOffset = date.getTimezoneOffset();
  const tzSign = tzOffset > 0 ? "-" : "+";
  const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMinutes = pad(Math.abs(tzOffset) % 60);

  // Constructing the final string in the desired format
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${tzSign}${tzHours}:${tzMinutes}`;
}

class CommentController {
  constructor() {
    this.EventCommentService = new EventCommentService();
  }

  // index = async (req,res) => {
  //     const eventId = req.query.event_id;
  //     const comments = await this.EventCommentService.get(eventId);
  //     return res.json({'status':'success','data':comments});
  // }

  // store = async (req,res) => {
  //     const {event_id,text,parent_id} = req.body
  //     let data = {event:event_id,user:req.user.id,text}
  //     if(parent_id){
  //         data.parent = parent_id
  //     }
  //     let comment = await this.EventCommentService.store(data)
  //     return res.json({'status':'success','data':comment});
  // }

  // like = async (req,res) => {
  //     let {comment_id} = req.body;
  //     let l = await this.EventCommentService.addOrRemoveCollectionData(comment_id,req.user.id,'likes')
  //     return res.json({'status':'success','data':l});

  // }

  addComment = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { id, text } = req.body;
    const userDb = await User.findById(user.id);

    if (!id || !text) {
      return res.status(400).send({ message: "id and text are required" });
    }
    const commentDb = new EventComment({
      event: id,
      user: user.id,
      text,
      date: moment.tz(process.env.TZ).format(),
    });
    await commentDb.save();
    const comment = await EventComment.findById(commentDb._id).populate({
      path: "user",
      select: "name surname avatar",
    });
    await Event.findByIdAndUpdate(id, { $push: { comments: comment._id } });
    const eventDb = await Event.findById(id)
      .populate("images")
      .populate("category")
      .populate("owner");
    const ifImpressions = await ImpressionsEvent.findOne({
      event: id,
      user: user.id,
    });
    const date = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

    const evLink = `alleven://myEvent/${id}`;
    if (user.id !== eventDb.owner._id.toString()) {
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: eventDb.owner._id.toString(),
        type: "Присоединение",
        navigate: true,
        message: `У вас новое сообщение.`,
        eventId: id,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (eventDb.owner.notifEvent) {
        notifEvent.emit(
          "send",
          eventDb.owner._id.toString(),
          JSON.stringify({
            type: "Присоединение",
            eventId: id,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `У вас новое сообщение.`,
            navigate: true,
            link: evLink,
          })
        );
      }
    }

    if (ifImpressions) {
      await ImpressionsEvent.findByIdAndUpdate(ifImpressions._id, {
        $push: { comments: text },
        $set: { date },
      });
    } else {
      const eventImpression = new ImpressionsEvent({
        rating: 0,
        comments: [text],
        images: [],
        name: userDb.name,
        surname: userDb.surname,
        avatar: userDb.avatar,
        eventName: eventDb.name,
        eventImage: eventDb.images[0].name,
        event: eventDb._id,
        category: eventDb.category.name,
        user: user.id,
        date,
      });
      await eventImpression.save();
    }

    return res.json({ status: "success", data: comment });
  };

  commentLike = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { id } = req.body;
    const isLike = await EventCommentLikes.findOne({
      user: user.id,
      commentId: id,
    });
    if (!isLike) {
      const commentLike = new EventCommentLikes({
        user: user.id,
        commentId: id,
        date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
      });
      await commentLike.save();
      const comment = await EventComment.findByIdAndUpdate(id, {
        $push: { likes: commentLike._id },
      }).populate("user");
      const countDb = await EventCommentLikes.find({ commentId: id });

      const eventDb = await Event.findById(comment.event).populate("owner");

      if (comment.user._id.toString() !== eventDb.owner._id.toString()) {
        const evLink = `alleven://myEvent/${eventDb._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: comment.user._id.toString(),
          type: "Присоединение",
          navigate: true,
          message: `У вас новое сообщение.`,
          eventId: eventDb._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (comment.user.notifEvent) {
          notifEvent.emit(
            "send",
            comment.user._id.toString(),
            JSON.stringify({
              type: "Присоединение",
              eventId: eventDb._id,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `У вас новое сообщение.`,
              navigate: true,
              link: evLink,
            })
          );
        }
      }

      return res.status(200).send({ message: "liked", count: countDb.length });
    } else {
      const comment = await EventComment.findByIdAndUpdate(id, {
        $pull: { likes: isLike._id },
      });
      await EventCommentLikes.deleteOne({ _id: isLike._id });
      const countDb = await EventCommentLikes.find({ commentId: id });
      return res
        .status(200)
        .send({ message: "unliked", count: countDb.length });
    }
  };

  commentAnswer = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { id, text } = req.body;

    const commentAnswer = new EventCommentAnswer({
      commentId: id,
      user: user.id,
      text,
      date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
    });
    await commentAnswer.save();
    const commentAnsw = await EventCommentAnswer.findById(
      commentAnswer._id
    ).populate({ path: "user", select: "name surname avatar" });
    const comment = await EventComment.findByIdAndUpdate(id, {
      $push: { answer: commentAnswer._id },
    }).populate("user");

    const eventDb = await Event.findById(comment.event).populate("owner");
    if(comment.user._id.toString() !== eventDb.owner._id.toString()){
      const evLink = `alleven://myEvent/${eventDb._id}`;
      const dataNotif = {
        status: 2,
        date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
        user: comment.user._id.toString(),
        type: "Присоединение",
        navigate: true,
        message: `У вас новое сообщение.`,
        eventId: eventDb._id,
        link: evLink,
      };
      const nt = new Notification(dataNotif);
      await nt.save();
      if (comment.user.notifEvent) {
        notifEvent.emit(
          "send",
          comment.user._id.toString(),
          JSON.stringify({
            type: "Присоединение",
            eventId: eventDb._id,
            date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
            message: `У вас новое сообщение .`,
            navigate: true,
            link: evLink,
          })
        );
      }
    }


    return res.status(200).send({ message: "success", answer: commentAnsw });
  };

  deleteComment = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { id } = req.body;
    const comment = await EventComment.findByIdAndDelete(id);
    await EventCommentAnswer.deleteMany({ commentId: id });
    await EventCommentLikes.deleteMany({ commentId: id });
    await EventAnswerLikes.deleteMany({ commentId: id });
    return res.status(200).send({ message: "comment deleted" });
  };

  commentAnswerLike = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { answerId } = req.body;
    const isLike = await EventAnswerLikes.findOne({ user: user.id, answerId });
    if (!isLike) {
      const commentLike = new EventAnswerLikes({
        user: user.id,
        answerId,
        date: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss"),
      });
      await commentLike.save();
      const comment = await EventCommentAnswer.findByIdAndUpdate(answerId, {
        $push: { likes: commentLike._id },
      }).populate("user");
      const commentDb = await EventComment.findById(comment.commentId);
      const eventDb = await Event.findById(commentDb.event).populate("owner");
      if(comment.user._id.toString() !== eventDb.owner._id.toString()){
        const evLink = `alleven://myEvent/${eventDb._id}`;
        const dataNotif = {
          status: 2,
          date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
          user: comment.user._id.toString(),
          type: "Присоединение",
          navigate: true,
          message: `У вас новое сообщение.`,
          eventId: eventDb._id,
          link: evLink,
        };
        const nt = new Notification(dataNotif);
        await nt.save();
        if (comment.user.notifEvent) {
          notifEvent.emit(
            "send",
            comment.user._id.toString(),
            JSON.stringify({
              type: "Присоединение",
              eventId: eventDb._id,
              date_time: moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm"),
              message: `У вас новое сообщение .`,
              navigate: true,
              link: evLink,
            })
          );
        }
      }


      const countDb = await EventAnswerLikes.find({ answerId });
      return res.status(200).send({ message: "liked", count: countDb.length });
    } else {
      const comment = await EventCommentAnswer.findByIdAndUpdate(answerId, {
        $pull: { likes: isLike._id },
      });
      await EventAnswerLikes.deleteOne({ _id: isLike._id });
      const countDb = await EventAnswerLikes.find({ answerId });

      return res
        .status(200)
        .send({ message: "unliked", count: countDb.length });
    }
  };

  deleteCommentAnswer = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const user = jwt.decode(token);
    let { answerId } = req.body;
    await EventAnswerLikes.deleteMany({ answerId: answerId });
    await EventCommentAnswer.findByIdAndDelete(answerId);
    return res.status(200).send({ message: "answer deleted" });
  };
}

export default new CommentController();
