
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js';

import transporter from '../config/nodeMailer.js';

export const register = async (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }

  try {

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to CheelCompanyLtd.",
      text: `Hi ${user.name}, \n\nWelcome to our app! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out. \n\nBest regards, \nThe Team. Your account has been created with email: ${email}`
    }

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: "User Registered Successfully" })

  } catch (error) {
    return res.json({ success: false, message: error.message })

  }

}

export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are required"
    })
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ success: true, message: "Logged in Successfully" })

  } catch (error) {

    return res.json({
      success: false, message: error.message
    })

  }

}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? "none" : "strict",
      sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
    })

    return res.json({ success: true, message: "Logged out successfully" })

  } catch (error) {

    return res.json({ success: false, message: error.message })

  }
}

// send verification otp to user email
export const sendVerifyOtp = async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await userModel.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "Account already verified" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to CheelCompanyLtd. Please verify your account",
      text: `Hi ${user.name}, \n\nYour OTP for account verification is ${otp}. It will expire in 24 hours. If you did not request this, please ignore this email. \n\nBest regards, \nCheel Team.`,
    }

    await transporter.sendMail(mailOption)

    res.json({ success: true, message: "OTP sent to your email for account verification" })




  } catch (error) {
    return res.json({ success: false, message: error.message })

  }

}

export const verifyEmail = async (req, res) => {
  // const { userId, otp } = req.body;

  const userId = req.user.id;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "UserId and OTP are required" });
  }

  try {

    const user = await userModel.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });

    }

    if (user.verifyOtpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired, Please request for new OTP" });

    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpiry = 0;

    await user.save();

    res.json({ success: true, message: "Account verified successfully" })

  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
}


export const isAuthenticated = async (req, res) => {

  try {
    return res.json({ success: true, message: "User is authenticated" })

  } catch (error) {
    res.json({ success: false, message: error.message })

  }
}

export const sendResetOtp = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" })
  }

  try {
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Hi ${user.name}, \n\nYour OTP for password reset is ${otp}. It will expire in 15 minutes. If you did not request this, please ignore this email. \n\nBest regards, \nThe Team.`,
    }

    await transporter.sendMail(mailOption)

    res.json({ success: true, message: "OTP sent to your email for password reset" })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP and new password are required" })

  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" })
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired, Please request for new OTP" })

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiry = 0;

    await user.save();

    return res.json({ success: true, message: "Password reset successfully" })


  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
}