const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')
const logger = require('../utils/logger')
const { client } = require('../config/redis')
const { clearUsersCache } = require('../utils/cache')
const emailQueue = require('../queues/emailQueue')

exports.getUsers = async (queryParams) => {
  const cacheKey = `users:${JSON.stringify(queryParams)}`

  // Check cache first
  const cachedData = await client.get(cacheKey)

  if (cachedData) {
    logger.info('⚡ Cache HIT')
    return JSON.parse(cachedData)
  }

  logger.info('🐢 Cache MISS → Fetching from DB')

  // Your existing logic
  const page = parseInt(queryParams.page) || 1
  const limit = parseInt(queryParams.limit) || 5
  const skip = (page - 1) * limit

  const search = queryParams.search || ''
  const role = queryParams.role

  const query = {}

  if (search) {
    query.$text = { $search: search }
  }

  if (role) {
    query.role = role
  }

  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .select('-password')

  const total = await User.countDocuments(query)

  const result = {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    users,
  }

  // Save to Redis (TTL = 60 sec)
  await client.setEx(cacheKey, 60, JSON.stringify(result))

  return result
}

// Get user by ID
exports.getUserById = async (id) => {
  const user = await User.findById(id).lean()
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

// 🔹 Register user
exports.registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError('User already exists', 400)
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  })

  await emailQueue.add('sendWelcomeEmail', {
    email: user.email,
  })

  await clearUsersCache()

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

// 🔹 Delete user
exports.deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id)
  if (!deletedUser) {
    throw new Error('User not found')
  }
  await clearUsersCache()
}

// 🔹 Update user
exports.updateUser = async (id, data) => {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name: data.name },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    throw new Error('User not found')
  }

  await clearUsersCache()

  return updatedUser
}

// 🔹 Login user
exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError('User not found', 404)
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400)
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '50m' }
  )

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

  user.refreshToken = refreshToken
  await user.save()

  await clearUsersCache()

  return { accessToken, refreshToken }
}

// 🔹 Logout user
exports.logoutUser = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  user.refreshToken = null
  await user.save()
}

// 🔹 Refresh token
exports.refreshToken = async (token) => {
  if (!token) {
    throw new AppError('No refresh token', 404)
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(decoded.id)

  if (!user || user.refreshToken !== token) {
    throw new Error('Invalid refresh token')
  }

  const newAccessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  return { accessToken: newAccessToken }
}

exports.uploadProfileImage = async (userId, file) => {
  if (!file) {
    throw new Error('No file uploaded')
  }

  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.profileImage = file.path
  await user.save()

  return user
}
