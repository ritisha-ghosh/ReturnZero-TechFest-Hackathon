// Blood Donation Platform Backend API
// Node.js + Express + MongoDB Integration

const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const nodemailer = require("nodemailer")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/blood_donation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  bloodType: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  role: { type: String, enum: ["donor", "recipient", "admin"], default: "donor" },
  available: { type: Boolean, default: true },
  emergencyMode: { type: Boolean, default: false },
  lastDonation: Date,
  donationHistory: [
    {
      date: Date,
      location: String,
      recipient: String,
    },
  ],
  badges: [String],
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Blood Request Schema
const requestSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodType: { type: String, required: true },
  urgencyLevel: { type: String, enum: ["low", "medium", "high", "emergency"], required: true },
  hospital: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  notes: String,
  status: { type: String, enum: ["pending", "matched", "fulfilled", "cancelled"], default: "pending" },
  matchedDonors: [
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      matchScore: Number,
      contacted: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  fulfillmentDate: Date,
})

// Blood Bank Schema
const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  contact: {
    phone: String,
    email: String,
  },
  stock: {
    "O+": { type: Number, default: 0 },
    "O-": { type: Number, default: 0 },
    "A+": { type: Number, default: 0 },
    "A-": { type: Number, default: 0 },
    "B+": { type: Number, default: 0 },
    "B-": { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
  },
  verified: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
})

// Quiz Schema
const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: Number, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  category: { type: String, default: "blood_donation" },
  explanation: String,
})

// Models
const User = mongoose.model("User", userSchema)
const BloodRequest = mongoose.model("BloodRequest", requestSchema)
const BloodBank = mongoose.model("BloodBank", bloodBankSchema)
const Quiz = mongoose.model("Quiz", quizSchema)

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Authentication Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, bloodType, location, role } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodType,
      location,
      role: role || "donor",
    })

    await user.save()

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodType: user.bloodType,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodType: user.bloodType,
        role: user.role,
        available: user.available,
        emergencyMode: user.emergencyMode,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Donor Routes
