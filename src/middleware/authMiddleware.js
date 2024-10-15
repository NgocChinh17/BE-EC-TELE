const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("../models/UserModel")
dotenv.config()

const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1]
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(404).json({
        message: "the authentication",
        status: "ERROR",
      })
    }
    if (user?.isAdmin) {
      next()
    } else {
      return res.status(404).json({
        message: "the authentication",
        status: "ERROR",
      })
    }
  })
}

const authUserMiddleware = async (req, res, next) => {
  const token = req.headers.token.split(" ")[1]
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN)
    const userInfo = await User.findById(user.id)
    if (!userInfo) {
      return res.status(404).json({
        message: "not fond info",
      })
    }
    if (userInfo.isAdmin !== user.isAdmin) {
      return res.status(404).json({
        message: "fail validation",
      })
    }
    next()
  } catch (error) {
    console.log("error", error)
    next(error)
  }
  // const userId = req.params.id
  // jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
  //   if (err) {
  //     return res.status(404).json({
  //       message: "the authentication",
  //       status: "ERROR",
  //     })
  //   }
  //   if (user?.isAdmin || user?.id === userId) {
  //     next()
  //   } else {
  //     return res.status(404).json({
  //       message: "the authentication",
  //       status: "ERROR",
  //     })
  //   }
  // })
}

module.exports = {
  authMiddleware,
  authUserMiddleware,
}
