import { Joi } from "express-validation";

export const register = {
  body: Joi.object({
    tutor: Joi.string().email().required(),
    students: Joi.array().items(Joi.string().email()).required().min(1),
  }),
};

export const getCommonStudents = {
  query: Joi.object({
    tutor: Joi.alternatives().try(
      Joi.array().items(Joi.string().email()).required().min(1),
      Joi.string().email().required()
    ).required()
  })
}

export const suspendStudent = {
  body: Joi.object({
    student: Joi.string().email().required()
  })
}

export const retrieveNotifications = {
  body: Joi.object({
    tutor: Joi.string().email().required(),
    notification: Joi.string().required(),
  })
}