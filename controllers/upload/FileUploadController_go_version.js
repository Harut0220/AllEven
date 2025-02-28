import UploadService from "../../services/UploadService.js";
import FormData from 'form-data';
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {fileTypeFromFile} from "file-type";
import fs from "fs";






class FileUploadController{

    constructor(){
        this.UploadService = new UploadService();
    }
    storeSingle = async (req,res) => {
        const file = req.files.file;

        const newName = `${uuidv4()}${path.extname(file.name)}`
        let p = `uploads/${newName}`;

        const form = new FormData();
        form.append('file', file.data, newName);

        const upload = await this.UploadService.GoUploadService(form);

        if(!upload){
            res.status(500);
            return res.json({'message':'Service Unavailable'});
        }

        const checkExt = await this.UploadService.checkFileExt(p);

        if(checkExt){
            p = checkExt;
        }

        return res.json({'path':p})
    }

    storeMulti = async (req,res) => {
        const files = req.files.file;
        const paths = [];
        const form = new FormData();


        for(let f=0;f<files.length;f++){
            let randName = `${uuidv4()}${path.extname(files[f].name)}`;
            paths.push(`uploads/${randName}`);
            form.append('file', files[f].data, randName);
        }

        const upload = await this.UploadService.GoUploadService(form);

        if(!upload){
            res.status(500);
            return res.json({'message':'Service Unavailable'});
        }

        for(let pth =0;pth<paths.length;pth++){
            let checkExt = await this.UploadService.checkFileExt(paths[pth]);
            if(checkExt){
                paths[pth] = checkExt;
            }

        }



        return res.json({paths})
    }


}


export default new FileUploadController();