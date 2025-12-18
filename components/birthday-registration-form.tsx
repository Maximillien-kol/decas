"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Cake, Upload, PartyPopper, MapPin, Ticket, Loader2 } from "lucide-react"
import QRCodeDisplay from "./qr-code-display"
import { toast } from "sonner"

interface FormData {
  firstName: string
  lastName: string
  email: string
  telephone: string
  paymentScreenshot: File | null
}

export default function BirthdayRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    paymentScreenshot: null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, paymentScreenshot: file }))
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.firstName && formData.lastName && formData.email && formData.telephone && formData.paymentScreenshot) {
      setIsSubmitting(true)

      try {
        // Create FormData for API request
        const apiFormData = new FormData()
        apiFormData.append('firstName', formData.firstName)
        apiFormData.append('lastName', formData.lastName)
        apiFormData.append('email', formData.email)
        apiFormData.append('telephone', formData.telephone)
        apiFormData.append('paymentScreenshot', formData.paymentScreenshot)

        // Send to API
        const response = await fetch('/api/send-registration', {
          method: 'POST',
          body: apiFormData,
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Guest is automatically saved to Supabase by the API
          toast.success('Registration submitted successfully! Check your email for confirmation.')
          setIsSubmitted(true)
        } else {
          toast.error(data.error || 'Failed to submit registration. Please try again.')
        }
      } catch (error) {
        console.error('Submission error:', error)
        toast.error('An error occurred. Please try again later.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isSubmitted) {
    return <QRCodeDisplay formData={formData} />
  }

  return (
    <Card className="w-full bg-transparent border-0 shadow-none">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <PartyPopper className="w-8 h-8 text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">Decas' day</h1>
            <Cake className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            You're invited to join us for an unforgettable Decas' day!
          </p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-accent" />
            How to Get Your Ticket & Location
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">1.</span>
              Fill in your registration details below
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">2.</span>
              Complete payment (see payment details below)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">3.</span>
              Upload your payment confirmation screenshot
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">4.</span>
              Your payment will be verified and QR code ticket sent to your email
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>Event location will be shared after payment approval</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border my-6"></div>

        <h2 className="text-lg font-semibold text-card-foreground mb-4">Guest Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div>
            <Label className="text-sm font-medium text-card-foreground mb-3 block">Full Name</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-card-foreground">Contact Information</Label>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Telephone */}
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-xs text-muted-foreground">
                Telephone Number
              </Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="border-t border-dashed border-border my-6"></div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-card-foreground">Payment Confirmation</Label>

            {/* Payment instruction box */}
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <p className="text-sm font-medium text-card-foreground mb-2">To confirm your registration, please pay:</p>
              <p className="text-2xl font-bold text-accent mb-2">10,500 FRW</p>
              <p className="text-sm text-muted-foreground">
                Send payment to: <span className="font-semibold text-card-foreground">+250 782 871 334</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">(MoMo / Airtel Money accepted)</p>
            </div>

            {/* Screenshot upload */}
            <div className="space-y-2">
              <Label htmlFor="paymentScreenshot" className="text-xs text-muted-foreground">
                Upload Payment Screenshot
              </Label>
              <div className="relative">
                <Input
                  id="paymentScreenshot"
                  name="paymentScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="paymentScreenshot"
                  className="flex items-center justify-between w-full px-4 py-3 bg-input border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-muted-foreground">{fileName || "Choose file..."}</span>
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Your registration will be reviewed and approved once payment is confirmed. You will receive your QR code
          ticket and event location via email.
        </p>
      </div>
    </Card>
  )
}
