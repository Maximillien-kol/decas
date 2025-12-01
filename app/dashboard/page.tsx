"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Search,
  Mail,
  Phone,
  Calendar,
  X,
  Check,
  RefreshCw
} from 'lucide-react'

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

export default function DashboardPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simple authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'decas2025') {
      setIsAuthenticated(true)
      loadGuests()
    } else {
      alert('Invalid password')
    }
  }

  const loadGuests = async () => {
    setIsLoading(true)
    try {
      if (!supabase) {
        alert('Database not configured. Please add Supabase credentials.')
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error loading guests:', error)
      alert('Failed to load guests from database')
    } finally {
      setIsLoading(false)
    }
  }

  const updateGuestStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      if (!supabase) {
        alert('Database not configured')
        return
      }

      const { error } = await supabase
        .from('guests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setGuests(guests.map(guest => 
        guest.id === id ? { ...guest, status } : guest
      ))
    } catch (error) {
      console.error('Error updating guest status:', error)
      alert('Failed to update guest status')
    }
  }

  const filteredGuests = guests.filter(guest => {
    const matchesFilter = filter === 'all' || guest.status === filter
    const matchesSearch = 
      guest.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.telephone.includes(searchQuery) ||
      guest.registration_id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: guests.length,
    pending: guests.filter(g => g.status === 'pending').length,
    accepted: guests.filter(g => g.status === 'accepted').length,
    rejected: guests.filter(g => g.status === 'rejected').length,
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-black">
        <Card className="w-full max-w-md p-8 shadow-lg bg-gray-900 border border-gray-700">
          <div className="text-center mb-6">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Dashboard Login</h1>
            <p className="text-gray-400 mt-2">Enter password to access guest management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>
          </form>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black p-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Guest Management</h1>
            <p className="text-gray-400 mt-1">Decas' Day Registration Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={loadGuests}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Guests</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Pending</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.pending}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-medium">Accepted</p>
                <p className="text-3xl font-bold text-green-500 mt-1">{stats.accepted}</p>
              </div>
              <div className="bg-green-900 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.rejected}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <X className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 bg-gray-900 shadow-sm border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-white hover:bg-gray-200 text-black' : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'accepted' ? 'default' : 'outline'}
                onClick={() => setFilter('accepted')}
                className={filter === 'accepted' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-400 hover:bg-green-900 hover:text-green-300'}
              >
                Accepted
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
                className={filter === 'rejected' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'}
              >
                Rejected
              </Button>
            </div>
          </div>
        </Card>

        {/* Guest List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-12 text-center bg-gray-900 shadow-sm border border-gray-700">
              <RefreshCw className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium">Loading guests...</p>
            </Card>
          ) : filteredGuests.length === 0 ? (
            <Card className="p-12 text-center bg-gray-900 shadow-sm border border-gray-700">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-white font-medium">No guests found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </Card>
          ) : (
            filteredGuests.map((guest) => (
              <Card key={guest.id} className="p-6 bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {guest.first_name} {guest.last_name}
                      </h3>
                      <Badge 
                        className={
                          guest.status === 'accepted' 
                            ? 'bg-green-900 text-green-300 hover:bg-green-900 border border-green-600' 
                            : guest.status === 'rejected'
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-800 border border-gray-600'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-800 border border-gray-600'
                        }
                      >
                        {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{guest.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{guest.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(guest.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">
                          {guest.registration_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {guest.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => updateGuestStatus(guest.id, 'accepted')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                        onClick={() => updateGuestStatus(guest.id, 'rejected')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
