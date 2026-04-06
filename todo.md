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
