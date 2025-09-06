import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulated database
const transportRequests: any[] = [
  {
    id: 1,
    pickupLocation: "Red Cross Center",
    deliveryLocation: "Emergency Hospital",
    bloodType: "O-",
    units: 3,
    priority: "emergency",
    status: "in-transit",
    estimatedTime: "15 min",
    distance: "8.3 km",
    driverId: null,
    createdAt: "2024-01-20T14:30:00.000Z",
    requesterId: 1,
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
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let filteredRequests = transportRequests

    if (status) {
      filteredRequests = filteredRequests.filter((req) => req.status === status)
    }

    if (priority) {
      filteredRequests = filteredRequests.filter((req) => req.priority === priority)
    }

    // Sort by priority and creation date
    filteredRequests.sort((a, b) => {
      const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      requests: filteredRequests,
      total: filteredRequests.length,
    })
  } catch (error) {
    console.error("Error fetching transport requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pickupLocation, deliveryLocation, bloodType, units, priority, specialInstructions } = body

    // Validate required fields
    if (!pickupLocation || !deliveryLocation || !bloodType || !units || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate estimated time and distance (simplified)
    const estimatedTime = Math.floor(Math.random() * 30) + 10 + " min"
    const distance = (Math.random() * 20 + 5).toFixed(1) + " km"

    const newTransportRequest = {
      id: transportRequests.length + 1,
      pickupLocation,
      deliveryLocation,
      bloodType,
      units: Number.parseInt(units),
      priority,
      specialInstructions,
      status: "pending",
      estimatedTime,
      distance,
      driverId: null,
      createdAt: new Date().toISOString(),
      requesterId: user.userId,
    }

    transportRequests.push(newTransportRequest)

    return NextResponse.json(
      {
        message: "Transport request created successfully",
        request: newTransportRequest,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating transport request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
