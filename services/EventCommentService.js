import EventComment from "../models/event/EventComment.js";
class EventCommentService{

    get = async (eventId) => {
        return await EventComment.find({parent:null,event:eventId})
    }

    find = async (id) => {
        return await EventComment.findById(id);
    }



    pushInCollection = async (id,col_id,col_name) => {
        let c = await this.find(id);
        c[col_name].push(col_id);
        await c.save()
        return c[col_name];
    }

    destroyFromCollection = async (id,col_id,col_name) => {
        let c = await this.find(id);
        c[col_name].remove(col_id);
        await c.save()
        return c[col_name];
    }

    checkCollectionData = async (id,col_id,col_name) => {
        let c = await this.find(id);
        return c[col_name] && c[col_name].includes(col_id) ? 1 : 0;
    }

    addOrRemoveCollectionData = async (id,col_id,col_name) => {
        let checked = await this.checkCollectionData(id,col_id,col_name)
        if(checked){
            // await this.UserService.destroyFromCollection(col_id,id,'event_'+col_name)
            return await this.destroyFromCollection(id,col_id,col_name)
        }else{
            // await this.UserService.pushInCollection(col_id,id,'event_'+col_name)
            return await this.pushInCollection(id,col_id,col_name)
        }
    }

    store = async (data) => {
        let comment =  await EventComment.create(data)
        if(data.parent){
            let p = await this.pushInCollection(data.parent,comment._id,'childs')
        }
        return comment;
    }

    destroy = async (id) => {
        return await EventComment.findOneAndDelete({'_id':id});
    }

    findByUserEvent = async (user,event) => {
        return await EventComment.find({user,event,parent:null});
    }
}

export default EventCommentService;
