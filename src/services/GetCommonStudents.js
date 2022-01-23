import {Tutor, Student, Tutors_Students} from '../models/index'
import { Op } from 'sequelize'

class GetCommonStudents {
  constructor(validatedArgs) {
    this.setTutorsEmails(validatedArgs.tutor)
  }

  setTutorsEmails(tutorsEmails) {
    if(tutorsEmails.constructor === Array){
      this.tutorsEmails = [...tutorsEmails]
    } else {
      this.tutorsEmails = [tutorsEmails]
    }
  }

  async call() {
    /* TODO: Implementation */
    const tutors = await GetCommonStudents.findTutors(this.tutorsEmails)
    if(tutors.length === 0) {
      return []
    }
    const studentsIds = await this.findStudentsIds(tutors)

    return await GetCommonStudents.getStudentsEmailsByIds(studentsIds)
  }

  static async findTutors(emails) {
    //find tutors
    let tutors = await Tutor.findAll({
      where: {
        [Op.or]: emails.map(email => ({email}))
      },
      attributes: ['id']
    })

    //filter list of tutors
    tutors = tutors.filter(tutor => tutor !== null)

    return tutors
  }

  getTutorIds(tutors) {
    const tutorIds = tutors.map(tutor => tutor.id)
    return tutorIds
  }

  static async getCommonStudentIds (tutorIds) {
    //Query tutors_students table (association table)
    const tutors_students = await Tutors_Students.findAll({
      where: {
        [Op.or]: tutorIds.map(id => ({tutor_id: id}))
      }
    })

    const commonStudentsIds = tutors_students.map(entity => {
      return entity.student_id
    }).filter((item, pos, self) => {
      return self.indexOf(item) === pos
    })

    return commonStudentsIds
  }

  async findStudentsIds(tutors) {
    const tutorIds = this.getTutorIds(tutors)

    return GetCommonStudents.getCommonStudentIds(tutorIds)
  }

  static async getStudentsEmailsByIds(studentsIds) {
    const studentsEmails = (await Promise.all(studentsIds.map(async (id) => {
      return await Student.findByPk(id)
    }))).map(student => student.email)


    return studentsEmails
  }
}

module.exports = GetCommonStudents;
