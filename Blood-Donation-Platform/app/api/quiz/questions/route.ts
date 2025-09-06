import { type NextRequest, NextResponse } from "next/server"

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const difficulty = searchParams.get("difficulty") || "medium"
    const count = Number.parseInt(searchParams.get("count") || "5")

    const questions = quizQuestionsData[difficulty as keyof typeof quizQuestionsData] || quizQuestionsData.medium

    // Shuffle and return requested number of questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length))

    return NextResponse.json(selectedQuestions)
  } catch (error) {
    console.error("Quiz questions error:", error)
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
}
