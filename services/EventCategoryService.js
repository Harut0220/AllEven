import EventCategory from "../models/event/EventCategory.js";
import UploadService from "./UploadService.js";

class EventCategoryService{

    constructor(){
        this.UploadService = new UploadService();
    }

    get = async () => {
        return await EventCategory.find({status:1}).sort({createdAt: 'desc'}).populate(['owner','name']).lean()
    }

    findById = async (id) => {
        return await EventCategory.findById(id);
    }
    getByUser = async (favCat) => {
        const catIds = [];
        for (const cat of favCat) {
            catIds.push(cat._id.toString())
        }
        const categories = await EventCategory.find({
            status: 1,
        }).sort({createdAt: 'desc'}).populate(['owner','name']).lean()
        const catArr = [];
        for (const category of categories) {
            let checked = false;
            if (catIds.includes(category._id.toString())) {
                checked = true
            }
            catArr.push({
                ...category,
                checked
            })
        }
        return catArr
    }

    index = async () => {
        return await EventCategory.find({}).sort({createdAt: 'desc'}).populate('owner','name').lean()
    }

    // store = async (data) => {
    //     return await EventCategory.create(data)
    // }

    update = async (id,data) => {
        let category = await EventCategory.findById(id);
        if(data.avatar){
            if(category.avatar){
                this.UploadService.destroy(category.avatar)
            }
            data.avatar = this.UploadService.store(data.avatar,'categories')
        }
        if(data.map_avatar){
            if(category.map_avatar){
                this.UploadService.destroy(category.map_avatar)
            }
            data.map_avatar = this.UploadService.store(data.map_avatar,'categories/map')
        }
        await category.updateOne(data);
        return await category.populate('owner','email');
    }

    store = async (data) => {
        if(data.avatar){
            data.avatar = this.UploadService.store(data.avatar,'categories')
        }
        if(data.map_avatar){
            data.map_avatar = this.UploadService.store(data.map_avatar,'categories/map')
        }
        return await EventCategory.create(data)
    }

    getWithUtilizers = async () => {
        return await EventCategory.find({}).select('name').populate('utilizers').lean()
    }

    getInactive = async () => {
        return await EventCategory.find({status:0}).sort({createdAt: 'desc'}).populate('owner','name').lean()
    }

    destroy = async (id) => {
        return await EventCategory.findByIdAndDelete(id);
    }

    destroyMany = async (ids) => {
        
        for(let i=0;i<ids.length;i++){
            await this.destroy(ids[i])
        }
    }

}

export default EventCategoryService