const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token.model')
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

      const tokens = await UserService.login(email, password, next)

      res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true});
      res.send({
        data: {
          accessToken: tokens.accessToken,
        },
        success: true
      })
    } catch (error) {
      next(errorsGenerator.checkErrorType(error))
    }
  }

  logout = async (req, res, next) => {
    try {
      const user = req.user

      await TokenModel.findOneAndDelete({userId: user._id})

      res.cookie('refreshToken', undefined, {httpOnly: true});
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

      const tokes = await UserService.registration(email, password)

      res.cookie('refreshToken', tokes.refreshToken, {httpOnly: true});
      res.status(200).send({
        data: {
          accessToken: tokes.accessToken
        },
        success: true
      })
    } catch (error) {
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

        return res.status(200).send({
          data: {
            accessToken,
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
