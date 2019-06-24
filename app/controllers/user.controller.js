import { User } from "../model/user";
import { appError } from "../errors/app.error";
var jwt = require("jsonwebtoken");
var bcryptjs = require("bcryptjs");

export default class UserController {
  static getUsers = async (req, res, next) => {
    const users = await User.find({});
    return res.json(users);
  };

  static getProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    return res.json(user);
  };

  static changePassword = async (req, res, next) => {
    let user = await User.findOne({ _id: req.user._id });
    const { password, newPassword } = req.body;
    const passwordIsValid = bcryptjs.compareSync(password, user.pass_hash);
    if (!passwordIsValid)
      throw appError("Mật khẩu hiện tại không chính xác!", 400);
    const salt = await bcryptjs.genSaltSync(10);
    const hash = await bcryptjs.hashSync(newPassword, salt);
    user = await user.update({
      pass_hash: hash,
      salt_key: salt
    });
    return res.json();
  };

  static register = async (req, res, next) => {
    let user = await User.findOne({ where: { username: req.body.mobile } });
    if (user) throw appError("Số điện thoại đã tồn tại!");
    var salt = await bcryptjs.genSaltSync(10);
    var hash = await bcryptjs.hashSync(req.body.password, salt);
    var body = {
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
      pass_hash: hash,
      salt_key: salt,
      avatar_url: req.body.avatar_url
    };
    user = await User.create(body);
    var token = jwt.sign(
      { _id: user._id, username: user.username, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );
    res.send({ token: token });
  };

  static login = async (req, res, next) => {
    let user = await User.findOne({ username: req.body.username });
    if (!user) throw appError("Tên đăng nhập hoặc mật khẩu không đúng!");
    var passwordIsValid = bcryptjs.compareSync(
      req.body.password,
      user.pass_hash
    );
    if (!passwordIsValid)
      throw appError("Tên đăng nhập hoặc mật khẩu không đúng!");
    var token = jwt.sign(
      { _id: user._id, username: user.username, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );
    res.send({ token: token });
  };

  static updateProfile = async (req, res, next) => {
    let user = await User.findById(req.user._id);
    const { email, name } = req.body;
    await user.update({
      email: email || user.email,
      name: name || user.name
    });
    user = await User.findById(req.user._id);
    return res.json(user);
  };
}
