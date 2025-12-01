"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PartyPopper, Clock, Mail } from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  telephone: string
  paymentScreenshot: File | null
}

interface QRCodeDisplayProps {
  formData: FormData
}

export default function QRCodeDisplay({ formData }: QRCodeDisplayProps) {
  return (
    <Card className="w-full max-w-md bg-card border-border">
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/20">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-semibold text-card-foreground mb-2 flex items-center justify-center gap-2">
          Registration Submitted! <PartyPopper className="w-6 h-6 text-accent" />
        </h2>
        <p className="text-muted-foreground mb-6">Thank you for registering!</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-semibold">Pending Approval</span>
          </div>
          <p className="text-sm text-muted-foreground">Your payment is being verified. Please wait for confirmation.</p>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-accent mb-3">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-semibold">What Happens Next?</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">1.</span>
              We will verify your payment screenshot
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">2.</span>
              Once approved, you will receive an email at{" "}
              <span className="text-foreground font-medium">{formData.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-medium">3.</span>
              The email will contain your QR code ticket and event location
            </li>
          </ul>
        </div>

        {/* Registration Details */}
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 space-y-2 text-left">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Your Registration Details</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name:</span>
            <span className="text-foreground font-medium">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email:</span>
            <span className="text-foreground font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phone:</span>
            <span className="text-foreground font-medium">{formData.telephone}</span>
          </div>
        </div>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="w-full h-12 text-base font-medium border-border"
        >
          Register Another Guest
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          Please check your email inbox (and spam folder) within 24-48 hours for your ticket confirmation.
        </p>
      </div>
    </Card>
  )
}
