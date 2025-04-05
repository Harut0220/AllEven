// import EventCommentService from "./EventCommentService.js";
// import EventImpressionImageService from "./EventImpressionImageService.js";
// import EventRatingService from "./EventRatingService.js";
// import UserService from "./UserService.js";

// class ImpressionService{
//     constructor(){
//         this.EventCommentService = new EventCommentService();
//         this.EventImpressionImageService = new EventImpressionImageService();
//         this.EventRatingService = new EventRatingService();
//         this.UserService = new UserService();
//     }
//     getByUserEvent = async (data) => {
//         const impressions = {};
//         impressions.user = await this.UserService.findWithSpec(data.user_id,['name','surname','email']);
//         impressions.comments = await this.EventCommentService.findByUserEvent(data.user_id,data.event_id);
//         impressions.impression_images = await this.EventImpressionImageService.findByUserEvent(data.user_id,data.event_id);
//         impressions.ratings = await this.EventRatingService.findByUserEvent(data.user_id,data.event_id);
//         impressions.eventCommentArithMean = await this.EventRatingService.arithmeticalMean(data.event_id)

//         return impressions;
//     }
// }


// export default ImpressionService;