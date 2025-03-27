import Report from "../models/Report.js";
import EventService from "./EventService.js";
import CommentService from "./EventCommentService.js";
import EventImpressionImageService from "./EventImpressionImageService.js";
import EventComment from "../models/event/EventComment.js";
import EventImpressionImages from "../models/event/EventImpressionImages.js";
import companyComment from "../models/company/companyComment.js";
import companyImpressionImages from "../models/company/companyImpressionImages.js";
import meetingComment from "../models/meeting/meetingComment.js";
import meetingImpressionImage from "../models/meeting/meetingImpressionImage.js";

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
        // if(data.report_type == 'event_comment'){
        //     const commentDb =await EventComment.findById(data.id)
        //     const newReport = new Report({
        //         event:commentDb.event,
        //         event_comment: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();
        // }
        // if(data.report_type == 'event_impression'){
        //     const impressionDb =await EventImpressionImages.findById(data.id)
        //     const newReport = new Report({
        //         event:impressionDb.event,
        //         event_impression: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();
        // }
        // if(data.report_type == 'company_comment'){
        //     const commentDb=await companyComment.findById(data
        //         .id)
        //     const newReport = new Report({
        //         company:commentDb.companyId,
        //         company_comment: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();
        // }        
        // if(data.report_type == 'company_impression'){
        //     const impressionDb =await companyImpressionImages.findById(data.id)
        //     const newReport = new Report({
        //         company:impressionDb.companyId,
        //         company_impression: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();
        // }
        // if(data.report_type == 'meeting_comment'){
        //     const commentDb =await meetingComment
        //     .findById(data.id)
        //     const newReport = new Report({
        //         meeting:commentDb.meetingId,
        //         meeting_comment: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();
        // }
        // if(data.report_type == 'meeting_impression'){
        //     const impressionDb =await meetingImpressionImage.findById(data.id)
        //     const newReport = new Report({
        //         meeting:impressionDb.meeting,
        //         meeting_impression: data.id,
        //         report_type: data.report_type,
        //         text: data.text,
        //         name: data.name,
        //         surname: data.surname,
        //         phone_number: data.phone_number
        //     });
        //     return newReport.save();

        // }
        // return false;
        try {
            let referenceDb;
            let reportData = {
                report_type: data.report_type,
                text: data.text,
                name: data.name,
                surname: data.surname,
                phone_number: data.phone_number,
            };
        
            switch (data.report_type) {
                case 'event_comment':
                    referenceDb = await EventComment.findById(data.id);
                    reportData.event = referenceDb.event;
                    reportData.event_comment = data.id;
                    break;
                case 'event_impression':
                    referenceDb = await EventImpressionImages.findById(data.id);
                    reportData.event = referenceDb.event;
                    reportData.event_impression = data.id;
                    break;
                case 'company_comment':
                    referenceDb = await companyComment.findById(data.id);
                    reportData.company = referenceDb.companyId;
                    reportData.company_comment = data.id;
                    break;
                case 'company_impression':
                    referenceDb = await companyImpressionImages.findById(data.id);
                    reportData.company = referenceDb.companyId;
                    reportData.company_impression = data.id;
                    break;
                case 'meeting_comment':
                    referenceDb = await meetingComment.findById(data.id);
                    reportData.meeting = referenceDb.meetingId;
                    reportData.meeting_comment = data.id;
                    break;
                case 'meeting_impression':
                    referenceDb = await meetingImpressionImage.findById(data.id);
                    reportData.meeting = referenceDb.meeting;
                    reportData.meeting_impression = data.id;
                    break;
                default:
                    throw new Error('Invalid report type');
            }
        
            const newReport = new Report(reportData);
            return newReport.save();
        } catch (error) {
            console.log(error);
            return false;
        }
       
    }

    getAndLean = async () => {
        return Report.find()
        // .populate(['impression','comment','event'])
        // .lean();
    }
}

export default ReportService