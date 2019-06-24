import { catchAsyncErrors } from "../errors/catch-async-error";
import UserController from "../controllers/user.controller";
import { verifyUserToken } from "../middlewares/verify-user-token";

export const userRouter = router => {
  router.route("/users/").get(catchAsyncErrors(UserController.getUsers));
  router
    .route("/users/profile")
    .get(verifyUserToken, catchAsyncErrors(UserController.getProfile));
  router
    .route("/users/profile")
    .post(verifyUserToken, catchAsyncErrors(UserController.updateProfile));
  router.route("/users/login").post(catchAsyncErrors(UserController.login));
  router
    .route("/users/register")
    .post(catchAsyncErrors(UserController.register));
  router
    .route("/users/change-password")
    .post(verifyUserToken, catchAsyncErrors(UserController.changePassword));
};
