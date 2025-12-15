-- ========================================
-- Insert Guest Records
-- Birthday Registration QR System
-- ========================================
-- Run this SQL in your Supabase SQL Editor
-- Created: 2025-12-15
-- ========================================

-- Insert Guest 1: Glody Getomillions
INSERT INTO guests (
  first_name,
  last_name,
  email,
  telephone,
  registration_id,
  timestamp,
  status,
  created_at,
  updated_at
) VALUES (
  'Glody',
  'Getomillions',
  'Kasongoglody912008@icloud.com',
  '+250793085543',
  'REG-1765466216275-8EAMK',
  '2025-12-11 00:09:45+00:00',
  'pending',
  '2025-12-11 00:09:45+00:00',
  '2025-12-11 00:09:45+00:00'
);

-- Insert Guest 2: Evra Stephane
INSERT INTO guests (
  first_name,
  last_name,
  email,
  telephone,
  registration_id,
  timestamp,
  status,
  created_at,
  updated_at
) VALUES (
  'Evra',
  'Stephane',
  'evrastephane250@gmail.com',
  '+250796482427',
  'REG-1765466167456-5SRST',
  '2025-12-11 13:59:36+00:00',
  'pending',
  '2025-12-11 13:59:36+00:00',
  '2025-12-11 13:59:36+00:00'
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify the guests were added

-- Check if both guests exist
SELECT 
  first_name,
  last_name,
  email,
  telephone,
  registration_id,
  status,
  timestamp
FROM guests
WHERE registration_id IN ('REG-1765466216275-8EAMK', 'REG-1765466167456-5SRST')
ORDER BY timestamp;

-- Count total guests
SELECT COUNT(*) as total_guests FROM guests;

-- ========================================
-- OPTIONAL: UPDATE STATUS
-- ========================================
-- If you want to accept these guests, uncomment and run:

-- UPDATE guests 
-- SET status = 'accepted' 
-- WHERE registration_id = 'REG-1765466216275-8EAMK';

-- UPDATE guests 
-- SET status = 'accepted' 
-- WHERE registration_id = 'REG-1765466167456-5SRST';

-- ========================================
-- OPTIONAL: DELETE IF NEEDED
-- ========================================
-- If you need to remove these guests, uncomment and run:

-- DELETE FROM guests WHERE registration_id = 'REG-1765466216275-8EAMK';
-- DELETE FROM guests WHERE registration_id = 'REG-1765466167456-5SRST';
