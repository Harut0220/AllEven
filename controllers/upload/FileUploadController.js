import UploadService from "../../services/UploadService.js";
class FileUploadController{

    constructor(){
        this.UploadService = new UploadService();
    }
    storeSingle = async (req,res) => {
        const file = req.files.file;
        let path = '';
        if(file.mimetype && file.mimetype.includes('image')){
            path = await this.UploadService.storeLowResImage(file.data);
        }else{
            path = await this.UploadService.storeSync(file,'uploads');
        }

        return res.json({path})
    }

    storeMulti = async (req,res) => {
        const files = req.files.file;
        const paths = [];

        for(let f=0;f<files.length;f++){
            if(files[f].mimetype && files[f].mimetype.includes('image')){
                paths.push(await this.UploadService.storeLowResImage(files[f].data))
            }else{
                paths.push(await this.UploadService.storeSync(files[f],'uploads'))
            }
        }
        console.log(paths,"paths");
        
        return res.json({paths})
    }


}


export default new FileUploadController();