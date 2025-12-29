# EduDonor - Technical Documentation

## Overview
EduDonor is a donation platform for educational causes built with React, TypeScript, and Lovable Cloud (PostgreSQL backend).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Lovable Cloud (PostgreSQL) |
| Auth | Supabase Auth |
| State | TanStack Query |
| Routing | React Router v6 |

---

## Database Schema

### Tables

#### `profiles`
Stores user profile information (auto-created on signup).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users |
| full_name | TEXT | User's display name |
| email | TEXT | User's email |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

#### `donations`
Records all donation transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique donation ID |
| user_id | UUID (FK) | References profiles |
| campaign_id | UUID (FK, nullable) | Optional campaign reference |
| amount | NUMERIC | Donation amount in PKR |
| donor_name | TEXT | Donor's name |
| donor_email | TEXT | Donor's email |
| payment_status | TEXT | pending/completed/failed |
| receipt_number | TEXT | Auto-generated (EDU-YYYYMMDD-XXXXXXXX) |
| created_at | TIMESTAMP | Donation date |

#### `campaigns`
Stores fundraising campaigns.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique campaign ID |
| title | TEXT | Campaign title |
| description | TEXT | Campaign details |
| target_amount | NUMERIC | Goal amount in PKR |
| raised_amount | NUMERIC | Current amount raised |
| category | ENUM | education/emergency/scholarship/infrastructure/supplies/other |
| urgency | ENUM | low/medium/high/critical |
| image_url | TEXT | Campaign image |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

#### `user_roles`
Manages user permissions (admin/user).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique role ID |
| user_id | UUID (FK) | References auth.users |
| role | ENUM | admin/user |

---

## Database Functions

| Function | Purpose |
|----------|---------|
| `handle_new_user()` | Auto-creates profile and assigns 'user' role on signup |
| `generate_receipt_number()` | Creates unique receipt numbers (EDU-YYYYMMDD-XXXXXXXX) |
| `update_campaign_raised_amount()` | Updates campaign totals when donations are made |
| `update_updated_at_column()` | Auto-updates timestamps |
| `has_role(_user_id, _role)` | Checks if user has specific role (security definer) |

---

## Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Landing page |
| `/auth` | Auth | Login/Signup |
| `/donate` | Donate | Donation form |
| `/history` | History | Donation history (protected) |
| `/profile` | Profile | User profile (protected) |
| `/admin` | Admin | Admin panel (admin only) |

---

## Key Features

### Authentication
- Email/password signup and login
- Auto-confirm enabled for faster testing
- Profile auto-creation on signup
- Role-based access control (admin/user)

### Donations
- Preset amounts: Rs. 500, 1,000, 2,500, 5,000, 10,000, 25,000
- Custom amount input
- Payment methods: Card, JazzCash, Easypaisa (mock)
- Auto-generated receipt numbers
- Downloadable text receipts

### Admin Panel
- Accessible only to users with 'admin' role
- Campaign management
- Donation overview

---

## Security

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only view/edit their own data
- Admins have elevated access via `has_role()` function
- Roles stored in separate table (prevents privilege escalation)

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation
│   ├── Footer.tsx       # Footer
│   ├── Layout.tsx       # Page wrapper
│   ├── CampaignCard.tsx # Campaign display
│   └── ProtectedRoute.tsx # Auth guard
├── hooks/
│   ├── useAuth.tsx      # Authentication state
│   ├── useCampaigns.ts  # Campaign queries
│   ├── useDonations.ts  # Donation mutations
│   └── useProfile.ts    # Profile queries
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Signup
│   ├── Donate.tsx       # Donation form
│   ├── History.tsx      # Donation history
│   ├── Profile.tsx      # User profile
│   └── Admin.tsx        # Admin panel
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── types.ts     # Auto-generated types
└── index.css            # Design system tokens
```

---

## Currency
All amounts are in **Pakistani Rupees (Rs.)**

---

## Environment Variables
Automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
