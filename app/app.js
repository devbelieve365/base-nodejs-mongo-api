var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
import http from "http";
var mongoose = require("mongoose");
require("dotenv").config();
import v1 from "./routes/v1";
import { initBaseData } from "./seeds/seeds";

var app = express();
const server = http.createServer(app);
let port = process.env.PORT || 7001;

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", err => {
  console.log(err);
  console.log("---FAILED to connect to mongoose");
});
db.once("open", () => {
  initBaseData();
  console.log("+++Connected to mongoose");
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
  // allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // request methods allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const router = express.Router();
v1(router);
app.use("/api/v1", router);

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json({ error: err.message });
});

server.listen(port, async () => {
  console.log("Server is running port " + port);
});
