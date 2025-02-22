const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const placeOrder = async (req, res) => {
  let customerObj;
  try {

    const customer = await stripe.customers.search({
      query: `email:\'${req.body?.emailId}\'`,
    });
   
    const line_items = req.body?.order?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
            images: [item.imageUrl],
          },
          unit_amount: item.listPrice * 100,
        },
        quantity: item.count,
      };
    });
  
    customerObj = {
      customer_email: req.body?.emailId,
      line_items,
      metadata: {
        customerDb_id: req.body?.userId,
        cartId: req.body?.order._id
      },
      customer_creation: "always",
      mode: "payment",
      success_url: req.body?.success_url,
      cancel_url: req.body?.cancel_url,
    };
  
    if (customer.data[0]?.id) {
      customerObj["customer"] = customer.data[0].id;
      delete customerObj.customer_email;
      delete customerObj.customer_creation;
    }
    const session = await stripe.checkout.sessions.create(customerObj);
    res.send({ url: session.url });
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
};

const addOrder = async (checkoutObject) => {
  try {
    const item = await Cart.find({
      emailId: checkoutObject.customer_details.email,
    });
    const orderObj = {
      cartId: checkoutObject.metadata.cartId,
      userId: checkoutObject.metadata.customerDb_id,
      emailId: checkoutObject.customer_details.email,
      order: item[0]?.cart
    }
    const order = await Order.create(orderObj).catch((error) => {
      console.log(error.message);
    }).then(async () => {
      await Cart.deleteOne( {
        emailId: checkoutObject.customer_details.email,
      });
    })
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.find({ "emailId": req.params.id });
    if (!order) {
      return res.status(404).json({ error: "no orderfound" });
    }
    res.status(200).json(order);
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
};

module.exports = {
  placeOrder,
  getOrder,
  addOrder,
};
