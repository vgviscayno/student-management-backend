import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudents from "../services/GetCommonStudents";
import SuspendStudent from "../services/SuspendStudent";

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

export const suspendStudent = async (req, res) => {
  try {
    const service = new SuspendStudent(req.body)
    await service.call()
    return successResponse(req, res, {}, 204);
  } catch (error) {
    if (error.name === 'NonExistentStudent') {
      return errorResponse(req, res, error.message, 400);      
    }
    return errorResponse(req, res, error.message);
  }
}