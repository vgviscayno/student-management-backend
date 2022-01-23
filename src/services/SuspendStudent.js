import {Student} from '../models/index'

class SuspendStudent {
    constructor(validatedArgs) {
        this.email = validatedArgs.student
    }

    async call() {
        const student = await Student.findOne({where:{email:this.email}})
        if(student === null) {
            throw {
                name: 'NonExistentStudent',
                message: "Student not registered"
            }
        }

        student.isSuspended = true;

        await student.save()
    }
}

module.exports = SuspendStudent