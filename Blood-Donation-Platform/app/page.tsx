"use client"

import { DialogDescription } from "@/components/ui/dialog"

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Send,
  Bot,
  Navigation,
} from "lucide-react"

export default function BloodDonationPlatform() {
  const [activeTab, setActiveTab] = useState("home")
  const [userType, setUserType] = useState("donor")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
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
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your health assistant. I can help you with blood donation questions, health tips, and emergency guidance. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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
    setChatInput(e.target.value)
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

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.focus()
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput, // Use trimmed input
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

  const nearbyDonors = [
    { id: 1, name: "John Smith", bloodType: "O+", distance: "1.2 km", lastDonation: "3 months ago", available: true },
    {
      id: 2,
      name: "Sarah Johnson",
      bloodType: "A+",
      distance: "2.1 km",
      lastDonation: "2 months ago",
      available: true,
    },
    { id: 3, name: "Mike Wilson", bloodType: "B+", distance: "3.5 km", lastDonation: "1 month ago", available: false },
  ]

  const achievements = [
    { id: 1, title: "First Donation", description: "Donated blood for the first time", icon: "🩸", earned: true },
    { id: 2, title: "5 Donations", description: "Donated blood 5 times", icon: "🏅", earned: true },
    { id: 3, title: "10 Donations", description: "Donated blood 10 times", icon: "🏆", earned: false },
    { id: 4, title: "Night Saver", description: "Responded to an emergency request", icon: "🌙", earned: true },
    { id: 5, title: "Community Hero", description: "Recruited 3 new donors", icon: "🦸", earned: false },
  ]

  // Navigation Component
  const NavigationComponent = () => (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">BloodConnect</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === "home" ? "text-red-600 border-b-2 border-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              Home
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "dashboard"
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("transport")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "transport"
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  Transport
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === "quiz" ? "text-red-600 border-b-2 border-red-600" : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  Quiz
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab("emergency")}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === "emergency"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-700 hover:text-red-600"
              }`}
            >
              Emergency
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-red-600" />
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLoggedIn(false)
                    setCurrentUser(null)
                    setActiveTab("home")
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => setActiveTab("register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  const AIChatbot = () => (
    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-red-500 hover:bg-red-600"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg h-[700px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b bg-red-500 text-white">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            BloodBot - Health Assistant
          </DialogTitle>
          <DialogDescription className="text-red-100">
            Your AI-powered blood donation and health guide. Ask detailed questions!
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.sender === "user" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-3 p-3 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-red-500 focus-within:shadow-md transition-all">
            <textarea
              ref={textareaRef}
              placeholder="Type your message here..."
              value={chatInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="flex-1 resize-none border-0 outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm leading-6 min-h-[24px] max-h-[120px] overflow-y-auto"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              disabled={isTyping || !chatInput.trim()}
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </DialogContent>
    </Dialog>
  )

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Save Lives Through Blood Donation</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with blood banks, find donors, and make a difference in your community. Every donation can save up
            to three lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700" onClick={() => setActiveTab("register")}>
              Become a Donor
            </Button>
            <Button size="lg" variant="outline" onClick={() => setActiveTab("emergency")}>
              Find Blood Now
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">10,000+</div>
              <div className="text-gray-600">Lives Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">5,000+</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">150+</div>
              <div className="text-gray-600">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How BloodConnect Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Register as Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sign up and complete your health profile to become a verified blood donor in our network.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Get Notified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive notifications when your blood type is needed nearby or during emergencies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Donate blood at partner locations and track your impact on the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blood Inventory Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Current Blood Inventory</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((type) => (
              <Card key={type} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{type}</div>
                  <div className="text-sm text-gray-600 mb-2">{Math.floor(Math.random() * 50) + 10} units</div>
                  <Badge
                    variant={Math.random() > 0.3 ? "default" : "destructive"}
                    className={Math.random() > 0.3 ? "bg-green-500" : ""}
                  >
                    {Math.random() > 0.3 ? "Available" : "Low Stock"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Access your BloodConnect account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button className="w-full" onClick={() => handleLogin(email, password)}>
              Sign In
            </Button>
            <div className="text-center">
              <Button variant="link" onClick={() => setActiveTab("register")}>
                Don't have an account? Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const RegisterPage = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      bloodType: "",
      age: "",
      weight: "",
      address: "",
      userType: "donor",
    })

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return
    ;<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join BloodConnect to save lives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select onValueChange={(value) => handleInputChange("bloodType", value)}>
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Enter your age"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="Enter your weight"
              />
            </div>
            <div>
              <Label htmlFor="userType">Account Type</Label>
              <Select onValueChange={(value) => handleInputChange("userType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">Blood Donor</SelectItem>
                  <SelectItem value="recipient">Blood Recipient</SelectItem>
                  <SelectItem value="hospital">Hospital/Blood Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your full address"
            />
          </div>
          <Button className="w-full" onClick={() => handleRegister(formData)}>
            Create Account
          </Button>
          <div className="text-center">
            <Button variant="link" onClick={() => setActiveTab("login")}>
              Already have an account? Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={currentUser?.isAvailable}
                      onCheckedChange={(checked) => setCurrentUser((prev) => ({ ...prev, isAvailable: checked }))}
                    />
                    <span className="text-sm">{currentUser?.isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Transport Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Active Transport Requests
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
              <Button className="w-full">
                <Car className="mr-2 h-4 w-4" />
                Request Transport
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transport Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Transports</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
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
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">On-time delivery</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

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

          {/* Emergency Contact & Settings */}
          <div className="space-y-6">
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

  const handleLogin = (email, password) => {
    // Mock login - in real app, this would validate credentials
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: email,
      bloodType: "O+",
      donationCount: 5,
      points: 150,
      userType: "donor",
    }
    setCurrentUser(mockUser)
    setIsLoggedIn(true)
    setActiveTab("dashboard")
  }

  const handleRegister = (userData) => {
    // Simulate registration
    setIsLoggedIn(true)
    setCurrentUser({
      id: 1,
      name: userData.name,
      email: userData.email,
      bloodType: userData.bloodType,
      donationCount: 0,
      points: 0,
      isAvailable: true,
    })
    setActiveTab("dashboard")
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

  // ... existing code for other components ...

  return (
    <div className="min-h-screen bg-background">
      <NavigationComponent />

      {activeTab === "home" && <HomePage />}
      {activeTab === "login" && <LoginPage />}
      {activeTab === "register" && <RegisterPage />}
      {activeTab === "dashboard" && isLoggedIn && <DashboardPage />}
      {activeTab === "transport" && isLoggedIn && <TransportPage />}
      {activeTab === "emergency" && <EmergencyPage />}
      {activeTab === "quiz" && isLoggedIn && <QuizPage />}

      <AIChatbot />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-xl font-bold">BloodConnect</span>
              </div>
              <p className="text-gray-400">Connecting lives through blood donation</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab("home")} className="text-gray-400 hover:text-white">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("emergency")} className="text-gray-400 hover:text-white">
                    Emergency
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("register")} className="text-gray-400 hover:text-white">
                    Become a Donor
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: 911
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Support: 1-800-BLOOD
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BloodConnect by Team Quantumix . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
