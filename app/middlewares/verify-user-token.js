var jwt = require("jsonwebtoken");
import { appError } from "../errors/app.error";

export const verifyUserToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) next(appError("Unauthorized!", 401));
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw next(appError("Unauthorized!", 401));
  }
};
