var express = require("express");
var multer = require("multer");
var router = express.Router();
var upload = multer();

const article = require("../controller/article.controller");

router.post("/store", [upload.none()], article.store);
router.get("/lists", [upload.none()], article.lists);
router.get("/info", [upload.none()], article.info);
router.post("/update", [upload.none()], article.update);
router.post("/destroy", [upload.none()], article.destroy);

module.exports = router;
