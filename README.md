# Rigged Motion Studios - Diggezz

This project uses React for the frontend and Supabase for the backend. Follow these instructions to set up your development environment.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (required for local Supabase development)

## Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/JuKa2023/rigged-Motion-Studios_Diggezz2.git
cd rigged-Motion-Studios_Diggezz2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

You can find these values in your Supabase project settings:
- Project URL: Project Settings > API > Project URL
- Anon Key: Project Settings > API > Project API keys > anon public
- Google Client ID: Authentication > Providers > Google > Client ID

## Supabase Setup

### Installing Supabase CLI

1. Install Supabase CLI globally:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

### Local Development with Supabase

1. Start the local Supabase instance:
```bash
supabase start
```

This will create a local Supabase instance with Docker. The CLI will output local URLs and keys - save these for your `.env` file.

2. Apply migrations:
```bash
supabase migration up
```

3. Enable the required tables for real-time updates:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
```

### Remote Database Management

1. Link your project (first time only):
```bash
supabase link --project-ref your-project-ref
```

2. Push changes to remote:
```bash
supabase db push
```

3. Reset remote database (⚠️ Warning: This will delete all data):
```bash
supabase db reset --project-ref your-project-ref
```

### Database Migrations

1. Create a new migration:
```bash
supabase migration new your_migration_name
```

2. Apply migrations:
```bash
# Local
supabase migration up

# Remote
supabase db push
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── supabaseClient/ # Supabase configuration
│   └── styles/        # CSS styles
├── supabase/
│   ├── migrations/    # Database migrations
│   └── config.toml    # Supabase configuration
├── public/            # Static assets
└── .env              # Environment variables
```

## Supabase Features Used

- Real-time subscriptions for auction updates
- Row Level Security (RLS) policies
- Database functions for bid placement
- Authentication with Google OAuth

## Common Issues and Solutions

### Reset Local Supabase Instance

If you need to reset your local Supabase instance:

```bash
supabase stop
supabase start
```

### Update Supabase CLI

To update the Supabase CLI:

```bash
npm install -g supabase@latest
```

### Database Connection Issues

If you can't connect to the local database:

1. Check if Docker is running
2. Try restarting the Supabase instance:
```bash
supabase stop && supabase start
```

3. Verify your environment variables match the Supabase project settings

### Real-time Updates Not Working

1. Check if real-time is enabled for the tables:
```sql
-- Run in Supabase SQL editor
SELECT * FROM supabase_realtime.subscription;
```

2. Verify the publication includes the required tables:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Vite Documentation](https://vitejs.dev/guide/)