app.put("/api/donor/availability", authenticateToken, async (req, res) => {
  try {
    const { available } = req.body

    await User.findByIdAndUpdate(req.user.userId, { available })

    res.json({ message: "Availability updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/donor/emergency-mode", authenticateToken, async (req, res) => {
  try {
    const { emergencyMode } = req.body

    await User.findByIdAndUpdate(req.user.userId, { emergencyMode })

    res.json({ message: "Emergency mode updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Blood Request Routes
app.post("/api/requests", authenticateToken, async (req, res) => {
  try {
    const { bloodType, urgencyLevel, hospital, location, notes } = req.body

    const request = new BloodRequest({
      recipientId: req.user.userId,
      bloodType,
      urgencyLevel,
      hospital,
      location,
      notes,
    })

    await request.save()

    // Find compatible donors using AI matching
    const compatibleDonors = await findCompatibleDonors(bloodType, location, urgencyLevel)

    // Update request with matched donors
    request.matchedDonors = compatibleDonors.map((donor) => ({
      donorId: donor._id,
      matchScore: donor.matchScore,
    }))

    await request.save()

    // Send notifications to matched donors
    if (urgencyLevel === "emergency") {
      await sendEmergencyNotifications(compatibleDonors, request)
    }

    res.status(201).json({
      message: "Blood request created successfully",
      request,
      matchedDonors: compatibleDonors.length,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/requests/nearby", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)

    // Find requests that match donor's blood type
    const compatibleRequests = await BloodRequest.find({
      status: "pending",
      bloodType: { $in: getCompatibleBloodTypes(user.bloodType) },
    }).populate("recipientId", "name location")

    res.json(compatibleRequests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Blood Bank Routes
app.get("/api/blood-banks", async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find({ verified: true })
    res.json(bloodBanks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put("/api/blood-banks/:id/stock", authenticateToken, async (req, res) => {
  try {
    const { stock } = req.body

    await BloodBank.findByIdAndUpdate(req.params.id, {
      stock,
      lastUpdated: new Date(),
    })

    res.json({ message: "Stock updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Quiz Routes
app.get("/api/quiz/questions", async (req, res) => {
  try {
    const { difficulty = "medium", count = 5 } = req.query

    const questions = await Quiz.aggregate([{ $match: { difficulty } }, { $sample: { size: Number.parseInt(count) } }])

    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/quiz/submit", authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body

    // Calculate score and award points/badges
    let score = 0
    const totalQuestions = answers.length

    for (const answer of answers) {
      const question = await Quiz.findById(answer.questionId)
      if (question && question.correctAnswer === answer.selectedOption) {
        score++
      }
    }

    const percentage = (score / totalQuestions) * 100
    const points = Math.floor(percentage / 10) * 5 // 5 points per 10%

    // Update user points
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { points },
    })

    // Award badges based on performance
    const badges = []
    if (percentage >= 90) badges.push("Quiz Master")
    if (percentage >= 70) badges.push("Blood Expert")

    if (badges.length > 0) {
      await User.findByIdAndUpdate(req.user.userId, {
        $addToSet: { badges: { $each: badges } },
      })
    }

    res.json({
      score,
      totalQuestions,
      percentage,
      pointsEarned: points,
      badgesEarned: badges,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// AI Matching Helper Functions
async function findCompatibleDonors(bloodType, location, urgencyLevel) {
  const compatibleTypes = getCompatibleDonorTypes(bloodType)

  const donors = await User.find({
    bloodType: { $in: compatibleTypes },
    role: "donor",
    available: true,
  })

  // Calculate match scores using AI algorithm
  const scoredDonors = donors.map((donor) => {
    const distance = calculateDistance(location, donor.location)
    const matchScore = calculateMatchScore(donor, distance, urgencyLevel)

    return {
      ...donor.toObject(),
      distance,
      matchScore,
    }
  })

  // Sort by match score and return top matches
  return scoredDonors.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10)
}

function getCompatibleDonorTypes(recipientBloodType) {
  const compatibility = {
    "O+": ["O+", "O-"],
    "O-": ["O-"],
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    "AB-": ["AB-", "A-", "B-", "O-"],
  }

  return compatibility[recipientBloodType] || []
}

function getCompatibleBloodTypes(donorBloodType) {
  const compatibility = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  }

  return compatibility[donorBloodType] || []
}

function calculateDistance(loc1, loc2) {
  const R = 6371 // Earth's radius in km
  const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180
  const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateMatchScore(donor, distance, urgencyLevel) {
  let score = 100

  // Distance factor
  if (distance <= 5) score += 20
  else if (distance <= 10) score += 10
  else score -= distance * 2

  // Last donation factor
  if (donor.lastDonation) {
    const daysSince = (Date.now() - donor.lastDonation) / (1000 * 60 * 60 * 24)
    if (daysSince >= 56) score += 25
    else if (daysSince >= 42) score += 15
    else score -= 30
  }

  // Emergency mode bonus
  if (donor.emergencyMode && ["high", "emergency"].includes(urgencyLevel)) {
    score += 40
  }

  // Urgency multiplier
  const multipliers = { low: 1.0, medium: 1.2, high: 1.5, emergency: 2.0 }
  score *= multipliers[urgencyLevel] || 1.0

  return Math.max(0, score)
}

// Notification Helper Functions
async function sendEmergencyNotifications(donors, request) {
  // Email/SMS notification logic would go here
  console.log(`Sending emergency notifications to ${donors.length} donors for ${request.bloodType} blood`)

  // In a real implementation, you would integrate with:
  // - Twilio for SMS
  // - SendGrid/Nodemailer for email
  // - Firebase Cloud Messaging for push notifications
}

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Blood Donation API server running on port ${PORT}`)
})

module.exports = app
