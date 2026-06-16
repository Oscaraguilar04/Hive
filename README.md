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

`npm run start` uses Expo tunnel mode so the QR code works when your phone is not on the
same network as the development machine, including cloud dev environments.

Useful variants:

```sh
npm run start:lan
npm run start:localhost
npm run start:clear
npm run ios
npm run android
npm run web
```

### QR code troubleshooting

If scanning the Expo QR code does not open the app:

1. Make sure you are using the current Expo Go app for SDK 54.
2. Run `npm run start:clear` and scan the new tunnel QR code.
3. If you are developing locally and your phone is on the same Wi-Fi, `npm run start:lan`
   is also fine. Cloud development should use `npm run start`.
4. If the app opens to a red error screen, confirm `.env` exists and has valid
   `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` values.
5. If the QR scanner still does nothing, open Expo Go manually and paste the URL printed by
   Expo in the terminal.

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
