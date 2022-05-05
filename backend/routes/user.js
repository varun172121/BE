import { Router } from "express";
import { userExists,userExistsFunction} from "../helpers/users.js";
import {
  login,
  registerStudent,
  registerSupervisor,
  logout,
  refreshToken,
  emailverify,
  forgotpassword,
  resetpassword,

  changeprofilepassword
} from "../controllers/user.js";
import * as auth from "../helpers/auth.js"
const router = Router();

router.post("/register-student", userExistsFunction, registerStudent);
router.post("/register-supervisor", userExistsFunction, registerSupervisor);
router.post("/login", userExists, login);
router.post("/logout",auth.Token, logout);
router.post("/refreshToken",auth.Token, refreshToken)
router.get("/emailverifivation",emailverify)
router.get("/forgotpassword", userExistsFunction,forgotpassword)
router.get("/resetpassword",resetpassword)
router.post("/change-password",auth.Token,auth.userExistsMiddleWare,changeprofilepassword);



// router.put("/update-supervisor",registerSupervisor)
// router.put("/update-student",registerStudent)
// router.post("/login-supervisor",userExists,loginSupervisor)

export const routes = router;
