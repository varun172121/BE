class User {
  constructor(
    firstName,
    lastName,
    phoneNumber,
    emailId,
    userName,
    password,
    isSupervisor,
    isStudent
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailId = emailId;
    this.password = password;
    this.phoneNumber = parseInt(phoneNumber);
    this.isSupervisor = Boolean(isSupervisor);
    this.isStudent = Boolean(isStudent);
    this.isAdmin = Boolean(false);
    // this.phoneNumber = parseInt(phoneNumber)

    this.userName = userName;
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
    };
  };
}
export default User;