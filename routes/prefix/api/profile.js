import { Router } from "express";
import ProfileController from "../../../controllers/api/user/ProfileController.js";
import {
  empObj,
  empFiles,
  empAvatarFile,
} from "../../../middlewares/isEmpty.js";
import {
  updatePhoneNumber,
  updatePhoneNumberConfirm,
  storeFavoriteCategory,
  notificationsList,
} from "../../../middlewares/validate/api/auth-validation.js";
import { updateProfile } from "../../../middlewares/validate/api/auth-validation.js";
import newAuthJWT from "../../../middlewares/newAuthJWT.js";

const profileRoutes = Router();

profileRoutes.get("/", newAuthJWT, ProfileController.index);

profileRoutes.put("/user/edit", ProfileController.userEdit);

profileRoutes.delete("/destroy", newAuthJWT, ProfileController.destroy);

profileRoutes.put("/update", ProfileController.update);

profileRoutes.patch(
  "/avatar/update",
  empFiles,
  empAvatarFile,
  ProfileController.updateAvatar
);

profileRoutes.post(
  "/phone_number/update",
  updatePhoneNumber,
  ProfileController.updatePhoneNumber
);

profileRoutes.post(
  "/phone_number/update/confirm",
  updatePhoneNumberConfirm,
  ProfileController.updatePhoneNumberConfirm
);

profileRoutes.get(
  "/favorite_categories",
  ProfileController.getFavoriteCategory
);

profileRoutes.post(
  "/favorite_categories",
  storeFavoriteCategory,
  ProfileController.storeFavoriteCategory
);

profileRoutes.delete(
  "/favorite_categories",
  storeFavoriteCategory,
  ProfileController.destroyFavoriteCategory
);

profileRoutes.get("/list_of_notifications", ProfileController.getNotification);

profileRoutes.post(
  "/list_of_notifications",
  notificationsList,
  ProfileController.storeNotification
);

profileRoutes.delete(
  "/list_of_notifications",
  notificationsList,
  ProfileController.destroyNotification
);

export { profileRoutes };
