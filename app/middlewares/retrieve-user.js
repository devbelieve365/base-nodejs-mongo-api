var jwt = require("jsonwebtoken");
import User from "../model/user";

export const retrieveUser = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) return next();
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    const user = await User.findById(req.userId);
    req.user = user;
    next();
  } catch (err) {
    next();
  }
};
