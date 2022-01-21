import {Tutor, Student, Tutors_Students} from '../models/index'

class RegisterStudents {
  constructor(validatedArgs) {
    this.tutorEmail = validatedArgs.tutor;
    this.studentsEmails = validatedArgs.students;
  }

  async call() {
    /* TODO: Implementation */
    const tutor = await this.createTutor(this.tutorEmail)
    const students = await Promise.all(this.studentsEmails.map(async (email) => {
      return await this.createStudent(email)
    }))

    await Promise.all(students.map(async (student) => {
      return await this.createTutorStudentAssociation(tutor.id, student.id)
    }))
  }

  async createTutor(tutorEmail) {
    const tutorAttributes = {email: tutorEmail}

    //Find and return existing
    let tutor = await Tutor.findOne({where: tutorAttributes})
    if (tutor != null) {
      return tutor;
    }

    //Create new
    return await Tutor.create(tutorAttributes)
  }

  async createStudent(studentEmail) {
    const studentAttributes = {email: studentEmail}

    //Find and return existing
    let student = await Student.findOne({where: studentAttributes})
    if (student != null) {
      return student;
    }

    //Create new
    return await Student.create(studentAttributes)
  }

  async createTutorStudentAssociation(tutorId, studentId) {
    const associationAttributes = {tutor_id: tutorId, student_id: studentId}

    //Find and return existing
    let association = await Tutors_Students.findOne({where: associationAttributes})
    if (association != null) {
      return association;
    }

    //Create new
    return await Tutors_Students.create(associationAttributes)
  }
}

module.exports = RegisterStudents;
