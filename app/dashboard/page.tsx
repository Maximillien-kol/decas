"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import InviteCard from '@/components/invite-card'
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
  RefreshCw,
  Folder,
  MoreHorizontal,
  ChevronRight,
  Home,
  Plus,
  UserPlus,
  Ticket,
  Link,
  Copy
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    status: 'pending' as 'pending' | 'accepted' | 'rejected'
  })
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

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
        const errorMsg = 'Database not configured. Please add Supabase credentials to .env.local'
        console.error(errorMsg)
        alert(errorMsg)
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      setGuests(data || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error loading guests:', errorMessage, error)
      alert(`Failed to load guests: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const updateGuestStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      if (!supabase) {
        alert('Database not configured. Please add Supabase credentials to .env.local')
        return
      }

      const { error } = await supabase
        .from('guests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      // Update local state
      setGuests(guests.map(guest =>
        guest.id === id ? { ...guest, status } : guest
      ))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error updating guest status:', errorMessage, error)
      alert(`Failed to update guest status: ${errorMessage}`)
    }
  }

  const addGuest = async () => {
    try {
      if (!supabase) {
        alert('Database not configured. Please add Supabase credentials to .env.local')
        return
      }

      // Validate required fields
      if (!newGuest.first_name || !newGuest.last_name || !newGuest.email || !newGuest.telephone) {
        alert('Please fill in all required fields')
        return
      }

      // Generate registration ID
      const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

      const guestData = {
        first_name: newGuest.first_name,
        last_name: newGuest.last_name,
        email: newGuest.email,
        telephone: newGuest.telephone,
        registration_id: registrationId,
        timestamp: new Date().toISOString(),
        status: newGuest.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('guests')
        .insert([guestData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message || 'Unknown error'}`)
      }

      // Add to local state
      if (data && data.length > 0) {
        setGuests([data[0], ...guests])
      }

      // Reset form and close dialog
      setNewGuest({
        first_name: '',
        last_name: '',
        email: '',
        telephone: '',
        status: 'pending'
      })
      setIsAddDialogOpen(false)

      alert('Guest added successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error adding guest:', errorMessage, error)
      alert(`Failed to add guest: ${errorMessage}`)
    }
  }

  const copyInviteLink = (registrationId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const inviteUrl = `${baseUrl}/invite/${registrationId}`

    navigator.clipboard.writeText(inviteUrl).then(() => {
      alert('Invite link copied to clipboard!')
    }).catch((err) => {
      console.error('Failed to copy:', err)
      alert('Failed to copy link')
    })
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
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Login</h1>
            <p className="text-gray-500 text-sm mt-2">Enter password to access guest management</p>
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </form>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quick Access Section */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Guests Card */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">Total Guests</h3>
              <p className="text-xs text-gray-500">{stats.total} registrations</p>
            </div>

            {/* Pending Card */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">Pending</h3>
              <p className="text-xs text-gray-500">{stats.pending} waiting review</p>
            </div>

            {/* Accepted Card */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-green-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">Accepted</h3>
              <p className="text-xs text-gray-500">{stats.accepted} confirmed</p>
            </div>

            {/* Rejected Card */}
            <div className="p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-red-600 flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">Rejected</h3>
              <p className="text-xs text-gray-500">{stats.rejected} declined</p>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Card className="bg-white shadow-sm">
          {/* Breadcrumb and Actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" />
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-gray-600">Guest Management</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="text-gray-900 font-medium">All Registrations</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadGuests}
                  disabled={isLoading}
                  className="text-sm"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthenticated(false)}
                  className="text-sm"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                  className={filter === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'accepted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('accepted')}
                  className={filter === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Accepted
                </Button>
                <Button
                  variant={filter === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('rejected')}
                  className={filter === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 font-medium">Loading guest...</p>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium">No guests found</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {guest.first_name[0]}{guest.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {guest.first_name} {guest.last_name}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {guest.registration_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {guest.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {guest.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            guest.status === 'accepted'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : guest.status === 'rejected'
                                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                          }
                        >
                          {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(guest.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {guest.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700 h-8 px-3"
                              onClick={() => updateGuestStatus(guest.id, 'accepted')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50 h-8 px-3"
                              onClick={() => updateGuestStatus(guest.id, 'rejected')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : guest.status === 'accepted' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 h-8 px-3"
                              onClick={() => {
                                setSelectedGuest(guest)
                                setIsInviteDialogOpen(true)
                              }}
                            >
                              <Ticket className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-600 hover:bg-green-50 h-8 px-3"
                              onClick={() => copyInviteLink(guest.registration_id)}
                            >
                              <Link className="w-4 h-4 mr-1" />
                              Copy Link
                            </Button>
                          </div>
                        ) : (
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Add Guest Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Add New Guest
              </DialogTitle>
              <DialogDescription>
                Manually add a new guest to the registration system
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={newGuest.first_name}
                    onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={newGuest.last_name}
                    onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                  Telephone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="+250 123 456 789"
                  value={newGuest.telephone}
                  onChange={(e) => setNewGuest({ ...newGuest, telephone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={newGuest.status}
                  onChange={(e) => setNewGuest({ ...newGuest, status: e.target.value as 'pending' | 'accepted' | 'rejected' })}
                  className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewGuest({
                    first_name: '',
                    last_name: '',
                    email: '',
                    telephone: '',
                    status: 'pending'
                  })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={addGuest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Guest
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Preview Dialog */}
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-600" />
                Guest Invitation
              </DialogTitle>
              <DialogDescription>
                Preview and download the invitation for {selectedGuest?.first_name} {selectedGuest?.last_name}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-4">
              {selectedGuest && (
                <InviteCard
                  guestName={`${selectedGuest.first_name} ${selectedGuest.last_name}`}
                  registrationId={selectedGuest.registration_id}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
