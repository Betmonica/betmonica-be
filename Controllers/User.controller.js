const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token.model')
const UserModel = require('../models/User.model')
const UserService = require('../Services/User.service')
const {errorsGenerator, errorTypes} = require("../utils/error-generator");
const UserDto = require("../dtos/User.dto");

class UserController {
  login = async (req, res, next) => {
    try {
      const {email, password} = req.body

      if (!email) {
        throw Error(`${errorTypes.VALIDATION} Miss "email" field!`)
      }

      if (!password) {
        throw Error(`${errorTypes.VALIDATION} Miss "password" field!`)
      }

      const {tokens, user} = await UserService.login(email, password, next)

      res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});
      res.send({
        data: {
          tokenData: {
            accessToken: tokens.accessToken,
            expiredIn: tokens.expiredIn,
          },
          user: user
        },
        success: true
      })
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies['refreshToken']

      if (!refreshToken) {
        throw Error(`${errorTypes.VALIDATION} Refresh token does not exist!`)
      }

      await TokenModel.findOneAndDelete({refreshToken})

      res.clearCookie('refreshToken');
      res.status(200).send({
        data: {},
        success: true
      })
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  registration = async (req, res, next) => {
    try {
      const {email, password} = req.body

      if (!email) {
        throw Error(`${errorTypes.VALIDATION} Miss "email" field!`)
      }

      if (!password) {
        throw Error(`${errorTypes.VALIDATION} Miss "password" field!`)
      }

      const {tokens, user} = await UserService.registration(email, password)

      res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});
      res.status(200).send({
        data: {
          tokenData: {
            accessToken: tokens.accessToken,
            expiredIn: tokens.expiredIn,
          },
          user: user
        },
        success: true
      })
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  getBalance = async (req, res, next) => {
    try {
      const {_id} = req.user

      const user = await UserModel.findById(_id);

      res.status(200).send({
        data: {
          balance: user.balance
        },
        success: true
      })
    } catch (err) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  token = async (req, res, next) => {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw Error(`${errorTypes.AUTHENTICATE} Refresh token does not exist!`)
      }

      const tokens = await TokenModel.findOne({refreshToken})
      if (!tokens) {
        throw Error(`${errorTypes.AUTHENTICATE} Refresh token invalid!`)
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
          throw Error(`${errorTypes.AUTHENTICATE} Refresh token invalid!`)
        }

        const accessToken = this._generateAccessToken(new UserDto(user))

        tokens.accessToken = accessToken;
        await tokens.save()

        const {exp: expiredIn} = await jwt.decode(accessToken)
        return res.status(200).send({
          data: {
            accessToken,
            expiredIn
          },
          success: true
        })
      })
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  _generateAccessToken = (user) => {
    return jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
  }
}

module.exports = new UserController();
