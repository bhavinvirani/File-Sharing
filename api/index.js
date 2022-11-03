const express = require("express");
const multer = require("multer"); // destination folder
const router = express.Router();
const fs = require("fs");
const { handleDownlode, uploadFile, renderHomePahe, renderAllFilePage, handleDelete } = require("../controller");


var multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  // File names
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },  
});


const upload = multer({
  dest: "uploads",
});

router.get("/", renderHomePahe);
router.get("/allfiles", renderAllFilePage);
router.post("/upload", upload.single("file"), uploadFile);
router.get("/file/:id", handleDownlode); // without password
router.post("/file/:id", handleDownlode); // with password
router.get("/delete/:id", handleDelete);  // without password
router.post("/delete/:id", handleDelete); // with password

module.exports = router;
