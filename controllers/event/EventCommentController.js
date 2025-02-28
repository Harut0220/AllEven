import EventCommentService from "../../services/EventCommentService.js";

class EventCommentController{

    constructor(){
        this.EventCommentService = new EventCommentService()
    }

    destroy = async (req,res) => {
        this.EventCommentService.destroy(req.params.id);
        return res.redirect('back');
    }
}

export default new EventCommentController();