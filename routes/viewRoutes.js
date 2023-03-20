const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/api", viewController.testFrontend);

module.exports = router;
