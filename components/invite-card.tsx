"use client"

import Image from 'next/image'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface InviteCardProps {
    guestName: string
    registrationId: string
}

export default function InviteCard({ guestName, registrationId }: InviteCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)


    const handleDownload = async () => {
        if (!cardRef.current) return

        try {
            // Wait a bit for images to fully load
            await new Promise(resolve => setTimeout(resolve, 500))

            const htmlToImage = await import('html-to-image')

            // Use toBlob instead of toPng for better compatibility
            const blob = await htmlToImage.toBlob(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#1a1a1a',
                cacheBust: true,
            })

            if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.download = `invite-${registrationId}.png`
                link.href = url
                link.click()
                URL.revokeObjectURL(url)
            }
        } catch (error) {
            console.error('Error downloading invite:', error)
            alert('Unable to download. Please take a screenshot to save the invite.')
        }
    }


    return (
        <div className="space-y-4">
            {/* Invite Card */}
            <div
                ref={cardRef}
                className="relative w-full max-w-[400px] mx-auto bg-gradient-to-b from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] overflow-hidden rounded-lg"
                style={{
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    height: '850px',
                    width: '400px'
                }}
            >

                {/* Portrait Image Section */}
                <div className="relative h-full overflow-hidden">
                    <Image
                        src="/bg.jpg"
                        alt="Party background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

                    {/* Text Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center">
                        {/* Top Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[0.3em] mt-20"
                            style={{ fontFamily: 'Arial, sans-serif' }}
                        >

                        </h1>

                        {/* Bottom Event Details */}
                        <div className="space-y-4">
                            <p className="text-gray-200 text-xs md:text-sm tracking-wide leading-relaxed">
                                THANK YOU FOR JOINING US<br />
                                FOR A BIRTHDAY PARTY<br />
                                TO CELEBRATE <span className="font-semibold text-white">DECAS'S</span><br />
                                <span className="text-xl md:text-2xl font-bold text-white">BIRTHDAY</span>
                            </p>

                            <div className="my-4">
                                <p className="text-gray-300 text-xs tracking-widest mb-2">SATURDAY</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-gray-200 text-base md:text-lg">AUG</span>
                                    <span className="text-white text-3xl md:text-4xl font-bold">|13|</span>
                                    <span className="text-gray-200 text-base md:text-lg">3PM</span>
                                </div>
                            </div>

                            

                            <div className="pt-3">
                                <p className="text-gray-300 text-xs">RSVP 435-223-543</p>
                                <p className="text-gray-400 text-xs mt-2">
                                    Guest: <span className="text-white font-medium">{guestName}</span>
                                </p>
                                <p className="text-gray-500 text-[10px] mt-1 font-mono">{registrationId}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Download Button */}
            <Button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700"
            >
                <Download className="w-4 h-4 mr-2" />
                Download Invite
            </Button>
        </div>
    )
}
