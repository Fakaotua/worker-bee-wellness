# Worker Bee Wellness - Deployment Guide

## Demo Mode vs Production Mode

### Demo Mode (Current Configuration)
The application is currently configured to run in demo mode for testing purposes without requiring real database connections.

**Features in Demo Mode:**
- ✅ Event booking form shows success messages without saving data
- ✅ Sample therapist data is displayed when database connection fails
- ✅ All UI components work correctly
- ✅ Form validation and user interactions function properly

**Environment Configuration:**
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

### Production Mode Setup

To deploy in production mode with real database functionality:

#### 1. Database Setup
Run the following SQL in your Supabase instance:

```sql
-- Create the event_requests table
CREATE TABLE IF NOT EXISTS public.event_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_state TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  responded_by UUID[] DEFAULT '{}'::UUID[],
  accepted_by UUID
);

-- Create the therapists table (if not exists)
CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  total_earnings DECIMAL DEFAULT 0,
  hourly_rate DECIMAL,
  location TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### 2. Environment Variables
Update your environment variables with real credentials:

```bash
# Disable demo mode
NEXT_PUBLIC_DEMO_MODE=false

# Real Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key

# Real Firebase Configuration (for admin authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_actual_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_actual_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_firebase_app_id
```

#### 3. Build and Deploy
```bash
npm run build
npm start
```

## Testing

### Demo Mode Testing
- Visit `/clients` to test the event booking form
- Submit a form to see demo success message
- View sample therapist data in the "Featured Therapists" section
- Visit `/admin` to see the admin login interface

### Production Mode Testing
- Verify database connections work
- Test real form submissions save to Supabase
- Confirm admin authentication works with Firebase
- Validate therapist data loads from database

## Troubleshooting

### Common Issues
1. **Form not submitting**: Check browser console for JavaScript errors
2. **No therapists showing**: Verify Supabase connection and therapists table data
3. **Admin login failing**: Confirm Firebase configuration is correct
4. **Build errors**: Ensure all environment variables are set

### Debug Mode
Enable demo mode temporarily to isolate issues:
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

This will bypass database connections and show if the issue is with the UI or database connectivity.
