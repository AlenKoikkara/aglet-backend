const express = require("express");

const { placeOrder, getOrder } = require("../controllers/orderController");
const router = express.Router();

router.post("/placeorder/:id", placeOrder);
router.get("/getorder/:id", getOrder);


module.exports = router;
