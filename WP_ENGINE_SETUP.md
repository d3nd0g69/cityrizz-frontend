# CityRizz — WP Engine + WPGraphQL Setup Guide

This guide explains how to connect your CityRizz frontend to your WP Engine WordPress backend.

---

## Step 1: Install WPGraphQL on WP Engine

1. Log in to your WP Engine WordPress admin (`https://your-site.wpengine.com/wp-admin`)
2. Go to **Plugins → Add New**
3. Search for **WPGraphQL** and install + activate it
4. Go to **GraphQL → Settings** and confirm the endpoint is `/graphql`
5. Test it by visiting: `https://your-site.wpengine.com/graphql`

---

## Step 2: Add CORS Headers

Add this to your WordPress theme's `functions.php` (or a custom plugin):

```php
add_action('init', function() {
    $allowed_origins = ['https://cityrizz.com', 'http://localhost:3000'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});
```

---

## Step 3: Set Your Environment Variable

In your Vercel project dashboard:
1. Go to **Settings → Environment Variables**
2. Add: `VITE_WORDPRESS_API_URL` = `https://your-site.wpengine.com/graphql`

For local development, create a `.env` file (never commit to Git):
```
VITE_WORDPRESS_API_URL=https://your-site.wpengine.com/graphql
```

---

## Step 4: Switch from Mock Data to WPGraphQL

In your page components, replace imports from `@/lib/mockData` with calls to `@/lib/wpgraphql`:

```typescript
// Before (mock data)
import { posts, getFeaturedPosts } from "@/lib/mockData";

// After (live WP Engine data)
import { getAllPosts, getFeaturedPostsFromWP } from "@/lib/wpgraphql";

// In your component:
const [posts, setPosts] = useState([]);
useEffect(() => {
  getAllPosts(20).then(setPosts);
}, []);
```

---

## Step 5: WordPress Content Setup

For the best results, configure WordPress as follows:

- **Permalinks**: Settings → Permalinks → Post name (`/%postname%/`)
- **Featured Images**: Always set a featured image on every post
- **Categories**: Create categories matching: News, Arts & Culture, Food & Drink, Music, Politics, Sports, Opinion, Things To Do
- **Sticky Posts**: Mark your top 3 stories as "sticky" to appear in the hero section
- **Author Bios**: Fill in author descriptions under Users → Edit User → Biographical Info

---

## Step 6: Optional — WPGraphQL for Advanced Custom Fields (ACF)

If you want custom fields (e.g., subtitle, read time, custom category color):
1. Install **Advanced Custom Fields** plugin
2. Install **WPGraphQL for ACF** plugin
3. Create field groups and enable "Show in GraphQL"
4. Update queries in `src/lib/wpgraphql.ts` to include your custom fields

---

## GitHub + Vercel Deployment

1. Push this project to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) → Import Git Repository
3. Select your `cityrizz` repo
4. Set environment variable: `VITE_WORDPRESS_API_URL`
5. Deploy — Vercel auto-detects Vite/React
6. Add your custom domain `cityrizz.com` in Vercel → Settings → Domains

---

## GoDaddy DNS Configuration

In GoDaddy DNS Manager for `cityrizz.com`:

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 76.76.21.21              | 600  |
| CNAME | www  | cname.vercel-dns.com     | 600  |

Vercel will automatically provision a free SSL certificate once DNS propagates (5–30 minutes).
