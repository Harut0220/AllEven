import UserService from "../../../services/UserService.js";
import DocumentService from "../../../services/DocumentService.js";
import notifEvent from "../../../events/NotificationEvent.js";
import { Types } from "mongoose";
import Document from "../../../models/Document.js";
import Role from "../../../models/Role.js";
import User from "../../../models/User.js";
import jwt from "jsonwebtoken"
import moment from "moment-timezone"

class DocumentController {
  constructor() {
    this.UserService = new UserService();
    this.DocumentService = new DocumentService();
  }

  get = async (req, res) => {
    // const documents=await Document.find()
    // const user=await User.findById(req.user.id)
    // for(let i=0;i<documents.length;i++){
    //     const ifExist=user.documents.includes(documents[i])
    //     if(ifExist){
    //         documents[i].confirm=true
    //     }
    // }
    const dbRoleDocument = await Role.findOne({ name: "document" });

    const allUserDocuments = await Document.find({
      owners: dbRoleDocument._id,
    });

    const data = await this.DocumentService.getByRole(req.user.role);

    const userConfirmedDocs = await this.UserService.getDocuments(req.user.id);
    const dataRes = [...data, ...allUserDocuments];

    for (const doc of dataRes) {
      for (const userDoc of userConfirmedDocs.documents) {
        if (doc._id.toString() == userDoc.toString()) {
          doc.confirmed = true;
        } else {
          doc.confirmed = false;
        }
      }
    }
    
    return res.json({ status: "success", data: dataRes });
  };

  store = async (req, res) => {
    let doc_id = req.body.document_id;
    
    const document = await Document.findById(doc_id);
    const user = await User.findById(req.user.id);
    const ifInclude = user.documents.includes(doc_id);
    if (ifInclude) {
        
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { documents: document._id },
      });
      res.json({ status: "success", message: "Saved success", data: document });
    } else {
        
      await this.UserService.pushInCollection(req.user.id, doc_id, "documents");
      notifEvent.emit(
        "send",
        "ADMIN",
        JSON.stringify({ type: "Подтвердил документ", message: req.user.email })
      );
      const userDb = await User.findById(req.user.id);

      const ifIncludes=userDb.documents.includes(document._id)
      
      if (ifIncludes) {
        
        document.confirmed = true;
      }
      return res.json({
        status: "success",
        message: "Saved success",
        data: document,
      });
    }
  };

  getDocuments = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      const token = authHeader.split(" ")[1];

      const user = jwt.decode(token);
      const userDb=await User.findById(user.id)
      const dbRole1 = await Role.find({ name: "USER" });
      const dbRole2 = await Role.find({ name: "document" });

      const result1 = await Document.find({ owners: dbRole1 });
      const result2 = await Document.find({ owners: dbRole2 });
      const result = [...result1, ...result2];
      let nameArray = [];
      for (let i = 0; i < result.length; i++) {
        let obj = {};
        //    let spl = result[i].path.split("/")
        //    let spl1=spl[1].split(".")
        //    obj.name=spl1[0]
        obj.path = result[i].path;
        obj.owner = result[i].owners;
        obj._id = result[i]._id;
        obj.text = result[i].text;
        obj.date = result[i].date;
        obj.confirmed=false
        nameArray.push(obj);
      }
      nameArray.map(async(result)=>{
        
        if(userDb.documents.includes(result._id)){
            
            result.confirmed=true
        }
      })
      //    const resultDocuments= nameArray.filter((el)=>{
      //     return el.owner[0].toString()===dbRole2[0]._id.toString()})
    
      res.status(200).send(nameArray);
    } catch (error) {
      console.error(error);
    }
  };

  getDocumentsGlobal = async (req, res) => {
    try {
      const result = await Document.find();
      const dbRole = await Role.find({ name: "document" });
      let nameArray = [];
      for (let i = 0; i < result.length; i++) {
        let obj = {};
        let spl = result[i].path.split("/");
        let spl1 = spl[1].split(".");
        obj.name = spl1[0];
        obj.path = result[i].path;
        obj.owner = result[i].owners;
        obj.id = result[i]._id;
        nameArray.push(obj);
      }
      const resultDocuments = nameArray.filter((el) => {
        return el.owner[0].toString() === dbRole[0]._id.toString();
      });
      res.status(200).send(resultDocuments);
    } catch (error) {
      console.error(error);
    }
  };
}

export default new DocumentController();
