require("dotenv").config();
const express = require("express");
var bodyParser = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: true }));
const connectDB = require("./DB/connect");
const router = require("./api/index");

connectDB();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/", router);

const port = 8080 || process.env.PORT;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
  