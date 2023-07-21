require("dotenv").config({ path: "./.env"});
const express = require("express");
var bodyParser = require('body-parser');

const app = express();
const connectDB = require("./DB/connect");
const router = require("./api/index");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use("/", router);

const port = 8081 || process.env.PORT;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
  