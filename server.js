const dotenv = require("dotenv");
const express = require("express");
const connectDb = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

const app = express();
//express json
app.use(express.json());

const router = require("./routes/index");
//dotenv config
dotenv.config({
  path: "./config/env/config.env",
});
//database Connection
connectDb();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App started on PORT: ${PORT}`);
});
//router Middleware
app.use("/api/v2", router);
//error handler
app.use(customErrorHandler);

//static files path
app.use(express.static(path.join(__dirname, "public")));
