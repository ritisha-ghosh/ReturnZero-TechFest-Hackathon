import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulated database
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
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const donorId = searchParams.get("donorId")

    let filteredDonations = donations

    if (donorId) {
      filteredDonations = donations.filter((donation) => donation.donorId === Number.parseInt(donorId))
    }

    return NextResponse.json({
      donations: filteredDonations,
      total: filteredDonations.length,
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
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
    const { bloodType, units, donationCenter, scheduledDate, notes } = body

    // Validate required fields
    if (!bloodType || !units || !donationCenter || !scheduledDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newDonation = {
      id: donations.length + 1,
      donorId: user.userId,
      bloodType,
      units: Number.parseInt(units),
      donationCenter,
      scheduledDate,
      notes,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    donations.push(newDonation)

    return NextResponse.json(
      {
        message: "Donation scheduled successfully",
        donation: newDonation,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error scheduling donation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
