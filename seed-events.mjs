/**
 * Seed the events table with sample Northeast Mississippi events.
 * Run: node seed-events.mjs
 */

import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("❌ DATABASE_URL not set"); process.exit(1); }

const conn = await createConnection(DATABASE_URL);

const events = [
  {
    title: "Starkville Farmers Market",
    slug: "starkville-farmers-market-apr-2026",
    description: "Shop fresh local produce, handmade goods, and artisan foods from Northeast Mississippi farmers and makers. Every Saturday morning in the Cotton District.",
    eventDate: "2026-04-11",
    eventTime: "7:00 AM – 12:00 PM",
    venue: "Cotton District",
    location: "Starkville, MS",
    category: "Food & Drink",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    externalUrl: null,
    featured: true,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "MSU Bulldogs Baseball vs. Ole Miss",
    slug: "msu-baseball-ole-miss-apr-2026",
    description: "The Egg Bowl rivalry comes to the diamond. Don't miss this SEC showdown at Dudy Noble Field. Gates open one hour before first pitch.",
    eventDate: "2026-04-12",
    eventTime: "2:00 PM",
    venue: "Dudy Noble Field",
    location: "Starkville, MS",
    category: "Sports",
    price: "$10–$25",
    imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    externalUrl: "https://hailstate.com",
    featured: true,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Live Music at The Warehouse",
    slug: "live-music-warehouse-apr-2026",
    description: "Local indie and blues acts take the stage for a night of live music. 21+ after 10 PM. Doors open at 7 PM.",
    eventDate: "2026-04-12",
    eventTime: "8:00 PM",
    venue: "The Warehouse",
    location: "Columbus, MS",
    category: "Music",
    price: "$10",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    externalUrl: null,
    featured: true,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Tupelo Honey Festival",
    slug: "tupelo-honey-festival-2026",
    description: "Celebrate the region's famous Tupelo honey with tastings, live music, and local vendors. Family-friendly event with activities for kids.",
    eventDate: "2026-04-18",
    eventTime: "10:00 AM – 6:00 PM",
    venue: "Tupelo Fairgrounds",
    location: "Tupelo, MS",
    category: "Food & Drink",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Gallery Night: Spring Exhibition",
    slug: "gallery-night-spring-2026",
    description: "Opening reception for the spring exhibition featuring works by Northeast Mississippi artists. Wine and light refreshments provided.",
    eventDate: "2026-04-17",
    eventTime: "6:00 PM – 9:00 PM",
    venue: "Starkville Arts Center",
    location: "Starkville, MS",
    category: "Arts & Culture",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "5K Run for the Community",
    slug: "5k-run-community-2026",
    description: "Annual charity 5K run through the beautiful Noxubee National Wildlife Refuge. All proceeds benefit local schools. Register online.",
    eventDate: "2026-04-19",
    eventTime: "8:00 AM",
    venue: "Noxubee National Wildlife Refuge",
    location: "Brooksville, MS",
    category: "Sports",
    price: "$25",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Garden Tour: Historic Homes",
    slug: "garden-tour-historic-homes-2026",
    description: "Self-guided tour of historic Columbus gardens in bloom. Tickets include access to 8 private gardens. Shuttle service available.",
    eventDate: "2026-04-20",
    eventTime: "10:00 AM – 4:00 PM",
    venue: "Various Locations",
    location: "Columbus, MS",
    category: "Home & Garden",
    price: "$20",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Comedy Night at City Grille",
    slug: "comedy-night-city-grille-2026",
    description: "Stand-up comedy showcase featuring regional comedians. Dinner reservations recommended. Two-drink minimum.",
    eventDate: "2026-04-25",
    eventTime: "7:30 PM",
    venue: "City Grille",
    location: "Starkville, MS",
    category: "Things To Do",
    price: "$15",
    imageUrl: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Earth Day Cleanup: Oktibbeha County",
    slug: "earth-day-cleanup-2026",
    description: "Join volunteers for a community cleanup of local parks and waterways in honor of Earth Day. Gloves and bags provided.",
    eventDate: "2026-04-22",
    eventTime: "9:00 AM – 12:00 PM",
    venue: "Oktibbeha County Lake",
    location: "Starkville, MS",
    category: "Things To Do",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
  {
    title: "Bluegrass on the Square",
    slug: "bluegrass-on-the-square-2026",
    description: "Free outdoor bluegrass concert on the Starkville town square. Bring lawn chairs and blankets. Food trucks on site.",
    eventDate: "2026-05-02",
    eventTime: "5:00 PM – 9:00 PM",
    venue: "Starkville Town Square",
    location: "Starkville, MS",
    category: "Music",
    price: "Free",
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    externalUrl: null,
    featured: false,
    status: "published",
    contactName: null,
    contactEmail: null,
  },
];

try {
  console.log(`🌱 Seeding ${events.length} events...`);
  let inserted = 0;
  let skipped = 0;

  for (const ev of events) {
    try {
      await conn.execute(
        `INSERT INTO events (title, slug, description, eventDate, eventTime, venue, location, category, price, imageUrl, externalUrl, featured, status, contactName, contactEmail)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ev.title, ev.slug, ev.description, ev.eventDate, ev.eventTime, ev.venue, ev.location, ev.category, ev.price, ev.imageUrl, ev.externalUrl, ev.featured ? 1 : 0, ev.status, ev.contactName, ev.contactEmail]
      );
      inserted++;
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`✅ Seeded: ${inserted} inserted, ${skipped} already existed`);
} finally {
  await conn.end();
}
