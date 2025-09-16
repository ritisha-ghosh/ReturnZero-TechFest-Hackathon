import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulated payment database
const payments: any[] = [
  {
    id: 1,
    userId: 1,
    amount: 100,
    method: "card",
    type: "blood_transfusion",
    description: "Blood Transfusion - O+ (1 liter)",
    status: "completed",
    transactionId: "TXN_1642123456789_abc123",
    createdAt: "2024-01-15T10:30:00.000Z",
  },
  {
    id: 2,
    userId: 1,
    amount: 300,
    method: "insurance",
    type: "emergency_request",
    description: "Emergency Blood Request (3 liters)",
    status: "completed",
    transactionId: "TXN_1642023456789_def456",
    createdAt: "2024-01-10T14:20:00.000Z",
  },
]

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

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Filter payments for the current user
    const userPayments = payments
      .filter((payment) => payment.userId === user.userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit)

    const totalAmount = payments
      .filter((payment) => payment.userId === user.userId && payment.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0)

    return NextResponse.json({
      payments: userPayments,
      total: userPayments.length,
      totalAmount,
      summary: {
        totalPaid: totalAmount,
        totalTransactions: userPayments.length,
        averageAmount: userPayments.length > 0 ? totalAmount / userPayments.length : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching payment history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
