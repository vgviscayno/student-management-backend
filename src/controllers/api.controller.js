import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudents from "../services/GetCommonStudents";
import SuspendStudent from "../services/SuspendStudent";
import RetrieveNotifications from "../services/RetrieveNotifications";

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

export const retrieveNotifications = async (req, res) => {
  try {
    //Find tutor, and if non-existent, return
    const tutors = await GetCommonStudents.findTutors([req.body.tutor])
    if(tutors.length === 0) {
      return errorResponse(req, res, 'Tutor not registered', 400);      
    }

    //Get emails of students that belong to tutor
    const studentsIds = await GetCommonStudents.getCommonStudentIds([tutors[0].id])
    const studentsEmails = await GetCommonStudents.getStudentsEmailsByIds(studentsIds)

    const service = new RetrieveNotifications(req.body)
    const recipients = await service.call(studentsEmails)
    return successResponse(req, res, { recipients }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}