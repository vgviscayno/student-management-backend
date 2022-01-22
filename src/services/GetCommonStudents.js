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
    const tutors = await this.findTutors(this.tutorsEmails)
    if(tutors.length === 0) {
      return []
    }
    const studentsIds = await this.findStudentsIds(tutors)

    return await this.getStudentsEmails(studentsIds)
  }

  async findTutors(emails) {
    //find tutors
    let tutors = await Promise.all(emails.map(async (email) => {
      return await Tutor.findOne({
        where: {email},
        attributes:['id']
      })
    }))

    //filter list of tutors
    tutors = tutors.filter(tutor => tutor !== null)

    return tutors
  }

  getTutorIds(tutors) {
    const tutorIds = tutors.map(tutor => tutor.id)
    return tutorIds
  }

  async getCommonStudentIds (tutorIds) {
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

    return this.getCommonStudentIds(tutorIds)

    
  }

  async getStudentsEmails(studentsIds) {
    const studentsEmails = (await Promise.all(studentsIds.map(async (id) => {
      return await Student.findByPk(id)
    }))).map(student => student.email)


    return studentsEmails
  }
}

module.exports = GetCommonStudents;
