const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const {errorTypes} = require("../utils/error-generator");
const UserDto = require("../dtos/User.dto");
const TokenModel = require("../models/Token.model");

class UserService {
  login = async (email, password) => {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw Error(`${errorTypes.AUTHENTICATE} User does not exist!`)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw Error(`${errorTypes.AUTHENTICATE} Incorrect password!`)
    }

    const userData = {
      _id: user._id,
      email
    }

    const accessToken = this._generateAccessToken(new UserDto(userData))
    const refreshToken = this._generateRefreshToken(new UserDto(userData))
    return TokenModel.findOneAndUpdate({userId: user._id}, {
      $set: {
        accessToken,
        refreshToken
      }
    }, {upsert: true, new: true})
  }

  registration = async (email, password) => {
    const isUserWithSameEmailExist = !!(await UserModel.findOne({email}))
    if (isUserWithSameEmailExist) {
      throw Error(`${errorTypes.VALIDATION} User with same email already exist!`)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      balance: 1000,
      bets: []
    })

    const accessToken = this._generateAccessToken(new UserDto(user))
    const refreshToken = this._generateRefreshToken(new UserDto(user))

    return TokenModel.create({userId: user._id, accessToken, refreshToken})
  }

  _generateAccessToken = (user) => {
    return jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
  }

  _generateRefreshToken = (user) => {
    return jwt.sign({...user}, process.env.REFRESH_TOKEN_SECRET)
  }
}

module.exports = new UserService();
