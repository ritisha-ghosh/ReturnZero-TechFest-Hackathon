import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulated payment processing
const payments: any[] = []

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, method, type, paymentId, description } = body

    // Validate required fields
    if (!amount || !method || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate payment success (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (!isSuccess) {
      return NextResponse.json({ error: "Payment processing failed" }, { status: 400 })
    }

    const newPayment = {
      id: payments.length + 1,
      userId: user.userId,
      amount: Number.parseFloat(amount),
      method,
      type,
      paymentId,
      description: description || `Payment for blood donation services`,
      status: "completed",
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    }

    payments.push(newPayment)

    return NextResponse.json(
      {
        message: "Payment processed successfully",
        payment: newPayment,
        transactionId: newPayment.transactionId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
