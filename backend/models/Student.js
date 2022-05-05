import Exam from "./Exam.js";
import User from "./User.js";

class Student extends User {
  constructor(firstName, lastName, phoneNumber, emailId, userName, password) {
    super(
      firstName,
      lastName,
      phoneNumber,
      emailId,
      userName,
      password,
      false,
      true
    );
    this.examsEnrolled = [];
  }
  toJSON = () => {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      emailId: this.emailId,
      password: this.password,
      phoneNumber: this.phoneNumber,
      isSupervisor: this.isSupervisor,
      isStudent: this.isStudent,
      isAdmin: this.isAdmin,
      examsEnrolled: this.examsEnrolled,
    };
  };
}

export default Student;