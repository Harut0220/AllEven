import Report from "../../models/Report.js";
import User from "../../models/User.js";
import ReportService from "../../services/ReportService.js";
import UserService from "../../services/UserService.js";
import jwt from "jsonwebtoken";


class ReportController {
  constructor() {
    this.ReportService = new ReportService();
    this.UserService = new UserService();
  }

  index = async (req, res) => {
    const id = req.params.id;

    const report_type = req.params.report_type;

    const name = await this.ReportService.getComplaint({ id, report_type });

    res.render("report/index", { title: "Report", id, report_type, name });
  };

  store = async (req, res) => {
    const data = req.body;

    data[data.report_type] = data.id;
    await this.ReportService.store(data);
    res.cookie("report_notif", 1);

    return res.redirect("back");
  };

  mobileStore = async (req, res) => {
    try {
      const data = req.body;
      if (data.report_type === "support") {
        const authHeader = req.headers.authorization;

        const token = authHeader.split(" ")[1];

        const user = jwt.decode(token);
        const userDb=await User.findById(user.id).select(["phone_number","name","surname"])
        const newReport=new Report({
          name:userDb.name,
          surname:userDb.surname,
          phone_number:userDb.phone_number,
          text:data.text,
          report_type:data.report_type
        })
        await newReport.save()
      } else {

        data.phone_number = data.phone_number.toString();
        const phone_number =
          data.phone_number.length == 11
            ? data.phone_number.charAt(0) != "7"
              ? 7 + data.phone_number.substring(1)
              : data.phone_number
            : data.phone_number.length == 10
            ? 7 + data.phone_number
            : data.phone_number;
        const user = await this.UserService.findByPhoneNumber(phone_number);
        if (user) {
          data.name = user.name;
          data.surname = user.surname;
        } else {
          return res.json({
            status: "false",
          });
        }

        // data[data.report_type] = data.id;

        const resultFix = await this.ReportService.store(data);

        if (!resultFix) {
          return res.json({
            status: "failed",
            message: "Ошибка",
          });
        }
      }

      return res.json({
        status: "success",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: "error",
        message: "Ошибка",
      });
    }
  };

  list = async (req, res) => {
    const datas = await this.ReportService.getAndLean();
    datas.reverse()
    res.render("profile/complaint/list", {
      layout: "profile",
      title: "Report",
      datas,
    });
  };
}

export default new ReportController();
