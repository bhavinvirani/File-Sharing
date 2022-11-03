const fs = require("fs"); //Load the filesystem module
const bcrypt = require("bcrypt");
const File = require("../models/file");
const { default: convertSize } = require("convert-size");

/* Render Home page */
const renderHomePahe = async (req, res) => {
  res.render("index");
};
const renderAllFilePage = async (req, res) => {
  const allFiles = await File.find();
  res.render("allfiles", {
    allFiles,
  });
};

/*  */
const handleDownlode = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    res.render("index", { error: true, message: "No such files in db" });
    return;
  }

  // if password in file
  if (file.password != null) {
    // No password provided
    if (req.body.password == null) {
      res.render("password", { button: "Downlode" });
      return;
    }
    // compare pswords and not same
    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  file.downloadCount++;
  await file.save();
  console.info(file.downloadCount);

  res.download(file.path, file.originalName);
};

const uploadFile = async (req, res) => {
  /* size check */
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  const stats = await fs.statSync(fileData.path);
  const maxSize = 1000000;
  const path =
    __dirname.substring(0, __dirname.length - 11) + "/" + req.file.path;
  fileData.size = convertSize(stats.size, { lowerCase: true });
  if (stats.size > maxSize) {
    fs.unlink(path, function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
    res.render("index", { error: true, message: "Please select smaller file" });
    return;
  }

  /* Type check */
  const fileFormate =
    req.file.mimetype.split("/")[1] === "pdf" ||
    req.file.mimetype.split("/")[1] === "jpeg";

  if (!fileFormate) {
    fs.unlink(path, function (err) {
      if (err && err.code == "ENOENT") {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
    res.render("index", {
      error: true,
      message: "Select only PDF or JPEG files",
    });
    return;
  }
  fileData.type = req.file.mimetype.split("/")[1];

  /* password */
  if (req.body.password !== null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }
  const file = await File.create(fileData);
  res.render("index", { filelink: `${req.headers.origin}/file/${file._id}` });
};

const handleDelete = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) {
    res.render("index", { error: true, message: "No such files in db" });
    return;
  }

  // if password in file
  if (file.password != null) {

    // No password provided
    if (req.body.password == null) {
      res.render("password", { button: "Delete" });
      return;
    }
    // compare psswords and not same
    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true, button: "Delete" });
      return;
    }
  }

  await File.deleteOne({ _id: file._id });
  const allFiles = await File.find();

  res.render("allfiles", {
    allFiles,
  });
};

module.exports = {
  handleDownlode,
  uploadFile,
  renderHomePahe,
  renderAllFilePage,
  handleDelete,
};
