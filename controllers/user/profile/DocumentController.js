import DocxService from "../../../services/DocxService.js";
import UploadService from "../../../services/UploadService.js";
import DocumentService from "../../../services/DocumentService.js";
import UserService from "../../../services/UserService.js"
class DocumentController{

    constructor(){
        this.DocxService = new DocxService();
        this.UploadService = new UploadService();
        this.DocumentService = new DocumentService();
        this.UserService = new UserService();
    }

    index = async (req,res) => {
        let documents =  await this.DocumentService.getAll();
        console.log(documents,"documents");
        
        res.render('profile/document/index',{ layout: 'profile', title: "Documents", user:req.user,documents})
    }

    edit = async (req,res) => {
        let documents =  await this.DocumentService.getAll();
        let document = await this.DocumentService.find(req.params.id);
        res.render('profile/document/edit',{ layout: 'profile', title: "Edit Document", user:req.user,document,documents})
    }

    subscribedUsers = async (req,res) => {
        let users = await this.UserService.getAll();
        let documents = await this.DocumentService.getAll();
        res.render('profile/document/subscribed-users',{ layout: 'profile', title: "Subscribed Users", user:req.user,users,documents})
    }

    store = async (req,res) => {
        let p = await this.UploadService.storeSync(req.files.file,'docs',false)
        let newPath = await this.DocxService.index(p);
        
        this.UploadService.destroy(p);
        let data = {};
        data.path = newPath.newPath;
        data.text= newPath.text
        data.role = req.body.role
        
        if(data.role == 'all'){
            data.role = ['USER']
        }
        let doc = await this.DocumentService.store(data)
        return res.redirect(`/admin/profile/document/edit/${doc._id}`)
    }

    update = async (req,res) => {
        const {context, role} = req.body
        console.log(context, role,"role");
        
        let data = {role};
        if(data.role == 'all'){
            data.role = ['USER','USER']
        }
        let doc = await this.DocumentService.update(req.params.id,data);
        await this.DocumentService.changeContent(doc.path,context)
        return res.redirect('back');
    }
    
}


export default new DocumentController();