import ReportService from "../../services/ReportService.js";
import UserService from "../../services/UserService.js";

class ReportController{

    constructor(){
        this.ReportService = new ReportService()
        this.UserService = new UserService()
    }

    index = async (req,res) => {

        const id = req.params.id;

        const report_type = req.params.report_type;

        const name = await this.ReportService.getComplaint({id,report_type})

        res.render('report/index',{title: 'Report',id,report_type,name});
    }

    store = async (req,res) => {

        const data = req.body;

        data[data.report_type] = data.id;
        await this.ReportService.store(data);
        res.cookie('report_notif',1);

        return res.redirect('back');
    }

    mobileStore = async (req, res) => {

        const data = req.body;
        data.phone_number = data.phone_number.toString();
        const phone_number = data.phone_number.length == 11
			? data.phone_number.charAt(0) != '7' ? 7+data.phone_number.substring(1) : data.phone_number
            : data.phone_number.length == 10 ? 7+data.phone_number : data.phone_number;
        const user = await this.UserService.findByPhoneNumber(phone_number)
        if (user) {
            data.name = user.name;
            data.surname = user.surname;
        }

        data[data.report_type] = data.id;

        await this.ReportService.store(data);

        return res.json({
            "status": "success"
        });
    }

    list = async (req,res) => {
        const datas = await this.ReportService.getAndLean();
        res.render('profile/complaint/list',{layout: 'profile',title: 'Report',datas});
    }

}

export default new ReportController();