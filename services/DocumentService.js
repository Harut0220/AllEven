import moment from "moment-timezone";
import Document from "../models/Document.js";
import Role from "../models/Role.js";
import fs from "fs";

class DocumentService{

    find = async (id) => {
        return Document.findById(id).populate('owners').lean();
    }

    getByRole = async (role) => {
        return await Document.find({owners: role})
    }

    getAll = async () => {
        return await Document.find({}).populate('owners').lean()
    }

    store = async (data) => {
        let roles = await Role.find({name:data.role},{_id:1});
        data.owners = roles;
        data.date=moment.tz(process.env.TZ).format('YYYY-MM-DD');
        return await Document.create(data)
        
    }

    update = async (id,data) => {
         let doc = await Document.findById(id);
         await doc.updateOne({owners:await Role.find({name:data.role},{_id:1}),date:moment.tz(process.env.TZ).format('YYYY-MM-DD')});
         return doc
    }

    changeContent = async (path,newData) => {
         fs.writeFile("storage/" + path, newData, function (err) {
            if (err) return console.log(err);
            return 1
         });
    }


}


export default DocumentService