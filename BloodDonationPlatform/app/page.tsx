"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Heart,
  MapPin,
  Phone,
  Users,
  Award,
  AlertTriangle,
  Car,
  Star,
  Shield,
  MessageCircle,
  Bell,
  Plus,
  CheckCircle,
  Truck,
  Route,
  Timer,
  Navigation,
  CreditCard,
  DollarSign,
  Clock,
  Loader2,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Upload,
  Droplets,
  Minus,
} from "lucide-react"

import { FloatingChatbot } from "@/components/floating-chatbot"

const AIChatbot = FloatingChatbot

export default function BloodDonationPlatform() {
  const [activeTab, setActiveTab] = useState("home")
  const [userType, setUserType] = useState("donor")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    id: number
    fullName: string
    age: number
    gender: string
    dateOfBirth: string
    contactNumber: string
    email: string
    address: string
    emergencyContact: string
    bloodGroup: string
    rhFactor: string
    donatedBefore: string
    lastDonationDate: string
    currentMedication: string
    chronicDiseases: string
    hepatitisHIV: string
    malariaHistory: string
    tuberculosis: string
    recentSurgery: string
    substanceUse: string
    pregnancyStatus: string
    covidHistory: string
    weight: string
    hemoglobin: string
    bloodPressure: string
    feelingHealthy: string
    voluntaryConsent: boolean
    informationAccurate: boolean
    donationCount: number
    points: number
    isAvailable: boolean
    bloodType: string
    isVerified: boolean // Add verification status
  } | null>(null)
  const [emergencyRequests, setEmergencyRequests] = useState([])
  const [transportRequests, setTransportRequests] = useState([])
  const [donorLocation, setDonorLocation] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [paymentHistory, setPaymentHistory] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const [internalTransportAvailable, setInternalTransportAvailable] = useState(true)
  const [externalTransportCompanies] = useState([
    {
      id: 1,
      name: "MedTransport Express",
      phone: "+1-800-MED-FAST",
      email: "emergency@medtransport.com",
      specialization: "Emergency Medical Transport",
      coverage: "City-wide",
      rating: 4.8,
      responseTime: "15-20 minutes",
      available24x7: true,
    },
    {
      id: 2,
      name: "LifeLine Logistics",
      phone: "+1-800-LIFELINE",
      email: "dispatch@lifelinelogistics.com",
      specialization: "Blood & Organ Transport",
      coverage: "Regional",
      rating: 4.9,
      responseTime: "10-15 minutes",
      available24x7: true,
    },
    {
      id: 3,
      name: "CriticalCare Transport",
      phone: "+1-800-CRITICAL",
      email: "urgent@criticalcare.com",
      specialization: "Critical Care Transport",
      coverage: "Metropolitan Area",
      rating: 4.7,
      responseTime: "12-18 minutes",
      available24x7: true,
    },
    {
      id: 4,
      name: "RedCross Emergency Transport",
      phone: "+1-800-REDCROSS",
      email: "transport@redcross.org",
      specialization: "Humanitarian Transport",
      coverage: "State-wide",
      rating: 4.6,
      responseTime: "20-25 minutes",
      available24x7: false,
    },
  ])

  const checkTransportAvailability = () => {
    const activeTransports = transportRequests.filter((req) => req.status === "in-transit").length
    const maxCapacity = 15 // Maximum internal transport capacity
    setInternalTransportAvailable(activeTransports < maxCapacity)
  }

  useEffect(() => {
    checkTransportAvailability()
  }, [transportRequests])

  const quizQuestionsData = {
    easy: [
      {
        _id: "easy1",
        question: "How often can a healthy adult donate whole blood?",
        options: ["Every 2 weeks", "Every 8 weeks", "Every 6 months", "Once a year"],
        correctAnswer: 1,
        explanation:
          "Healthy adults can donate whole blood every 8 weeks (56 days) to allow the body to replenish red blood cells.",
      },
      {
        _id: "easy2",
        question: "What is the minimum age requirement for blood donation in most countries?",
        options: ["16 years", "17 years", "18 years", "21 years"],
        correctAnswer: 2,
        explanation:
          "The minimum age for blood donation is typically 18 years, though some countries allow 16-17 year olds with parental consent.",
      },
      {
        _id: "easy3",
        question: "Which blood type is known as the universal donor?",
        options: ["A+", "B+", "AB+", "O-"],
        correctAnswer: 3,
        explanation:
          "O- blood type is the universal donor because it can be given to people of any blood type in emergencies.",
      },
      {
        _id: "easy4",
        question: "How long does a typical blood donation take?",
        options: ["15-20 minutes", "30-45 minutes", "1 hour", "2 hours"],
        correctAnswer: 1,
        explanation:
          "The actual blood donation takes about 8-10 minutes, but the entire process including registration and recovery takes 30-45 minutes.",
      },
      {
        _id: "easy5",
        question: "What should you do before donating blood?",
        options: ["Fast for 12 hours", "Drink plenty of water", "Exercise vigorously", "Take iron supplements"],
        correctAnswer: 1,
        explanation:
          "Staying well-hydrated before donation helps maintain blood volume and makes the donation process easier.",
      },
    ],
    medium: [
      {
        _id: "med1",
        question: "What is the shelf life of donated red blood cells when properly stored?",
        options: ["7 days", "21 days", "42 days", "6 months"],
        correctAnswer: 2,
        explanation:
          "Red blood cells can be stored for up to 42 days when refrigerated at 1-6°C with proper preservatives.",
      },
      {
        _id: "med2",
        question: "Which component of blood is most commonly needed for cancer patients?",
        options: ["Red blood cells", "Platelets", "Plasma", "White blood cells"],
        correctAnswer: 1,
        explanation:
          "Platelets are crucial for cancer patients as chemotherapy often reduces platelet count, affecting blood clotting.",
      },
      {
        _id: "med3",
        question: "What is the minimum hemoglobin level required for blood donation in women?",
        options: ["11.0 g/dL", "12.0 g/dL", "12.5 g/dL", "13.0 g/dL"],
        correctAnswer: 2,
        explanation: "The minimum hemoglobin level for women donors is typically 12.5 g/dL to ensure donor safety.",
      },
      {
        _id: "med4",
        question: "How much blood is typically collected during a standard donation?",
        options: ["350 mL", "450 mL", "550 mL", "650 mL"],
        correctAnswer: 1,
        explanation: "A standard whole blood donation collects approximately 450 mL (about 1 pint) of blood.",
      },
      {
        _id: "med5",
        question: "What happens to donated blood within 24 hours of collection?",
        options: [
          "It's immediately transfused",
          "It's separated into components",
          "It's frozen",
          "It's tested for diseases",
        ],
        correctAnswer: 1,
        explanation:
          "Donated blood is separated into red cells, plasma, and platelets within 24 hours to maximize its therapeutic use.",
      },
    ],
    hard: [
      {
        _id: "hard1",
        question: "What is the Rh factor and why is it important in blood transfusions?",
        options: [
          "A protein that determines blood color",
          "An antigen that can cause immune reactions",
          "A clotting factor for hemophiliacs",
          "A marker for blood age",
        ],
        correctAnswer: 1,
        explanation:
          "The Rh factor is an antigen on red blood cells. Rh-negative people can develop antibodies against Rh-positive blood, causing serious reactions.",
      },
      {
        _id: "hard2",
        question: "What is apheresis donation?",
        options: [
          "Donating blood after fasting",
          "Selective collection of specific blood components",
          "Emergency blood donation",
          "Donating blood plasma only",
        ],
        correctAnswer: 1,
        explanation:
          "Apheresis is a process where specific blood components (platelets, plasma, or red cells) are collected while returning the rest to the donor.",
      },
      {
        _id: "hard3",
        question: "Which infectious disease test is NOT routinely performed on donated blood?",
        options: ["HIV", "Hepatitis B", "Malaria", "Syphilis"],
        correctAnswer: 2,
        explanation:
          "While HIV, Hepatitis B, and Syphilis are routinely tested, malaria testing is only done in specific circumstances or endemic areas.",
      },
      {
        _id: "hard4",
        question: "What is the window period in blood donation screening?",
        options: [
          "Time between donations",
          "Storage time for blood products",
          "Time when infections may not be detectable",
          "Recovery time after donation",
        ],
        correctAnswer: 2,
        explanation:
          "The window period is the time after infection when tests may not detect the pathogen, making screening challenging.",
      },
      {
        _id: "hard5",
        question: "What is crossmatching in blood transfusion?",
        options: [
          "Matching donor and recipient blood types",
          "Testing compatibility between donor and recipient blood",
          "Checking blood expiration dates",
          "Verifying donor identity",
        ],
        correctAnswer: 1,
        explanation:
          "Crossmatching tests the compatibility between donor red cells and recipient plasma to prevent transfusion reactions.",
      },
    ],
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setChatInput(value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTyping) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const textareaRef = useRef(null)

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: chatInput.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    const currentInput = chatInput.trim()
    setChatInput("")
    setIsTyping(true)

    // Reset textarea height and maintain focus
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 100)
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          history: chatMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        text:
          data.message ||
          "I'm here to help! Could you please rephrase your question or let me know what you'd like to know about?",
        sender: "bot",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm still here to help! You can ask me about blood donation, health tips, or any general questions you might have.",
        sender: "bot",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      // Ensure focus returns to input after response
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 200)
    }
  }

  const startQuiz = async (difficulty = "medium") => {
    setIsLoadingQuiz(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const questions = quizQuestionsData[difficulty] || quizQuestionsData.medium
      setQuizQuestions(questions)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setQuizStarted(true)
      setQuizCompleted(false)
      setQuizResults(null)
    } catch (error) {
      console.error("Error loading quiz:", error)
    } finally {
      setIsLoadingQuiz(false)
    }
  }

  const selectAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      submitQuiz()
    }
  }

  const submitQuiz = async () => {
    try {
      let correctAnswers = 0
      const totalQuestions = quizQuestions.length

      quizQuestions.forEach((question) => {
        if (selectedAnswers[question._id] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const percentage = Math.round((correctAnswers / totalQuestions) * 100)
      let pointsEarned = 0
      const badgesEarned = []

      // Calculate points based on difficulty and performance
      const difficulty = quizQuestions[0]._id.includes("easy")
        ? "easy"
        : quizQuestions[0]._id.includes("med")
          ? "medium"
          : "hard"

      if (difficulty === "easy") pointsEarned = correctAnswers * 2
      else if (difficulty === "medium") pointsEarned = correctAnswers * 5
      else pointsEarned = correctAnswers * 10

      // Award badges
      if (percentage === 100) badgesEarned.push("Perfect Score")
      if (percentage >= 80) badgesEarned.push("Blood Expert")
      if (percentage >= 60) badgesEarned.push("Health Advocate")

      const results = {
        score: correctAnswers,
        total: totalQuestions,
        percentage,
        pointsEarned,
        badgesEarned,
        difficulty,
      }

      setQuizResults(results)
      setQuizCompleted(true)

      // Update user points (in real app, this would be saved to database)
      if (currentUser) {
        setCurrentUser((prev) => ({
          ...prev,
          points: (prev.points || 0) + pointsEarned,
          badges: [...(prev.badges || []), ...badgesEarned],
        }))
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setQuizQuestions([])
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setQuizResults(null)
  }

  useEffect(() => {
    // Simulate getting user location for transport features
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDonorLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }

    // Simulate emergency requests
    setEmergencyRequests([
      {
        id: 1,
        bloodType: "O-",
        hospital: "Emergency Hospital",
        urgency: "Critical",
        distance: "3.2 km",
        timeLeft: "45 min",
      },
      { id: 2, bloodType: "A+", hospital: "City Medical", urgency: "High", distance: "5.7 km", timeLeft: "2 hours" },
    ])

    // Simulate transport requests
    setTransportRequests([
      {
        id: 1,
        from: "Red Cross Center",
        to: "Emergency Hospital",
        bloodType: "O-",
        status: "pending",
        distance: "8.3 km",
        estimatedTime: "15 min",
      },
      {
        id: 2,
        from: "Community Blood Bank",
        to: "City Medical",
        bloodType: "A+",
        status: "in-transit",
        distance: "12.1 km",
        estimatedTime: "22 min",
      },
    ])
  }, [])

  const bloodBanks = [
    {
      id: 1,
      name: "City General Hospital",
      location: "123 Main St",
      distance: "2.3 km",
      inventory: { "A+": 15, "B+": 8, "O+": 22, "AB+": 5 },
    },
    {
      id: 2,
      name: "Red Cross Center",
      location: "456 Oak Ave",
      distance: "3.7 km",
      inventory: { "A+": 12, "B+": 18, "O+": 9, "AB+": 7 },
    },
    {
      id: 3,
      name: "Community Blood Bank",
      location: "789 Pine Rd",
      distance: "5.1 km",
      inventory: { "A+": 20, "B+": 14, "O+": 16, "AB+": 3 },
    },
  ]

  const [nearbyDonors, setNearbyDonors] = useState([
    { id: 1, name: "John D.", bloodType: "O-", lat: 28.6139, lng: 77.209, distance: "1.2 km", available: true },
    { id: 2, name: "Sarah M.", bloodType: "A+", lat: 28.6129, lng: 77.2295, distance: "2.1 km", available: true },
    { id: 3, name: "Mike R.", bloodType: "B+", lat: 28.6169, lng: 77.2025, distance: "1.8 km", available: true },
    { id: 4, name: "Lisa K.", bloodType: "AB+", lat: 28.6089, lng: 77.219, distance: "2.5 km", available: true },
    { id: 5, name: "David L.", bloodType: "O+", lat: 28.6199, lng: 77.215, distance: "1.5 km", available: true },
  ])

  const achievements = [
    { id: 1, title: "First Donation", description: "Donated blood for the first time", icon: "🩸", earned: true },
    { id: 2, title: "5 Donations", description: "Donated blood 5 times", icon: "🏅", earned: true },
    { id: 3, title: "10 Donations", description: "Donated blood 10 times", icon: "🏆", earned: false },
    { id: 4, title: "Night Saver", description: "Responded to an emergency request", icon: "🌙", earned: true },
    { id: 5, title: "Community Hero", description: "Recruited 3 new donors", icon: "🦸", earned: false },
  ]

  // Navigation Component
  const NavigationComponent = () => (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg mr-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">BloodConnect</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              Home
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "dashboard"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("transport")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "transport"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  Transport
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "quiz"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  Quiz
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab("emergency")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "emergency"
                  ? "bg-destructive text-destructive-foreground shadow-md"
                  : "text-foreground hover:bg-destructive/10 hover:text-destructive"
              }`}
            >
              Emergency
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></div>
                </div>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLoggedIn(false)
                    setCurrentUser(null)
                    setActiveTab("home")
                  }}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => setActiveTab("register")} className="bg-primary hover:bg-primary/90">
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="float-animation mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-6 text-balance">
            Save Lives Through <span className="gradient-text">Blood Donation</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Connect with blood banks, find donors, and make a difference in your community. Every donation can save up
            to three lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setActiveTab("register")}
            >
              <Heart className="mr-2 h-5 w-5" />
              Become a Donor
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActiveTab("emergency")}
              className="border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              Find Blood Now
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground font-medium">Lives Saved</div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-secondary mb-2">5,000+</div>
              <div className="text-muted-foreground font-medium">Active Donors</div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground font-medium">Partner Hospitals</div>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">How BloodConnect Works</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Simple steps to save lives</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Register as Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sign up and complete your health profile to become a verified blood donor in our network.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Get Notified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive notifications when your blood type is needed nearby or during emergencies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Donate blood at partner locations and track your impact on the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blood Inventory Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">Current Blood Inventory</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Real-time availability across our network</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { type: "A+", units: 45, status: "good" },
              { type: "B+", units: 32, status: "good" },
              { type: "O+", units: 8, status: "low" },
              { type: "AB+", units: 28, status: "good" },
              { type: "A-", units: 15, status: "medium" },
              { type: "B-", units: 6, status: "low" },
              { type: "O-", units: 3, status: "critical" },
              { type: "AB-", units: 12, status: "medium" },
            ].map((blood) => (
              <Card key={blood.type} className="text-center hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-foreground mb-2">{blood.type}</div>
                  <div className="text-lg text-muted-foreground mb-3">{blood.units} units</div>
                  <Badge
                    variant={
                      blood.status === "good" ? "default" : blood.status === "critical" ? "destructive" : "secondary"
                    }
                    className={`${
                      blood.status === "good"
                        ? "bg-green-500 hover:bg-green-600"
                        : blood.status === "critical"
                          ? "bg-destructive hover:bg-destructive/90"
                          : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white`}
                  >
                    {blood.status === "good" ? "Available" : blood.status === "critical" ? "Critical" : "Low Stock"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [errors, setErrors] = useState({})
    const [aadhaarFile, setAadhaarFile] = useState(null)
    const [aadhaarPreview, setAadhaarPreview] = useState(null)

    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      bloodType: "",
      rhFactor: "",
      age: "",
      gender: "",
      dateOfBirth: "",
      weight: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      emergencyContact: "",
      emergencyPhone: "",
      userType: "donor",
      // Health screening fields
      currentMedication: "",
      chronicDiseases: [],
      hasHepatitis: "",
      hasHIV: "",
      hasMalaria: false,
      hasTuberculosis: false,
      recentSurgery: false,
      consumesAlcohol: "",
      smokes: false,
      // For women
      isPregnant: false,
      isBreastfeeding: false,
      isMenstruating: false,
      // COVID related
      hadCovid: false,
      covidVaccinated: false,
      covidDate: "",
      // Previous donation
      donatedBefore: false,
      lastDonationDate: "",
      // Physical check
      currentWeight: "",
      hemoglobin: "",
      bloodPressure: "",
      feelingHealthy: true,
      aadhaarNumber: "",
      aadhaarUploaded: false,
      // Consent
      voluntaryConsent: false,
      informationAccurate: false,
    })

    const handleAadhaarUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          setErrors({ ...errors, aadhaar: "File size must be less than 5MB" })
          return
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
        if (!allowedTypes.includes(file.type)) {
          setErrors({ ...errors, aadhaar: "Only JPG, PNG, or PDF files are allowed" })
          return
        }

        setAadhaarFile(file)
        setFormData({ ...formData, aadhaarUploaded: true })

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => setAadhaarPreview(e.target.result)
          reader.readAsDataURL(file)
        } else {
          setAadhaarPreview(null)
        }

        // Clear any previous errors
        const newErrors = { ...errors }
        delete newErrors.aadhaar
        setErrors(newErrors)
      }
    }

    const validateStep = (step) => {
      const newErrors = {}

      if (step === 1) {
        if (!formData.name) newErrors.name = "Full name is required"
        if (!formData.age || formData.age < 18 || formData.age > 65) newErrors.age = "Age must be between 18-65 years"
        if (!formData.gender) newErrors.gender = "Gender is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.phone) newErrors.phone = "Contact number is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.address) newErrors.address = "Address is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.state) newErrors.state = "State is required"
        if (!formData.pinCode) newErrors.pinCode = "PIN code is required"
        if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact is required"
        if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency contact number is required"
      }

      if (step === 2) {
        if (!formData.bloodType) newErrors.bloodType = "Blood group is required"
        if (!formData.rhFactor) newErrors.rhFactor = "Rh factor is required"
      }

      if (step === 4) {
        if (!formData.currentWeight || formData.currentWeight < 50)
          newErrors.currentWeight = "Weight must be at least 50 kg"
      }

      if (step === 5) {
        if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
          newErrors.aadhaarNumber = "Valid 12-digit Aadhaar number is required"
        }
        if (!formData.aadhaarUploaded) {
          newErrors.aadhaar = "Aadhaar card photo is required"
        }
      }

      if (step === 6) {
        if (!formData.voluntaryConsent) newErrors.voluntaryConsent = "Consent is required"
        if (!formData.informationAccurate) newErrors.informationAccurate = "Declaration is required"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const checkMedicalEligibility = () => {
      const disqualifyingConditions = []

      // Check for disqualifying chronic diseases
      const disqualifyingDiseases = ["Cancer", "Heart Disease", "Kidney Disease"]
      const hasDisqualifyingDisease = formData.chronicDiseases.some((disease) =>
        disqualifyingDiseases.includes(disease),
      )

      if (hasDisqualifyingDisease) {
        const diseases = formData.chronicDiseases.filter((disease) => disqualifyingDiseases.includes(disease))
        disqualifyingConditions.push(`Chronic disease: ${diseases.join(", ")}`)
      }

      // Check for HIV/AIDS
      if (formData.hasHIV === "yes") {
        disqualifyingConditions.push("HIV/AIDS")
      }

      // Check for Hepatitis B or C
      if (formData.hasHepatitis === "yes") {
        disqualifyingConditions.push("Hepatitis B or C")
      }

      // Check for chronic alcoholism or drug addiction
      if (formData.consumesAlcohol === "drugs") {
        disqualifyingConditions.push("Recreational drug use")
      }

      return disqualifyingConditions
    }

    const nextStep = () => {
      if (currentStep === 3) {
        const disqualifyingConditions = checkMedicalEligibility()
        if (disqualifyingConditions.length > 0) {
          alert(
            `Unfortunately, you are not eligible to donate blood due to the following conditions:\n\n${disqualifyingConditions.map((condition) => `• ${condition}`).join("\n")}\n\nThank you for your interest in blood donation. Please consult with a healthcare professional for more information.`,
          )
          return
        }
      }

      if (validateStep(currentStep)) {
        setCurrentStep((prev) => Math.min(prev + 1, 6))
      }
    }

    const prevStep = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }))
      }
    }

    const handleCheckboxChange = (field, checked) => {
      setFormData((prev) => ({ ...prev, [field]: checked }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }))
      }
    }

    const handleArrayChange = (field, value, checked) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
      }))
    }

    const steps = [
      { number: 1, title: "Personal Info", icon: Users },
      { number: 2, title: "Blood Group", icon: Heart },
      { number: 3, title: "Health Screening", icon: Shield },
      { number: 4, title: "Physical Check", icon: CheckCircle },
      { number: 5, title: "Aadhaar Verification", icon: Shield },
      { number: 6, title: "Consent", icon: Shield },
    ]

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Blood Donor Registration</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Join BloodConnect to save lives - Step {currentStep} of 6
            </CardDescription>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 6 && <div className={`w-12 h-0.5 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />}
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Step {currentStep} of 6:{" "}
                {currentStep === 1
                  ? "Personal Information"
                  : currentStep === 2
                    ? "Blood Group Information"
                    : currentStep === 3
                      ? "Health Screening"
                      : currentStep === 4
                        ? "Physical Check"
                        : currentStep === 5
                          ? "Aadhaar Verification"
                          : "Consent & Declaration"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  1. Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={`mt-1 ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age (18-65 years) *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                      className={`mt-1 ${errors.age ? "border-destructive" : ""}`}
                    />
                    {errors.age && <p className="text-destructive text-sm mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender *
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className={`mt-1 ${errors.gender ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className={`mt-1 ${errors.dateOfBirth ? "border-destructive" : ""}`}
                    />
                    {errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Contact Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className={`mt-1 ${errors.phone ? "border-destructive" : ""}`}
                    />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email ID *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact" className="text-sm font-medium">
                      Emergency Contact Name *
                    </Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Emergency contact person"
                      className={`mt-1 ${errors.emergencyContact ? "border-destructive" : ""}`}
                    />
                    {errors.emergencyContact && (
                      <p className="text-destructive text-sm mt-1">{errors.emergencyContact}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-sm font-medium">
                      Emergency Contact Number *
                    </Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                      placeholder="Emergency contact phone"
                      className={`mt-1 ${errors.emergencyPhone ? "border-destructive" : ""}`}
                    />
                    {errors.emergencyPhone && <p className="text-destructive text-sm mt-1">{errors.emergencyPhone}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Full Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your complete address"
                    rows={2}
                    className={`mt-1 ${errors.address ? "border-destructive" : ""}`}
                  />
                  {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                      className={`mt-1 ${errors.city ? "border-destructive" : ""}`}
                    />
                    {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">
                      State *
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                      className={`mt-1 ${errors.state ? "border-destructive" : ""}`}
                    />
                    {errors.state && <p className="text-destructive text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Label htmlFor="pinCode" className="text-sm font-medium">
                      PIN Code *
                    </Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange("pinCode", e.target.value)}
                      placeholder="PIN Code"
                      className={`mt-1 ${errors.pinCode ? "border-destructive" : ""}`}
                    />
                    {errors.pinCode && <p className="text-destructive text-sm mt-1">{errors.pinCode}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Blood Group Information */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-destructive" />
                  2. Blood Group Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodType" className="text-sm font-medium">
                      Blood Group *
                    </Label>
                    <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                      <SelectTrigger className={`mt-1 ${errors.bloodType ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bloodType && <p className="text-destructive text-sm mt-1">{errors.bloodType}</p>}
                  </div>
                  <div>
                    <Label htmlFor="rhFactor" className="text-sm font-medium">
                      Rh Factor *
                    </Label>
                    <Select value={formData.rhFactor} onValueChange={(value) => handleInputChange("rhFactor", value)}>
                      <SelectTrigger className={`mt-1 ${errors.rhFactor ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select Rh factor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+">Positive (+)</SelectItem>
                        <SelectItem value="-">Negative (-)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.rhFactor && <p className="text-destructive text-sm mt-1">{errors.rhFactor}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="donatedBefore"
                      checked={formData.donatedBefore}
                      onCheckedChange={(checked) => handleCheckboxChange("donatedBefore", checked)}
                    />
                    <Label htmlFor="donatedBefore" className="text-sm font-medium">
                      Have you donated blood before?
                    </Label>
                  </div>
                  {formData.donatedBefore && (
                    <div>
                      <Label htmlFor="lastDonationDate" className="text-sm font-medium">
                        Last Donation Date (3+ months for males, 4+ months for females)
                      </Label>
                      <Input
                        id="lastDonationDate"
                        type="date"
                        value={formData.lastDonationDate}
                        onChange={(e) => handleInputChange("lastDonationDate", e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Health & Lifestyle Screening */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-secondary" />
                  3. Health & Lifestyle Screening
                </h3>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 mb-1">Important Medical Screening</h4>
                      <p className="text-sm text-amber-700">
                        Please answer all questions honestly. Certain medical conditions may disqualify you from blood
                        donation for safety reasons.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentMedication" className="text-sm font-medium">
                      Are you currently under any medication? (If yes, specify)
                    </Label>
                    <Textarea
                      id="currentMedication"
                      value={formData.currentMedication}
                      onChange={(e) => handleInputChange("currentMedication", e.target.value)}
                      placeholder="List any current medications or write 'None'"
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Do you have any chronic diseases? (Check all that apply)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Diabetes", "Heart Disease", "Cancer", "Hypertension", "Kidney Disease", "Liver Disease"].map(
                        (disease) => (
                          <div key={disease} className="flex items-center space-x-2">
                            <Switch
                              id={disease}
                              checked={formData.chronicDiseases.includes(disease)}
                              onCheckedChange={(checked) => handleArrayChange("chronicDiseases", disease, checked)}
                            />
                            <Label htmlFor={disease} className="text-sm">
                              {disease}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Have you ever had Hepatitis B or C?</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hepatitis-yes"
                            name="hasHepatitis"
                            value="yes"
                            checked={formData.hasHepatitis === "yes"}
                            onChange={(e) => setFormData({ ...formData, hasHepatitis: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hepatitis-yes" className="text-sm">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hepatitis-no"
                            name="hasHepatitis"
                            value="no"
                            checked={formData.hasHepatitis === "no"}
                            onChange={(e) => setFormData({ ...formData, hasHepatitis: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hepatitis-no" className="text-sm">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hepatitis-unknown"
                            name="hasHepatitis"
                            value="unknown"
                            checked={formData.hasHepatitis === "unknown"}
                            onChange={(e) => setFormData({ ...formData, hasHepatitis: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hepatitis-unknown" className="text-sm">
                            I don't know
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Have you ever had HIV/AIDS?</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hiv-yes"
                            name="hasHIV"
                            value="yes"
                            checked={formData.hasHIV === "yes"}
                            onChange={(e) => setFormData({ ...formData, hasHIV: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hiv-yes" className="text-sm">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hiv-no"
                            name="hasHIV"
                            value="no"
                            checked={formData.hasHIV === "no"}
                            onChange={(e) => setFormData({ ...formData, hasHIV: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hiv-no" className="text-sm">
                            No
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="hiv-unknown"
                            name="hasHIV"
                            value="unknown"
                            checked={formData.hasHIV === "unknown"}
                            onChange={(e) => setFormData({ ...formData, hasHIV: e.target.value })}
                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 focus:ring-cyan-500"
                          />
                          <Label htmlFor="hiv-unknown" className="text-sm">
                            I don't know
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasMalaria"
                        checked={formData.hasMalaria}
                        onCheckedChange={(checked) => handleCheckboxChange("hasMalaria", checked)}
                      />
                      <Label htmlFor="hasMalaria" className="text-sm font-medium">
                        Malaria/Dengue/Chikungunya in last 6 months?
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasTuberculosis"
                        checked={formData.hasTuberculosis}
                        onCheckedChange={(checked) => handleCheckboxChange("hasTuberculosis", checked)}
                      />
                      <Label htmlFor="hasTuberculosis" className="text-sm font-medium">
                        Have you ever had Tuberculosis?
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recentSurgery"
                      checked={formData.recentSurgery}
                      onCheckedChange={(checked) => handleCheckboxChange("recentSurgery", checked)}
                    />
                    <Label htmlFor="recentSurgery" className="text-sm font-medium">
                      Surgery, tattooing, piercing, or dental extraction in last 6 months?
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="consumesAlcohol" className="text-sm font-medium">
                      Do you consume alcohol, smoke, or use recreational drugs?
                    </Label>
                    <Select
                      value={formData.consumesAlcohol}
                      onValueChange={(value) => handleInputChange("consumesAlcohol", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional alcohol</SelectItem>
                        <SelectItem value="regular">Regular alcohol</SelectItem>
                        <SelectItem value="smoke">Smoke</SelectItem>
                        <SelectItem value="drugs">Recreational drugs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.gender === "female" && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">For women:</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isPregnant"
                            checked={formData.isPregnant}
                            onCheckedChange={(checked) => handleCheckboxChange("isPregnant", checked)}
                          />
                          <Label htmlFor="isPregnant" className="text-sm">
                            Are you pregnant?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isBreastfeeding"
                            checked={formData.isBreastfeeding}
                            onCheckedChange={(checked) => handleCheckboxChange("isBreastfeeding", checked)}
                          />
                          <Label htmlFor="isBreastfeeding" className="text-sm">
                            Are you breastfeeding?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isMenstruating"
                            checked={formData.isMenstruating}
                            onCheckedChange={(checked) => handleCheckboxChange("isMenstruating", checked)}
                          />
                          <Label htmlFor="isMenstruating" className="text-sm">
                            Currently menstruating?
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hadCovid"
                        checked={formData.hadCovid}
                        onCheckedChange={(checked) => handleCheckboxChange("hadCovid", checked)}
                      />
                      <Label htmlFor="hadCovid" className="text-sm font-medium">
                        Recently had COVID-19?
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="covidVaccinated"
                        checked={formData.covidVaccinated}
                        onCheckedChange={(checked) => handleCheckboxChange("covidVaccinated", checked)}
                      />
                      <Label htmlFor="covidVaccinated" className="text-sm font-medium">
                        COVID-19 vaccinated?
                      </Label>
                    </div>
                  </div>

                  {(formData.hadCovid || formData.covidVaccinated) && (
                    <div>
                      <Label htmlFor="covidDate" className="text-sm font-medium">
                        Date of COVID-19 infection or last vaccination
                      </Label>
                      <Input
                        id="covidDate"
                        type="date"
                        value={formData.covidDate}
                        onChange={(e) => handleInputChange("covidDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Physical Check */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  4. Physical Check
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentWeight" className="text-sm font-medium">
                      Current Weight (minimum 50 kg) *
                    </Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      min="50"
                      value={formData.currentWeight}
                      onChange={(e) => handleInputChange("currentWeight", e.target.value)}
                      placeholder="Weight in kg"
                      className={`mt-1 ${errors.currentWeight ? "border-destructive" : ""}`}
                    />
                    {errors.currentWeight && <p className="text-destructive text-sm mt-1">{errors.currentWeight}</p>}
                  </div>
                  <div>
                    <Label htmlFor="hemoglobin" className="text-sm font-medium">
                      Hemoglobin level (if known)
                    </Label>
                    <Input
                      id="hemoglobin"
                      value={formData.hemoglobin}
                      onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
                      placeholder="e.g., 12.5 g/dL"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodPressure" className="text-sm font-medium">
                      Blood Pressure (if known)
                    </Label>
                    <Input
                      id="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                      placeholder="e.g., 120/80"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="feelingHealthy"
                      checked={formData.feelingHealthy}
                      onCheckedChange={(checked) => handleCheckboxChange("feelingHealthy", checked)}
                    />
                    <Label htmlFor="feelingHealthy" className="text-sm font-medium">
                      Do you feel fit and healthy today?
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Aadhaar Verification */}
            {currentStep === 5 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  5. Aadhaar Verification
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Identity Verification Required</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Please provide your Aadhaar details for identity verification. This helps ensure the safety
                          and authenticity of our donor network.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aadhaarNumber" className="text-sm font-medium">
                      Aadhaar Number *
                    </Label>
                    <Input
                      id="aadhaarNumber"
                      type="text"
                      maxLength="12"
                      value={formData.aadhaarNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "") // Only allow digits
                        handleInputChange("aadhaarNumber", value)
                      }}
                      placeholder="Enter 12-digit Aadhaar number"
                      className={`mt-1 ${errors.aadhaarNumber ? "border-destructive" : ""}`}
                    />
                    {errors.aadhaarNumber && <p className="text-destructive text-sm mt-1">{errors.aadhaarNumber}</p>}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Upload Aadhaar Card Photo *</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="aadhaar-upload"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                            errors.aadhaar ? "border-destructive" : "border-muted-foreground/25"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {aadhaarFile ? (
                              <div className="text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-foreground font-medium">{aadhaarFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(aadhaarFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                              </div>
                            )}
                          </div>
                          <input
                            id="aadhaar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleAadhaarUpload}
                          />
                        </label>
                      </div>
                      {errors.aadhaar && <p className="text-destructive text-sm mt-1">{errors.aadhaar}</p>}
                    </div>

                    {aadhaarPreview && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium">Preview:</Label>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                          <img
                            src={aadhaarPreview || "/placeholder.svg"}
                            alt="Aadhaar preview"
                            className="w-full h-48 object-contain bg-muted"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-amber-800">
                          <strong>Privacy Notice:</strong> Your Aadhaar information is used solely for identity
                          verification and will be stored securely. We comply with all data protection regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Consent */}
            {currentStep === 6 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  6. Consent & Declaration
                </h3>
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Switch
                      id="voluntaryConsent"
                      checked={formData.voluntaryConsent}
                      onCheckedChange={(checked) => handleCheckboxChange("voluntaryConsent", checked)}
                    />
                    <Label htmlFor="voluntaryConsent" className="text-sm font-medium">
                      I voluntarily agree to donate blood and declare that the information provided is true.
                    </Label>
                    {errors.voluntaryConsent && (
                      <p className="text-destructive text-sm mt-1">{errors.voluntaryConsent}</p>
                    )}
                  </div>
                  <div className="flex items-start space-x-2">
                    <Switch
                      id="informationAccurate"
                      checked={formData.informationAccurate}
                      onCheckedChange={(checked) => handleCheckboxChange("informationAccurate", checked)}
                    />
                    <Label htmlFor="informationAccurate" className="text-sm font-medium">
                      I understand that my donation may be refused if I don't meet eligibility criteria.
                    </Label>
                    {errors.informationAccurate && (
                      <p className="text-destructive text-sm mt-1">{errors.informationAccurate}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center bg-transparent"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white flex items-center"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    if (validateStep(6)) {
                      const fullBloodType = `${formData.bloodType}${formData.rhFactor}`
                      setCurrentUser({
                        ...formData,
                        id: Date.now(),
                        donationCount: 0,
                        points: 0,
                        isAvailable: false, // Default to false until verified
                        bloodType: fullBloodType,
                        isVerified: false, // New users start unverified
                      })
                      setIsLoggedIn(true)
                      setActiveTab("dashboard")
                    }
                  }}
                  disabled={!formData.voluntaryConsent || !formData.informationAccurate}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Complete Registration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const DashboardPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name}!</h1>
          <p className="text-gray-600">Your blood donation dashboard</p>
        </div>

        <Tabs value={userType} onValueChange={setUserType} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donor">Donor Dashboard</TabsTrigger>
            <TabsTrigger value="recipient">Recipient Dashboard</TabsTrigger>
            <TabsTrigger value="bloodbank">Blood Bank Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="donor" className="space-y-6">
            {/* Donor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentUser?.donationCount || 0}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lives Saved</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(currentUser?.donationCount || 0) * 3}</div>
                  <p className="text-xs text-muted-foreground">Each donation saves 3 lives</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentUser?.points || 0}</div>
                  <p className="text-xs text-muted-foreground">Redeem for rewards</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Availability</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {currentUser?.isVerified ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={currentUser?.isAvailable}
                        onCheckedChange={(checked) => setCurrentUser((prev) => ({ ...prev, isAvailable: checked }))}
                      />
                      <span className="text-sm">{currentUser?.isAvailable ? "Available" : "Unavailable"}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch checked={false} disabled={true} onCheckedChange={() => {}} />
                        <span className="text-sm text-muted-foreground">Unavailable</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span className="text-xs text-amber-700">
                          Verification is still in process. You'll be able to set your availability once verified.
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Nearby Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Blood Requests</CardTitle>
                <CardDescription>People in your area who need your blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyDonors.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-gray-600">Blood Type: {request.bloodType}</p>
                          <p className="text-sm text-gray-600">Distance: {request.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={request.available ? "default" : "secondary"}>
                          {request.available ? "Available" : "Busy"}
                        </Badge>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your donation milestones and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 border rounded-lg ${achievement.earned ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        {achievement.earned && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipient" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Center
                </CardTitle>
                <CardDescription>Manage payments for blood donations and medical services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Paid</p>
                        <p className="text-2xl font-bold text-blue-900">₹1,200</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Pending</p>
                        <p className="text-2xl font-bold text-orange-900">₹300</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Saved Lives</p>
                        <p className="text-2xl font-bold text-green-900">12</p>
                      </div>
                      <Heart className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Quick Payment */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Make a Payment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentAmount">Amount (₹)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount in INR"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="paymentNote">Payment Note (Optional)</Label>
                    <Textarea id="paymentNote" placeholder="Add a note for this payment..." />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={handlePayment}
                    disabled={isProcessingPayment || !paymentAmount}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ₹{paymentAmount}
                      </>
                    )}
                  </Button>
                </div>

                {/* Pending Payments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pending Payments</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        service: "Blood Transfusion - A+ (2 liters)",
                        hospital: "City General Hospital",
                        amount: 200,
                        dueDate: "2024-01-25",
                        urgent: true,
                      },
                      {
                        id: 2,
                        service: "Processing Fee",
                        hospital: "Regional Blood Bank",
                        amount: 100,
                        dueDate: "2024-01-30",
                        urgent: false,
                      },
                    ].map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{payment.service}</p>
                            {payment.urgent && <Badge variant="destructive">Urgent</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{payment.hospital}</p>
                          <p className="text-sm text-gray-500">Due: {payment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{payment.amount}</p>
                          <Button size="sm" onClick={() => handleQuickPayment(payment)}>
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        service: "Blood Transfusion - O+ (1 liter)",
                        amount: 100,
                        date: "2024-01-15",
                        status: "Completed",
                        method: "Credit Card",
                      },
                      {
                        id: 2,
                        service: "Emergency Blood Request (3 liters)",
                        amount: 300,
                        date: "2024-01-10",
                        status: "Completed",
                        method: "Insurance",
                      },
                      {
                        id: 3,
                        service: "Processing Fee",
                        amount: 50,
                        date: "2024-01-05",
                        status: "Completed",
                        method: "PayPal",
                      },
                    ].map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{payment.service}</p>
                          <p className="text-sm text-gray-600">Paid via {payment.method}</p>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{payment.amount}</p>
                          <Badge variant="secondary">{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Request Form */}
            <Card>
              <CardHeader>
                <CardTitle>Request Blood</CardTitle>
                <CardDescription>Submit a blood request for yourself or someone else</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input id="patientName" placeholder="Enter patient name" />
                  </div>
                  <div>
                    <Label htmlFor="bloodTypeNeeded">Blood Type Needed</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unitsNeeded">Units Needed</Label>
                    <Input id="unitsNeeded" type="number" placeholder="Number of units" />
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hospital">Hospital/Location</Label>
                    <Input id="hospital" placeholder="Hospital or location" />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input id="contactNumber" placeholder="Emergency contact" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea id="additionalInfo" placeholder="Any additional details..." />
                </div>
                <Button className="w-full">Submit Blood Request</Button>
              </CardContent>
            </Card>

            {/* Nearby Donors */}
            <Card>
              <CardHeader>
                <CardTitle>Available Donors Nearby</CardTitle>
                <CardDescription>Donors in your area with matching blood types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyDonors
                    .filter((donor) => donor.available)
                    .map((donor) => (
                      <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-sm text-gray-600">Blood Type: {donor.bloodType}</p>
                            <p className="text-sm text-gray-600">Distance: {donor.distance}</p>
                            <p className="text-sm text-gray-600">Last Donation: {donor.lastDonation}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <Button size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bloodbank" className="space-y-6">
            {/* Blood Bank Directory */}
            <Card>
              <CardHeader>
                <CardTitle>Blood Bank Directory</CardTitle>
                <CardDescription>Find blood banks and check inventory levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {bloodBanks.map((bank) => (
                    <div key={bank.id} className="p-6 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{bank.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {bank.location}
                          </p>
                          <p className="text-sm text-gray-500">{bank.distance} away</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Navigation className="mr-2 h-4 w-4" />
                            Directions
                          </Button>
                          <Button size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Blood Inventory</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {Object.entries(bank.inventory).map(([type, count]) => (
                            <div key={type} className="text-center p-3 bg-gray-50 rounded">
                              <div className="font-semibold text-lg">{type}</div>
                              <div
                                className={`text-sm ${count > 10 ? "text-green-600" : count > 5 ? "text-yellow-600" : "text-red-600"}`}
                              >
                                {count} units
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  const TransportPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
          <p className="text-gray-600">Coordinate blood transport and logistics</p>
        </div>

        {!internalTransportAvailable && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Internal Transport Capacity Full:</strong> All our transport vehicles are currently busy.
                  External transport partners are available below for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Transport Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Active Transport Requests
                <Badge variant={internalTransportAvailable ? "secondary" : "destructive"} className="ml-2">
                  {transportRequests.filter((req) => req.status === "in-transit").length}/15 Active
                </Badge>
              </CardTitle>
              <CardDescription>Current blood transport operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transportRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">Blood Type: {request.bloodType}</p>
                        <p className="text-sm text-gray-600">From: {request.from}</p>
                        <p className="text-sm text-gray-600">To: {request.to}</p>
                      </div>
                      <Badge variant={request.status === "in-transit" ? "default" : "secondary"}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Route className="mr-1 h-4 w-4" />
                        {request.distance}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Timer className="mr-1 h-4 w-4" />
                        ETA: {request.estimatedTime}
                      </div>
                      <Button size="sm">Track</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Request Transport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Request Transport
              </CardTitle>
              <CardDescription>Schedule blood transport between locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.name}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliveryLocation">Delivery Location</Label>
                <Input id="deliveryLocation" placeholder="Enter delivery address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodTypeTransport">Blood Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unitsTransport">Units</Label>
                  <Input id="unitsTransport" type="number" placeholder="Number of units" />
                </div>
              </div>
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea id="specialInstructions" placeholder="Any special handling requirements..." />
              </div>
              <Button
                className="w-full"
                variant={internalTransportAvailable ? "default" : "outline"}
                disabled={!internalTransportAvailable}
              >
                <Car className="mr-2 h-4 w-4" />
                {internalTransportAvailable ? "Request Internal Transport" : "Internal Transport Full"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {!internalTransportAvailable && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Phone className="mr-2 h-5 w-5" />
                  External Transport Partners
                </CardTitle>
                <CardDescription>
                  Trusted external transport companies available when our internal fleet is at capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {externalTransportCompanies.map((company) => (
                    <div key={company.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <p className="text-sm text-gray-600">{company.specialization}</p>
                          <p className="text-sm text-gray-600">Coverage: {company.coverage}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{company.rating}</span>
                          </div>
                          {company.available24x7 && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              24/7
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Timer className="mr-2 h-4 w-4" />
                          Response Time: {company.responseTime}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="mr-2 h-4 w-4" />
                          {company.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="mr-2 h-4 w-4" />
                          {company.email}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1" onClick={() => window.open(`tel:${company.phone}`)}>
                          <Phone className="mr-1 h-4 w-4" />
                          Call Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(`mailto:${company.email}?subject=Emergency Blood Transport Request`)
                          }
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Emergency Transport Hotline</h4>
                  <p className="text-sm text-red-700 mb-3">
                    For critical emergencies requiring immediate transport, call our 24/7 emergency hotline:
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.open("tel:+1-800-EMERGENCY")}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Emergency: +1-800-EMERGENCY
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open("sms:+1-800-EMERGENCY?body=URGENT: Blood transport needed")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Emergency SMS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transport Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transports</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transportRequests.filter((req) => req.status === "in-transit").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently in transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Successful deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23 min</div>
              <p className="text-xs text-muted-foreground">Delivery time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">External Partners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{externalTransportCompanies.length}</div>
              <p className="text-xs text-muted-foreground">Available partners</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const DonorMap = () => {
    const [selectedDonor, setSelectedDonor] = useState(null)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Nearby Available Donors
          </CardTitle>
          <CardDescription>Real-time locations of available donors in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-80 mb-4 overflow-hidden border-2 border-gray-200">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
              {/* Grid lines to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-gray-300"
                    style={{
                      left: `${i * 12.5}%`,
                      top: 0,
                      bottom: 0,
                      borderLeft: "1px solid",
                    }}
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-gray-300"
                    style={{
                      top: `${i * 16.67}%`,
                      left: 0,
                      right: 0,
                      borderTop: "1px solid",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Donor Markers */}
            {nearbyDonors.map((donor, index) => (
              <div
                key={donor.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`,
                }}
                onClick={() => setSelectedDonor(selectedDonor === donor.id ? null : donor.id)}
              >
                {/* Donor Marker */}
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-white" />
                  </div>
                  {/* Pulse animation */}
                  <div className="absolute inset-0 w-8 h-8 bg-red-400 rounded-full animate-ping opacity-75"></div>

                  {/* Donor Info Popup */}
                  {selectedDonor === donor.id && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg border min-w-48 z-10">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">{donor.name}</p>
                        <p className="text-red-600 font-medium">Blood Type: {donor.bloodType}</p>
                        <p className="text-gray-600">Distance: {donor.distance}</p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-600 text-xs">Available Now</span>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700">
                            <Phone className="mr-1 h-3 w-3" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            <Navigation className="mr-1 h-3 w-3" />
                            Route
                          </Button>
                        </div>
                      </div>
                      {/* Arrow pointing down */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Current Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur">
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Available Donors</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Your Location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donor List */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <h4 className="font-medium text-gray-800 mb-2">Available Donors ({nearbyDonors.length})</h4>
            {nearbyDonors.map((donor) => (
              <div key={donor.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{donor.name}</p>
                    <p className="text-xs text-gray-600">
                      {donor.bloodType} • {donor.distance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const EmergencyPage = () => (
    <div className="min-h-screen bg-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-red-800 flex items-center justify-center">
            <AlertTriangle className="mr-3 h-8 w-8" />
            Emergency Blood Requests
          </h1>
          <p className="text-red-600 mt-2">Critical blood needs requiring immediate attention</p>
        </div>

        {/* Emergency Alert Banner */}
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-3 h-6 w-6" />
              <div>
                <p className="font-semibold">CRITICAL ALERT: O- Blood Needed</p>
                <p className="text-sm">Emergency Hospital - 3.2 km away - 45 minutes remaining</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Respond Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Requests */}
          <div className="space-y-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Active Emergency Requests</CardTitle>
                <CardDescription>Urgent blood needs in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyRequests.map((request) => (
                    <div key={request.id} className="p-4 border border-red-200 rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-red-700">{request.bloodType} Blood Needed</p>
                          <p className="text-sm text-gray-600">{request.hospital}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {request.distance} away
                          </p>
                        </div>
                        <Badge variant={request.urgency === "Critical" ? "destructive" : "secondary"}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-red-600">
                          <Timer className="mr-1 h-4 w-4" />
                          {request.timeLeft} remaining
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Navigation className="mr-1 h-4 w-4" />
                            Directions
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Respond
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Response Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Emergency Response</CardTitle>
                <CardDescription>Your contribution to emergency situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Emergency Responses</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12 min</div>
                    <div className="text-sm text-gray-600">Average Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact & Settings + Donor Map */}
          <div className="space-y-6">
            <DonorMap />

            <Card>
              <CardHeader>
                <CardTitle>Emergency Settings</CardTitle>
                <CardDescription>Configure your emergency response preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Notifications</p>
                    <p className="text-sm text-gray-600">Receive alerts for critical blood needs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Response</p>
                    <p className="text-sm text-gray-600">Automatically respond to matching requests</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Label htmlFor="maxDistance">Maximum Response Distance (km)</Label>
                  <Input id="maxDistance" type="number" defaultValue="10" />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                  <Input id="emergencyContact" placeholder="Enter emergency contact" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Emergency response tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Emergency Need
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency Hotline
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Important numbers for blood emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Emergency Hotline</p>
                      <p className="text-sm text-gray-600">24/7 Blood Emergency</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Red Cross Center</p>
                      <p className="text-sm text-gray-600">Blood Bank Services</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const VERIFIED_CREDENTIALS = {
    email: "verified@donor.com",
    password: "donor123",
  }

  const handleLogin = (email, password) => {
    if (email === VERIFIED_CREDENTIALS.email && password === VERIFIED_CREDENTIALS.password) {
      const verifiedUser = {
        id: 1,
        fullName: "Dr. Sarah Johnson",
        age: 32,
        gender: "Female",
        dateOfBirth: "1992-03-15",
        contactNumber: "+91-9876543210",
        email: email,
        address: "123 Medical Street, Health City, HC 560001",
        emergencyContact: "Emergency Contact Name",
        bloodGroup: "O+",
        rhFactor: "Positive",
        donatedBefore: "yes",
        lastDonationDate: "2024-09-01",
        currentMedication: "no",
        chronicDiseases: "no",
        hepatitisHIV: "no",
        malariaHistory: "no",
        tuberculosis: "no",
        recentSurgery: "no",
        substanceUse: "no",
        pregnancyStatus: "no",
        covidHistory: "no",
        weight: "65",
        hemoglobin: "13.5",
        bloodPressure: "120/80",
        feelingHealthy: "yes",
        voluntaryConsent: true,
        informationAccurate: true,
        donationCount: 12,
        points: 360,
        isAvailable: true,
        bloodType: "O+",
        isVerified: true,
      }
      setCurrentUser(verifiedUser)
      setIsLoggedIn(true)
      setActiveTab("dashboard")
      setShowHomePage(false) // Hide home page after login
    } else {
      alert("Invalid credentials. Please use:\nEmail: verified@donor.com\nPassword: donor123")
    }
  }

  const QuizPage = () => {
    if (!quizStarted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donation Knowledge Quiz</h1>
              <p className="text-xl text-gray-600">Test your knowledge about blood donation and earn points!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-green-600">Easy</CardTitle>
                  <CardDescription>Basic blood donation facts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">10 Points</div>
                  <Button className="w-full" onClick={() => startQuiz("easy")} disabled={isLoadingQuiz}>
                    {isLoadingQuiz ? "Loading..." : "Start Easy Quiz"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-600">Medium</CardTitle>
                  <CardDescription>Intermediate knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">25 Points</div>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => startQuiz("medium")}
                    disabled={isLoadingQuiz}
                  >
                    {isLoadingQuiz ? "Loading..." : "Start Medium Quiz"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Hard</CardTitle>
                  <CardDescription>Advanced medical knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">50 Points</div>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => startQuiz("hard")}
                    disabled={isLoadingQuiz}
                  >
                    {isLoadingQuiz ? "Loading..." : "Start Hard Quiz"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Your Quiz Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentUser?.points || 0}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentUser?.badges?.length || 0}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Quizzes Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">0%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {currentUser?.badges && currentUser.badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        <Award className="mr-1 h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )
    }

    if (quizCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl text-green-600 mb-4">Quiz Completed!</CardTitle>
                <CardDescription className="text-lg">Here are your results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {quizResults?.score || 0}/{quizResults?.total || 0}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{quizResults?.percentage || 0}%</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">+{quizResults?.pointsEarned || 0}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>

                {quizResults?.badgesEarned && quizResults.badgesEarned.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600 mb-2">New Badges Earned!</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quizResults.badgesEarned.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                          <Award className="mr-1 h-3 w-3" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetQuiz}>Take Another Quiz</Button>
                  <Button variant="outline" onClick={() => setActiveTab("dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    const currentQuestion = quizQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestion._id] === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => selectAnswer(currentQuestion._id, index)}
                >
                  <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button onClick={nextQuestion} disabled={selectedAnswers[currentQuestion._id] === undefined}>
                  {currentQuestionIndex === quizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    if (!paymentAmount || isProcessingPayment) return

    setIsProcessingPayment(true)

    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(paymentAmount),
          method: paymentMethod,
          type: "general_payment",
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Payment processed successfully!")
        setPaymentAmount("")
        // Refresh payment history
        fetchPaymentHistory()
      } else {
        alert("Payment failed: " + result.error)
      }
    } catch (error) {
      alert("Payment error: " + error.message)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleQuickPayment = async (payment) => {
    setIsProcessingPayment(true)

    try {
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: payment.amount,
          method: "card",
          type: "pending_payment",
          paymentId: payment.id,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Payment completed successfully!")
        // Remove from pending payments
        setPendingPayments((prev) => prev.filter((p) => p.id !== payment.id))
        fetchPaymentHistory()
      } else {
        alert("Payment failed: " + result.error)
      }
    } catch (error) {
      alert("Payment error: " + error.message)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch("/api/payments/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(data.payments || [])
      }
    } catch (error) {
      console.error("Error fetching payment history:", error)
    }
  }

  const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Welcome back! Please enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <p className="font-medium">Demo Verified Donor Credentials:</p>
                <p className="text-xs mt-1">Email: verified@donor.com</p>
                <p className="text-xs">Password: donor123</p>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email ID
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleLogin(email, password)}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [showHomePage, setShowHomePage] = useState(true)

  let content

  if (!isLoggedIn) {
    if (activeTab === "login") {
      content = <LoginPage />
    } else if (activeTab === "register") {
      content = <RegisterPage />
    } else {
      // Show home page only if not logged in
      content = <HomePage />
    }
  } else {
    if (activeTab === "dashboard") {
      content = <DashboardPage />
    } else if (activeTab === "transport") {
      content = <TransportPage />
    } else if (activeTab === "emergency") {
      content = <EmergencyPage />
    } else if (activeTab === "quiz") {
      content = <QuizPage />
    } else {
      content = <HomePage />
    }
  }

  return (
    <>
      <NavigationComponent />
      {content}
      <AIChatbot />
    </>
  )
}
