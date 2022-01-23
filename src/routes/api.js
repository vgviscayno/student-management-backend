import express from "express";

import { validate } from "express-validation";

import * as apiController from "../controllers/api.controller";
import * as apiValidator from "../controllers/api.validator";

const router = express.Router();
const keyByField = true

// api/register
router.post("/register", validate(apiValidator.register, { keyByField }), apiController.register);
router.get("/getcommonstudents",validate(apiValidator.getCommonStudents, {keyByField}), apiController.getCommonStudents);
router.post("/suspend", validate(apiValidator.suspendStudent, {keyByField}), apiController.suspendStudent);
router.post("/retrievenotifications", validate(apiValidator.retrieveNotifications, {keyByField}), apiController.retrieveNotifications);

module.exports = router;
