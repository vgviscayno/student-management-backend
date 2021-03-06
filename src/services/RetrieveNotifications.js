import Joi from "joi";
import { Op } from 'sequelize'
import { Student } from '../models/index'

class RetrieveNotifications {
  constructor(validatedArgs) {
    this.notification = validatedArgs.notification
  }

  async call(studentsEmails) {
    //Get students ids mentioned in notification
    const mentionedEmails = RetrieveNotifications.getEmailsFromString(this.notification)

    const allEmails = [...studentsEmails, mentionedEmails].filter((item, pos, self) => {
      return self.indexOf(item) === pos
    });

    const mentionedStudents = await RetrieveNotifications.findUnsuspendedStudentsByEmails(allEmails)

    const mentionedStudentsEmails = mentionedStudents.map(student => student.email)

    return mentionedStudentsEmails
  }

  static isEmail(string) {
    const result = Joi.string().email().validate(string)
    if(result.error) {
      return false;
    }

    return true;
  }

  static getEmailsFromString(string) {
    let emails = [];
    const tokens = string.split(" ")

    tokens.forEach(token => {
      if(token.charAt(0) === '@'){
        const mentioned = token.slice(1)
        if(RetrieveNotifications.isEmail(mentioned)){
          emails = [...emails, mentioned]
        }       
      }
    })

    //filter list for emails mentioned more than once
    return emails.filter((item, pos, self) => {
      return self.indexOf(item) === pos
    });
  }

  static async findUnsuspendedStudentsByEmails(emails) {
    //find students
    let students = await Student.findAll({
      where: {
        email: {
          [Op.or]: emails.map(email => email)
        },
        isSuspended: false
      },
      attributes: ['email']
    })
    
    //filter list of students
    students = students.filter(student => student !== null)

    return students
  }
}

module.exports = RetrieveNotifications