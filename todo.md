# CityRizz TODO

## Newsletter & Subscriber Management
- [x] Add subscribers table to drizzle/schema.ts and run db:push
- [x] Build newsletter subscribe/unsubscribe API endpoints (tRPC)
- [x] Send SendGrid confirmation email on signup
- [x] Send SendGrid unsubscribe confirmation email
- [x] Build admin subscriber dashboard (view list, export CSV)
- [x] Update NewsletterPage.tsx to use real tRPC subscribe mutation
- [x] Add unsubscribe page at /unsubscribe?token=...

## Category Pages
- [x] Fix /category/music — slug not found (WP slug mapping)
- [x] Fix /category/opinion — slug not found (WP slug mapping)

## New Pages
- [x] Build Events page at /events (modeled after CityBeat events page)
- [x] Build Advertise page at /advertise (modeled after CityBeat advertise page)

## Header / Navigation
- [x] Add dropdown submenus to main nav (matching CityBeat second image)
- [x] Fix hamburger menu — currently non-functional, needs full menu layout from second image

## Events — Real Data Source
- [x] Add events table to drizzle/schema.ts and run db:push
- [x] Add event DB helpers to server/db.ts
- [x] Build events tRPC router (list, getById, submit)
- [x] Update EventsPage.tsx to use tRPC queries instead of mock data
- [x] Persist submit-event form to DB via tRPC mutation

## Send Campaign Feature
- [x] Add campaigns table to drizzle/schema.ts and run db:push
- [x] Build campaign tRPC router (create, send, list history)
- [x] Add SendGrid bulk send helper to server/email.ts
- [x] Build Send Campaign UI in AdminSubscribersPage (compose, preview, send)
- [x] Show campaign history in admin dashboard

## Admin Access
- [x] Promote owner user to admin role in the database (auto-promoted via upsertUser on first login)

## Login & Admin Access
- [x] Add visible Login button to the site header for the owner to authenticate
- [x] Auto-promote OWNER_OPEN_ID to admin on first OAuth login (server-side hook in upsertUser)

## Public Site Cleanup
- [x] Remove Login/Admin/Sign Out from cityrizz.com header (keep on Manus admin site only)
