const express = require("express");

const { placeorder_webhook } = require("../webhooks/webhookController");
const router = express.Router();

router.post(
  "/place_order",
  express.raw({ type: "application/json" }),
  placeorder_webhook
);

module.exports = router;
