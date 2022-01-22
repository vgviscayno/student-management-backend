import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudents from "../services/GetCommonStudents";

export const register = async (req, res) => {
  try {
    const service = new RegisterStudents(req.body);
    await service.call();
    return successResponse(req, res, {}, 204);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getCommonStudents = async (req, res) => {
  try {
    const service = new GetCommonStudents(req.query)
    const students = await service.call()
    return successResponse(req, res, {students}, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}