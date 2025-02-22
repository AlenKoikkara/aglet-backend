const stripe = require("stripe")(process.env.STRIPE_KEY);
const { addOrder } = require("../controllers/orderController");

const placeorder_webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      if (checkoutSessionCompleted.status === "complete") {
        addOrder(checkoutSessionCompleted);
      }
      // Then define and call a function to handle the event checkout.session.completed
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = {
  placeorder_webhook,
};
