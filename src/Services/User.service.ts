import * as bcrypt from 'bcrypt'
import jwt from"jsonwebtoken"
import UserModel from"../models/User.model"
import {errorTypes} from"../utils/error-generator"
import UserDto from"../dtos/User.dto"
import TokenModel from"../models/Token.model"

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
      email,
      balance: user.balance,
    }

    const accessToken = this._generateAccessToken(new UserDto(userData))
    const refreshToken = this._generateRefreshToken(new UserDto(userData))

    const updatedTokens: any = await TokenModel.findOneAndUpdate({userId: user._id}, {
      $set: {
        accessToken,
        refreshToken
      }
    }, {upsert: true, new: true});

    const {exp: expiredIn} = await jwt.decode(accessToken)

    return {
      tokens: {
        ...updatedTokens._doc,
        expiredIn
      },
      user: new UserDto(userData)
    }
  }

  registration = async (email, password) => {
    const isUserWithSameEmailExist = !!(await UserModel.findOne({email}))
    if (isUserWithSameEmailExist) {
      throw Error(`${errorTypes.AUTHENTICATE} User with same email already exist!`)
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

    const createdTokens: any = await TokenModel.create({userId: user._id, accessToken, refreshToken})
    const {exp: expiredIn} = await jwt.decode(accessToken)

    return {
      tokens: {
        ...createdTokens._doc,
        expiredIn
      },
      user: new UserDto(user)
    }
  }

  getUserData = async (userId) => {
    return UserModel.findById(userId)
  }

  _generateAccessToken = (user) => {
    return jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3h'})
  }

  _generateRefreshToken = (user) => {
    return jwt.sign({...user}, process.env.REFRESH_TOKEN_SECRET)
  }
}

export default new UserService();
