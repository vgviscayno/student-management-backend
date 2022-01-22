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

    const [tutor] = await Tutor.findOrCreate({
      where: tutorAttributes
    });

    return tutor;
  }

  async createStudent(studentEmail) {
    const studentAttributes = {email: studentEmail}

    const [student] = await Student.findOrCreate({
      where: studentAttributes
    });

    return student;
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
