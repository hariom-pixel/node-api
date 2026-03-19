const userService = require('../services/userService')
const { registerSchema } = require('../validators/userValidator')

// 🔹 Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers(req.query)
    res.json(users)
  } catch (error) {
    next(error)
  }
}

// 🔹 Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message })
    }
    next(error)
  }
}

// 🔹 Register user
exports.registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const user = await userService.registerUser(req.body)

    res.status(201).json({
      message: 'User registered',
      ...user,
    })
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message })
    }
    next(error)
  }
}

// 🔹 Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message })
    }
    next(error)
  }
}

// 🔹 Update user
exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    res.json(user)
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message })
    }
    next(error)
  }
}

// 🔹 Login
exports.loginUser = async (req, res, next) => {
  try {
    const tokens = await userService.loginUser(req.body)
    res.json(tokens)
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(400).json({ message: error.message })
    }
    next(error)
  }
}

// 🔹 Logout
exports.logoutUser = async (req, res, next) => {
  try {
    await userService.logoutUser(req.user.id)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

// 🔹 Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.body.refreshToken)
    res.json(result)
  } catch (error) {
    return res.status(403).json({ message: error.message })
  }
}

exports.uploadProfileImage = async (req, res, next) => {
  try {
    const user = await userService.uploadProfileImage(req.params.id, req.file)

    res.json({
      message: 'Image uploaded',
      profileImage: user.profileImage,
    })
  } catch (error) {
    next(error)
  }
}
