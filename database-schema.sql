-- ========================================
-- Birthday Registration QR System
-- Database Schema for Supabase (PostgreSQL)
-- ========================================
-- Run this SQL in your Supabase SQL Editor
-- Created: 2025-12-15
-- ========================================

-- ========================================
-- TABLES
-- ========================================

-- Guests Table
-- Stores information about birthday party guests
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  registration_id TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  payment_screenshot_url TEXT,
  notes TEXT, -- Optional notes about the guest
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Details Table (Optional)
-- Store information about the birthday event
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  rsvp_phone TEXT,
  max_guests INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest Check-ins Table (Optional)
-- Track which guests actually attended the event
CREATE TABLE IF NOT EXISTS guest_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  checkin_time TIMESTAMPTZ DEFAULT NOW(),
  checked_in_by TEXT, -- Name of person who checked them in
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users Table (Optional)
-- For dashboard authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Store hashed passwords, never plain text
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

-- Guests table indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_registration_id ON guests(registration_id);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guests_timestamp ON guests(timestamp DESC);

-- Guest check-ins indexes
CREATE INDEX IF NOT EXISTS idx_checkins_guest_id ON guest_checkins(guest_id);
CREATE INDEX IF NOT EXISTS idx_checkins_time ON guest_checkins(checkin_time DESC);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ========================================
-- SECURITY POLICIES - GUESTS TABLE
-- ========================================

-- Policy to allow anonymous inserts (for public registration)
CREATE POLICY "Allow anonymous inserts" ON guests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy to allow all reads (for dashboard and invite pages)
CREATE POLICY "Allow all reads" ON guests
  FOR SELECT
  TO anon
  USING (true);

-- Policy to allow updates (for dashboard status changes)
CREATE POLICY "Allow all updates" ON guests
  FOR UPDATE
  TO anon
  USING (true);

-- Policy to allow deletes (for dashboard management)
CREATE POLICY "Allow all deletes" ON guests
  FOR DELETE
  TO anon
  USING (true);

-- ========================================
-- SECURITY POLICIES - EVENTS TABLE
-- ========================================

-- Allow reading active events
CREATE POLICY "Allow reading events" ON events
  FOR SELECT
  TO anon
  USING (true);

-- Allow inserting events
CREATE POLICY "Allow inserting events" ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow updating events
CREATE POLICY "Allow updating events" ON events
  FOR UPDATE
  TO anon
  USING (true);

-- ========================================
-- SECURITY POLICIES - CHECK-INS TABLE
-- ========================================

-- Allow reading check-ins
CREATE POLICY "Allow reading checkins" ON guest_checkins
  FOR SELECT
  TO anon
  USING (true);

-- Allow inserting check-ins
CREATE POLICY "Allow inserting checkins" ON guest_checkins
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ========================================
-- SECURITY POLICIES - ADMIN USERS TABLE
-- ========================================

-- Allow reading admin users
CREATE POLICY "Allow reading admins" ON admin_users
  FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- TRIGGERS & FUNCTIONS
-- ========================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for guests table
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for admin_users table
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- HELPFUL VIEWS
-- ========================================

-- View: Guest statistics by status
CREATE OR REPLACE VIEW guest_statistics AS
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM guests), 2) as percentage
FROM guests
GROUP BY status;

-- View: Recent registrations (last 7 days)
CREATE OR REPLACE VIEW recent_registrations AS
SELECT
  id,
  first_name,
  last_name,
  email,
  telephone,
  registration_id,
  status,
  created_at
FROM guests
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- View: Accepted guests with check-in status
CREATE OR REPLACE VIEW accepted_guests_checkin_status AS
SELECT
  g.id,
  g.first_name,
  g.last_name,
  g.email,
  g.telephone,
  g.registration_id,
  CASE 
    WHEN gc.id IS NOT NULL THEN true 
    ELSE false 
  END as checked_in,
  gc.checkin_time
FROM guests g
LEFT JOIN guest_checkins gc ON g.id = gc.guest_id
WHERE g.status = 'accepted'
ORDER BY g.last_name, g.first_name;

-- ========================================
-- SAMPLE DATA (OPTIONAL - COMMENT OUT IF NOT NEEDED)
-- ========================================

-- Insert a sample event
-- INSERT INTO events (event_name, event_date, event_time, venue_name, venue_address, rsvp_phone, max_guests)
-- VALUES (
--   'DECAS Birthday Party',
--   '2026-08-13',
--   '15:00:00',
--   'Party Venue',
--   '123 Party Street, Kigali, Rwanda',
--   '+250 435 223 543',
--   100
-- );

-- ========================================
-- USEFUL QUERIES FOR MANAGEMENT
-- ========================================

-- Get all statistics
-- SELECT * FROM guest_statistics;

-- Get recent registrations
-- SELECT * FROM recent_registrations;

-- Get total guests count
-- SELECT COUNT(*) as total_guests FROM guests;

-- Get pending count
-- SELECT COUNT(*) as pending_count FROM guests WHERE status = 'pending';

-- Get accepted count
-- SELECT COUNT(*) as accepted_count FROM guests WHERE status = 'accepted';

-- Get rejected count
-- SELECT COUNT(*) as rejected_count FROM guests WHERE status = 'rejected';

-- Search for a specific guest
-- SELECT * FROM guests WHERE email LIKE '%example%' OR first_name LIKE '%John%';

-- Get check-in statistics
-- SELECT 
--   COUNT(DISTINCT guest_id) as checked_in_count,
--   (SELECT COUNT(*) FROM guests WHERE status = 'accepted') as total_accepted,
--   ROUND(COUNT(DISTINCT guest_id) * 100.0 / (SELECT COUNT(*) FROM guests WHERE status = 'accepted'), 2) as checkin_percentage
-- FROM guest_checkins;

-- ========================================
-- CLEANUP QUERIES (USE WITH CAUTION)
-- ========================================

-- Delete all guests (USE WITH CAUTION!)
-- DELETE FROM guests;

-- Delete all rejected guests
-- DELETE FROM guests WHERE status = 'rejected';

-- Delete old pending registrations (older than 30 days)
-- DELETE FROM guests WHERE status = 'pending' AND created_at < NOW() - INTERVAL '30 days';

-- ========================================
-- END OF SCHEMA
-- ========================================
