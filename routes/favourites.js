const express = require("express");

const { toggleFav, getFav } = require("../controllers/favController");
const router = express.Router();

router.post("/togglefavourite", toggleFav);
router.get("/getfavourites/:id", getFav);


module.exports = router;
