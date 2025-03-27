import { Router } from "express";
import servicesController from "../../../controllers/api/service/servicesController.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";

const serviceRouter = Router();

serviceRouter.post(
  "/register",
  newAuthJWT,
  async (req, res, next) => {
    const { serviceId, date, route } = req.body;
    console.log(serviceId, date,"serviceId && date");
    
    if (serviceId && date) {
      return next();
    } else {
      return res.status(403).send({ message: "INVALID DATA" });
    }
  },
  servicesController.registr
);

serviceRouter.get("/free/times", servicesController.freeTimes);

serviceRouter.post("/confirm", newAuthJWT, servicesController.confirm);

serviceRouter.post("/edite/register", servicesController.editeRegistr);

serviceRouter.post("/edite/register/user", servicesController.editRegisterUser);

serviceRouter.get("/near/:id", isEmpParamObjId, servicesController.near);

serviceRouter.delete("/delete/register", servicesController.deleteRegistr);

// serviceRouter.post("/confirm/pay", servicesController.confirmPay);

// serviceRouter.post("/edite",servicesController.editeService)

serviceRouter.get(
  "/registers/:companyId",
  newAuthJWT,
  servicesController.registers
);

serviceRouter.get("/my/registers", servicesController.myRegisters);

serviceRouter.post("/edit", servicesController.edite);

serviceRouter.get("/times/:id", servicesController.times);

export default serviceRouter;
