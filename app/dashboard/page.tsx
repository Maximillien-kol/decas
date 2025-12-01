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
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Login</h1>
            <p className="text-gray-600 mt-2">Enter password to access guest management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Login
            </Button>
          </form>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 p-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Guest Management</h1>
            <p className="text-purple-700 mt-1">Decas' Day Registration Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={loadGuests}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Guests</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Accepted</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.accepted}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rose-600 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-rose-700 mt-1">{stats.rejected}</p>
              </div>
              <div className="bg-rose-100 p-3 rounded-lg">
                <X className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                <Input
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-200 text-purple-700 hover:bg-purple-50'}
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'accepted' ? 'default' : 'outline'}
                onClick={() => setFilter('accepted')}
                className={filter === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
              >
                Accepted
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
                className={filter === 'rejected' ? 'bg-rose-600 hover:bg-rose-700' : 'border-rose-200 text-rose-700 hover:bg-rose-50'}
              >
                Rejected
              </Button>
            </div>
          </div>
        </Card>

        {/* Guest List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-12 text-center bg-white shadow-sm">
              <RefreshCw className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-purple-700 font-medium">Loading guests...</p>
            </Card>
          ) : filteredGuests.length === 0 ? (
            <Card className="p-12 text-center bg-white shadow-sm">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-purple-700 font-medium">No guests found</p>
              <p className="text-purple-500 text-sm mt-1">Try adjusting your search or filters</p>
            </Card>
          ) : (
            filteredGuests.map((guest) => (
              <Card key={guest.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {guest.first_name} {guest.last_name}
                      </h3>
                      <Badge 
                        className={
                          guest.status === 'accepted' 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' 
                            : guest.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-100'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                        }
                      >
                        {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>{guest.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-500" />
                        <span>{guest.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{new Date(guest.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          {guest.registration_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {guest.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => updateGuestStatus(guest.id, 'accepted')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="bg-rose-600 text-white hover:bg-rose-700"
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
