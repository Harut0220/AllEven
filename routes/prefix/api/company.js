import { Router } from "express";
import companyController from "../../../controllers/api/company/companyController.js";
import { isEmpParamObjId } from "../../../middlewares/isEmpty.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";
import { company } from "../../../middlewares/validate/api/company.js";

const companyRoutes = Router();

companyRoutes.get("/my_favorites", newAuthJWT, companyController.myFavorites);

companyRoutes.get("/getCategories", companyController.getCategory);

companyRoutes.get("/days", companyController.days);

companyRoutes.get("/singl/:id", isEmpParamObjId, companyController.singl);

companyRoutes.get("/single", companyController.single);

companyRoutes.get("/near/:id", isEmpParamObjId, companyController.near);

companyRoutes.get("/radius", companyController.radius); //kilometer motikic heru

// companyRoutes.get("/my/company",newAuthJWT, companyController.getMy);

companyRoutes.get("/popular", companyController.popular);

companyRoutes.get("/page", companyController.index); //for admin

// companyRoutes.put("/edite", companyController.editeCompany);

companyRoutes.post("/add", newAuthJWT, company, companyController.addCompany);

companyRoutes.post(
  "/notif/opportunity",
  newAuthJWT,
  companyController.opportunity
);

companyRoutes.post("/online/pay", newAuthJWT, companyController.online);

// companyRoutes.post("/confirm", companyController.confirm);

companyRoutes.post("/add/service", companyController.addService);

// companyRoutes.post("/delete/service", companyController.deleteService);

// companyRoutes.get("/documents",companyController.documents)

companyRoutes.get("/allCompanies", companyController.getCompanys); //kilometer motikic heru

companyRoutes.post("/like", newAuthJWT, companyController.like);

companyRoutes.delete("/delete/service/:id", companyController.deleteService);

companyRoutes.post("/add/comment", newAuthJWT, companyController.addCommets);

companyRoutes.post(
  "/comment/delete",
  newAuthJWT,
  companyController.commentDelete
);

companyRoutes.post("/comment/like", newAuthJWT, companyController.commentLike);

companyRoutes.post(
  "/comment/answer",
  newAuthJWT,
  companyController.commentAnswer
);

companyRoutes.post(
  "/comment/answer/delete",
  newAuthJWT,
  companyController.commentAnswerLike
);

companyRoutes.post(
  "/comment/answer/like",
  newAuthJWT,
  companyController.commentAnswerLike
);

companyRoutes.post("/rating", newAuthJWT, companyController.rating);

companyRoutes.post("/add/favorite", newAuthJWT, companyController.addFavorites);

companyRoutes.delete(
  "/delete/:id",
  isEmpParamObjId,
  companyController.deleteCompany
);

companyRoutes.post(
  "/impression-images/store",
  companyController.impressionImagesStore
);

companyRoutes.post("/edit", companyController.companyEdit);

companyRoutes.post("/add/image", companyController.addImage);

companyRoutes.post("/add/hot/deals", newAuthJWT, companyController.addHotDeals);

companyRoutes.post(
  "/deal/register",
  newAuthJWT,
  companyController.deatRegister
);

companyRoutes.post(
  "/service/update",
  newAuthJWT,
  companyController.serviceUpdate
);

companyRoutes.get("/get/hot/deals", companyController.getHotDeals);

companyRoutes.get(
  "/my/participant",
  newAuthJWT,
  companyController.myparticipant
);

companyRoutes.get(
  "/my/company/impressions",
  newAuthJWT,
  companyController.myCompanyImpressions
);

companyRoutes.get(
  "/my/impressions",
  newAuthJWT,
  companyController.myImpressions
);
// companyRoutes.get( "/deal/register/:id", isEmpParamObjId, companyController.dealsRegisters);

export default companyRoutes;
