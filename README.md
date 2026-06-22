# FOMO / Hive

Early-development Expo app for discovering, creating, saving, and mapping local events.

The native project name is currently `FOMO`; several in-app screens use the product name
`Hive`. Pick one brand name before release and update the UI copy, `app.json`, and package
metadata together.

## Stack

- Expo SDK 54 with Expo Router
- React 19 / React Native 0.81
- TypeScript with strict mode
- Supabase Auth, Database, and Storage
- Expo Location and Image Picker
- React Native Maps

## Prerequisites

- Node.js and npm
- Expo development tooling through `npx expo`
- A Supabase project with the tables and storage buckets described in
  [`docs/supabase-schema.sql`](docs/supabase-schema.sql)

## Setup

```sh
npm install
cp .env.example .env
```

Fill in `.env`:

```sh
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The anon key is safe to use in a mobile client when Row Level Security policies are set
correctly. Do not commit `.env` or service-role keys.

## Run

```sh
npm run start
```

Useful variants:

```sh
npm run ios
npm run android
npm run web
```

## Quality checks

```sh
npm run lint
npm run typecheck
```

## App routes

- `/` - landing page
- `/login`, `/signup` - email/password auth
- `/home` - event feed with city, search, and category filters
- `/discover` - category/community discovery prototype
- `/create` - event creation with optional image upload and geocoding
- `/event-details` - event detail plus save/interested/going actions
- `/map` - map view for geocoded events
- `/profile` - profile and avatar editing
- `/saved` - saved and going event lists

## Supabase resources

The app expects:

- Tables: `profiles`, `events`, `saved_events`, `event_interests`
- Storage buckets: `avatars`, `event-images`
- Auth: email/password enabled

Start with [`docs/supabase-schema.sql`](docs/supabase-schema.sql), then tighten policies as
product requirements become clearer.

## Current early-development gaps

- Social auth buttons are UI-only.
- `discover` still uses static sample content.
- Event details show placeholder organizer/about/location copy.
- No automated tests are present yet.
- Map support depends on native platform map configuration.
