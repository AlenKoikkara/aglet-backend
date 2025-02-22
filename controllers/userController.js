const User = require('../models/userModel')
const mongoose = require('mongoose')

const getUser = async(req, res) => {
  try {
    const user = await User.findOne({userId: req.params.id});
    if (!user) {
      return res.status(404).json({ error: "no user" });
    }
    res.status(200).json(user)
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

const addUser = async(req, res) => {
  try {
    const userObject = {
      userId: req.params.id,
      emailId: req.query.emailId
    }
    await User.create(userObject).then((user) => {
      res.status(200).json(user)
    })
    .catch((error) => {
      res.status(404).json({error: "User already exists"})
    });
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

module.exports = {
  getUser,
  addUser
}