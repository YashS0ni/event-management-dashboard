import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { response } from 'express'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

// login route
const loginUser = async (req, res) => {
  try {
    const { email, password,name } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'user does not exists' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = createToken(user._id)
      res.json({ success: true, token,email,name, })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}
//signup route
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    // user exists or not
    const userExists = await userModel.findOne({ email })
    if (userExists) {
      return res.json({ success: false, message: 'user already exists' })
    }
    // validating email,strong pasword
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter strong password' })
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export { loginUser, registerUser}
