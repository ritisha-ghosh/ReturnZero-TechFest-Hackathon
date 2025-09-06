"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Heart, MapPin, Award, Users, Bell, TrendingUp, Clock } from "lucide-react"

export default function DonorDashboard({ user }) {
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false)
  const [emergencyMode, setEmergencyMode] = useState(user?.emergencyMode || false)
  const [nearbyRequests, setNearbyRequests] = useState([])
  const [donationHistory, setDonationHistory] = useState([])
  const [nextEligibleDate, setNextEligibleDate] = useState(null)

  useEffect(() => {
    fetchNearbyRequests()
    fetchDonationHistory()
    calculateNextEligibleDate()
  }, [])

  const fetchNearbyRequests = async () => {
    try {
      const response = await fetch("/api/blood-requests?nearby=true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setNearbyRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching nearby requests:", error)
    }
  }

  const fetchDonationHistory = async () => {
    try {
      const response = await fetch("/api/donations/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setDonationHistory(data.donations || [])
    } catch (error) {
      console.error("Error fetching donation history:", error)
    }
  }

  const calculateNextEligibleDate = () => {
    if (user?.lastDonation) {
      const lastDonation = new Date(user.lastDonation)
      const nextEligible = new Date(lastDonation.getTime() + 56 * 24 * 60 * 60 * 1000) // 56 days
      setNextEligibleDate(nextEligible)
    }
  }

  const toggleAvailability = async () => {
    try {
      const response = await fetch("/api/donor/availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      })

      if (response.ok) {
        setIsAvailable(!isAvailable)
      }
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  const toggleEmergencyMode = async () => {
    try {
      const response = await fetch("/api/donor/emergency-mode", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ emergencyMode: !emergencyMode }),
      })

      if (response.ok) {
        setEmergencyMode(!emergencyMode)
      }
    } catch (error) {
      console.error("Error updating emergency mode:", error)
    }
  }

  const respondToRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/blood-requests/${requestId}/respond`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        // Refresh nearby requests
        fetchNearbyRequests()
      }
    } catch (error) {
      console.error("Error responding to request:", error)
    }
  }

  const isEligibleToDonate = () => {
    if (!nextEligibleDate) return true
    return new Date() >= nextEligibleDate
  }

  const getDaysUntilEligible = () => {
    if (!nextEligibleDate) return 0
    const diff = nextEligibleDate.getTime() - new Date().getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const getProgressToNextDonation = () => {
    if (!nextEligibleDate) return 100
    const totalDays = 56
    const daysRemaining = getDaysUntilEligible()
    return Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
        </div>
        <Badge variant={isEligibleToDonate() ? "secondary" : "outline"} className="text-sm">
          {isEligibleToDonate() ? "Eligible to Donate" : `Eligible in ${getDaysUntilEligible()} days`}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{user?.donationCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
                <p className="text-2xl font-bold">{(user?.donationCount || 0) * 3}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{Math.floor((user?.donationCount || 0) / 5) + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Donor Rating</p>
                <p className="text-2xl font-bold">{user?.rating || 5.0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Donation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Availability Status</p>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "Available for donation" : "Currently unavailable"}
                </p>
              </div>
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emergency Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified for urgent requests</p>
              </div>
              <Switch checked={emergencyMode} onCheckedChange={toggleEmergencyMode} />
            </div>

            {!isEligibleToDonate() && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Next donation eligibility</p>
                  <p className="text-sm text-muted-foreground">{getDaysUntilEligible()} days</p>
                </div>
                <Progress value={getProgressToNextDonation()} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {user?.donationCount >= 1 && (
                <Badge variant="secondary" className="justify-center py-2">
                  <Heart className="mr-2 h-4 w-4" />
                  First Donation
                </Badge>
              )}
              {user?.donationCount >= 5 && (
                <Badge variant="secondary" className="justify-center py-2">
                  <Award className="mr-2 h-4 w-4" />
                  Life Saver (5 donations)
                </Badge>
              )}
              {user?.donationCount >= 10 && (
                <Badge variant="secondary" className="justify-center py-2">
                  <Users className="mr-2 h-4 w-4" />
                  Hero (10 donations)
                </Badge>
              )}
              {emergencyMode && (
                <Badge variant="outline" className="justify-center py-2">
                  <Bell className="mr-2 h-4 w-4" />
                  Emergency Responder
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nearby Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Blood Requests
          </CardTitle>
          <CardDescription>Blood requests in your area that match your blood type</CardDescription>
        </CardHeader>
        <CardContent>
          {nearbyRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No nearby requests at the moment. Thank you for being available!
            </p>
          ) : (
            <div className="space-y-4">
              {nearbyRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {request.urgency === "emergency" ? "🚨 Emergency: " : ""}
                        {request.bloodType} Blood Needed
                      </p>
                      <Badge variant={request.urgency === "emergency" ? "destructive" : "secondary"}>
                        {request.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.hospital} • {request.distance || "2.1"} km away
                    </p>
                    <p className="text-sm text-muted-foreground">{request.unitsNeeded || 1} unit(s) needed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToRequest(request.id)}
                      disabled={!isEligibleToDonate() || !isAvailable}
                    >
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {donationHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No donation history yet. Make your first donation to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {donationHistory.slice(0, 5).map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Blood Donation</p>
                    <p className="text-sm text-muted-foreground">
                      {donation.hospital} • {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{donation.bloodType}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
