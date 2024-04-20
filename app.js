require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch when when request match no route
app.use((req, res, next) => {
  const exception = new Error("URL not found. Resources are unavailable");
  exception.statusCode = 404;
  next(exception);
});

// Express error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
