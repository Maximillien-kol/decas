"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { MapPin, Shirt, PartyPopper, CheckCircle, Calendar, Clock } from 'lucide-react'

interface TicketData {
  firstName: string
  lastName: string
  email: string
  telephone: string
  registrationId: string
  timestamp: string
}

export default function TicketPage() {
  const searchParams = useSearchParams()
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Get QR data from URL parameter
    const data = searchParams.get('data')
    
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data))
        setTicketData(decoded)
        setIsValid(true)
      } catch (error) {
        console.error('Invalid QR data:', error)
        setIsValid(false)
      }
    }
  }, [searchParams])

  if (!isValid || !ticketData) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center bg-white border border-gray-200">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Invalid Ticket</h1>
          <p className="text-gray-600">This QR code is not valid. Please contact support.</p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-black">
              Welcome to Decas' Day!
            </h1>
            <PartyPopper className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-lg text-gray-600">We're thrilled to have you join us for this special celebration! 🎉</p>
        </div>

        {/* Ticket Verification */}
        <Card className="bg-white border-2 border-green-600 shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Ticket Verified</h2>
                <p className="text-sm text-gray-600">ID: {ticketData.registrationId}</p>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold text-black mb-3">Guest Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-medium">Name:</span> {ticketData.firstName} {ticketData.lastName}</p>
                <p><span className="font-medium">Email:</span> {ticketData.email}</p>
                <p><span className="font-medium">Phone:</span> {ticketData.telephone}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Event Details */}
        <Card className="bg-white shadow-xl border border-gray-200">
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-black mb-4">Event Details</h2>

            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Calendar className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Date</h3>
                <p className="text-gray-600">Saturday, December 28, 2025</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Clock className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Time</h3>
                <p className="text-gray-600">3:00 PM - 7:00 PM</p>
                <p className="text-sm text-gray-500">Gates open at 2:30 PM</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-2">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                  <p className="font-semibold text-black">Grand Celebration Hall</p>
                  <p className="text-gray-700 mt-1">KG 123 Street, Kigali</p>
                  <p className="text-gray-700">Kimihurura, Gasabo District</p>
                  <p className="text-sm text-gray-600 mt-2">Near Kigali Convention Centre</p>
                </div>
              </div>
            </div>

            {/* Dress Code */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <Shirt className="w-6 h-6 text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-2">Dress Code</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                  <p className="font-semibold text-black mb-2">Semi-Formal / Cocktail Attire</p>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Gentlemen: Dress shirt, slacks, blazer optional</li>
                    <li>• Ladies: Cocktail dress, elegant jumpsuit, or dressy separates</li>
                    <li>• Colors: Feel free to dress festive and colorful!</li>
                    <li>• Comfortable shoes recommended for dancing 💃🕺</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card className="bg-white border-2 border-gray-300 shadow-xl">
          <div className="p-6">
            <h3 className="font-bold text-black mb-3 text-lg">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Please arrive on time to ensure smooth entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Present this QR code at the entrance for verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Food and beverages will be provided</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>Parking is available on-site</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">•</span>
                <span>For any questions, contact: +250 788 273 374</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Footer Message */}
        <div className="text-center py-6">
          <p className="text-2xl font-bold text-black mb-2">
            Get ready for an unforgettable night! 🎊
          </p>
          <p className="text-gray-600">See you at Decas' Day celebration!</p>
        </div>
      </div>
    </main>
  )
}
