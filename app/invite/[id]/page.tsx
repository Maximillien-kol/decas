"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import InviteCard from '@/components/invite-card'
import { useParams } from 'next/navigation'

interface Guest {
    id: string
    first_name: string
    last_name: string
    email: string
    telephone: string
    registration_id: string
    timestamp: string
    status: 'pending' | 'accepted' | 'rejected'
    payment_screenshot_url?: string
    created_at?: string
}

export default function InvitePage() {
    const params = useParams()
    const id = params?.id as string
    const [guest, setGuest] = useState<Guest | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadGuest = async () => {
            if (!id) {
                setError('No registration ID provided')
                setIsLoading(false)
                return
            }

            try {
                if (!supabase) {
                    setError('Database not configured')
                    setIsLoading(false)
                    return
                }

                const { data, error: fetchError } = await supabase
                    .from('guests')
                    .select('*')
                    .eq('registration_id', id)
                    .single()

                if (fetchError) {
                    console.error('Error fetching guest:', fetchError)
                    setError('Guest not found')
                    setIsLoading(false)
                    return
                }

                if (data.status !== 'accepted') {
                    setError('This invitation is not yet confirmed')
                    setIsLoading(false)
                    return
                }

                setGuest(data)
                setIsLoading(false)
            } catch (err) {
                console.error('Error:', err)
                setError('Failed to load invitation')
                setIsLoading(false)
            }
        }

        loadGuest()
    }, [id])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg">Loading invitation...</p>
                </div>
            </main>
        )
    }

    if (error || !guest) {
        return (
            <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 mb-4">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-white mb-2">Invitation Not Found</h1>
                        <p className="text-gray-300">{error}</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md flex justify-center">
                <InviteCard
                    guestName={`${guest.first_name} ${guest.last_name}`}
                    registrationId={guest.registration_id}
                />
            </div>
        </main>
    )
}
