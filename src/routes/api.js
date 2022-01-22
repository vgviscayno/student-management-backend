import express from "express";

import { validate } from "express-validation";

import * as apiController from "../controllers/api.controller";
import * as apiValidator from "../controllers/api.validator";

const router = express.Router();

// api/register
router.post("/register", validate(apiValidator.register, { keyByField: true }), apiController.register);
router.get("/getcommonstudents",validate(apiValidator.getCommonStudents, {keyByField: true}), apiController.getCommonStudents);
router.post("/suspend", validate(apiValidator.suspendStudent, {keyByField: true}), apiController.suspendStudent);

module.exports = router;
