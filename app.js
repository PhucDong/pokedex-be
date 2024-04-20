require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const DEFAULT_PORT = require("./src/app/config");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

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

app.listen(DEFAULT_PORT, () => {
  console.log("App is running");
});

module.exports = app;
