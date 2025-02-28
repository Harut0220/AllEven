import EventRating from "../models/event/EventRating.js";
class EventRatingService{

    store = async (user_id,event_id,rating = 5) => {
        return await EventRating.create({rating,user:user_id,event:event_id})
    }

    findByUserEvent = async (user,event) => {
        return await EventRating.find({user,event});
    }

    arithmeticalMean = async (id) => {
        const ratings = await EventRating.find({event:id}).select('rating').lean();
        let sum = 0;
        for( let i = 0; i < ratings.length; i++ ){
            sum += parseInt( ratings[i].rating);
        }
        return sum/ratings.length;
    }
}

export default EventRatingService;
