import { Router } from "express";
import expressWs from "express-ws";
const wsRoutes = Router();
import NotificationController from "../controllers/ws/NotificationController.js"
expressWs(wsRoutes)

wsRoutes.ws('/notification/:id',NotificationController.index);

export {wsRoutes};