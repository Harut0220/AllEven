import Report from "../models/Report.js";
import EventService from "./EventService.js";
import CommentService from "./EventCommentService.js";
import EventImpressionImageService from "./EventImpressionImageService.js";

class ReportService{

    constructor(){
        this.EventService = new EventService,
        this.CommentService = new CommentService,
        this.EventImpressionImageService = new EventImpressionImageService
    }

    getComplaint = async (data) => {
        let text = ''
        if(data.report_type == 'event'){
            const event = await this.EventService.find(data.id);
            text = event.name;
        }else if(data.report_type == 'comment'){
            const comment = await this.CommentService.find(data.id);
            text = comment.text;
        }else if(data.report_type == 'impression'){
            const impression = this.EventImpressionImageService.find(data.id);
            // text = impression.path;
        }

        return text;
    }

    store = async (data) => {
        return Report.create(data);
    }

    getAndLean = async () => {
        return Report.find({})
        .populate(['impression','comment','event'])
        .lean();
    }
}

export default ReportService