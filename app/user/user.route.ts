import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

router
  .get("/admin", userController.getAllUser)
  .get("/me", roleAuth(["USER", "ADMIN"]), userController.getUserInfo)
  .get("/:id", userController.getUserById)
  .delete("/:id", userController.deleteUser)
  .post("/", userValidator.createUser, catchError, userController.createUser)
  .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
  .patch("/:id", userValidator.editUser, catchError, userController.editUser)
  .post(
    "/register",
    userValidator.createUser,
    catchError,
    userController.createUser
  )
  .post(
    "/invite",
    userValidator.verifyEmail,
    catchError,
    userController.inviteUser
  )
  .post(
    "/verify-invitation",
    userValidator.verifyInvitation,
    catchError,
    userController.verifyInvitation
  )
  .post(
    "/reset-password",
    userValidator.verifyInvitation,
    catchError,
    userController.resetPassword
  )
  .post(
    "/forgot-password",
    userValidator.forgotPassword,
    catchError,
    userController.requestResetPassword
  )
  .post(
    "/change-password",
    roleAuth(["USER"]),
    userValidator.changePassword,
    catchError,
    userController.changePassword
  )
  .post(
    "/login",
    userValidator.login,
    catchError,
    passport.authenticate("login", { session: false }),
    userController.login
  )
  .post(
    "/refresh-token",
    userValidator.refreshToken,
    catchError,
    userController.refreshToken
  )
  .post("/logout", roleAuth(["USER", "ADMIN"]), userController.logout);

export default router;
