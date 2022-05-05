import User from "./User.js";
import Exam from "./Exam.js";

class Supervisor extends User {
  constructor(firstName, lastName, phoneNumber, emailId, userName, password) {
    super(
      firstName,
      lastName,
      phoneNumber,
      emailId,
      userName,
      password,
      true,
      false
    );
    this.examsCreated = [];
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
      examsCreated: this.examsCreated,
    };
  };
}

export default Supervisor;