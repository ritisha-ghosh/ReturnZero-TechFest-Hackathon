import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulated database
const bloodRequests: any[] = [
  {
    id: 1,
    patientName: "Jane Smith",
    bloodType: "A+",
    unitsNeeded: 2,
    urgency: "high",
    hospital: "City General Hospital",
    contactNumber: "+1234567890",
    location: { lat: 40.7128, lng: -74.006 },
    status: "active",
    createdAt: "2024-01-20T10:00:00.000Z",
    requesterId: 1,
  },
]

const donations: any[] = []

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
    const bloodType = searchParams.get("bloodType")
    const urgency = searchParams.get("urgency")
    const location = searchParams.get("location")

    let filteredRequests = bloodRequests.filter((req) => req.status === "active")

    if (bloodType) {
      filteredRequests = filteredRequests.filter((req) => req.bloodType === bloodType)
    }

    if (urgency) {
      filteredRequests = filteredRequests.filter((req) => req.urgency === urgency)
    }

    // Sort by urgency and creation date
    filteredRequests.sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      if (urgencyDiff !== 0) return urgencyDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      requests: filteredRequests,
      total: filteredRequests.length,
    })
  } catch (error) {
    console.error("Error fetching blood requests:", error)
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
    const { patientName, bloodType, unitsNeeded, urgency, hospital, contactNumber, additionalInfo, location } = body

    // Validate required fields
    if (!patientName || !bloodType || !unitsNeeded || !urgency || !hospital || !contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newRequest = {
      id: bloodRequests.length + 1,
      patientName,
      bloodType,
      unitsNeeded: Number.parseInt(unitsNeeded),
      urgency,
      hospital,
      contactNumber,
      additionalInfo,
      location,
      status: "active",
      createdAt: new Date().toISOString(),
      requesterId: user.userId,
    }

    bloodRequests.push(newRequest)

    return NextResponse.json(
      {
        message: "Blood request created successfully",
        request: newRequest,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blood request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
