# InvoicePro Landing Page

A professional, conversion-optimized landing page for InvoicePro invoicing software.

## Features

- **Fast Loading**: Loads in under 2 seconds
- **Fully Responsive**: Perfect on desktop, tablet, and mobile
- **No Build Process**: Deploy directly - uses Tailwind CSS via CDN
- **SEO Optimized**: Meta tags and semantic HTML for search engines
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Conversion Focused**: Multiple CTAs and trust signals throughout

## Tech Stack

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- No frameworks or build tools required

## File Structure

```
landing-page/
├── index.html          # Main landing page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── assets/
│   ├── images/         # Placeholder for screenshots (add real images here)
│   └── js/
│       └── main.js     # FAQ toggles and smooth scrolling
└── README.md           # This file
```

## Quick Start

1. Open `index.html` in your browser to preview locally
2. Deploy to any static hosting service (see deployment options below)
3. Update placeholder content before going live

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)

**Via Drag & Drop:**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag the `landing-page` folder onto the Netlify dashboard
4. Done! Your site is live

**Via GitHub:**
1. Push this code to a GitHub repository
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - Build command: (leave empty)
   - Publish directory: `landing-page`
6. Click "Deploy site"

**Custom Domain:**
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

### Option 2: Vercel

**Via CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to the landing-page directory
cd landing-page

# Deploy
vercel

# For production
vercel --prod
```

**Via GitHub:**
1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Set root directory to `landing-page`
6. Click "Deploy"

**Custom Domain:**
1. In Vercel dashboard, go to project settings
2. Navigate to "Domains"
3. Add your custom domain and follow DNS instructions

### Option 3: GitHub Pages

1. Create a new GitHub repository
2. Push this code to the repository
3. Go to repository Settings > Pages
4. Under "Source", select your branch (e.g., `main`)
5. Set folder to `/ (root)` or move contents of `landing-page` to root
6. Click "Save"
7. Your site will be live at `https://yourusername.github.io/repository-name`

**Custom Domain:**
1. In repository Settings > Pages
2. Enter your custom domain in "Custom domain" field
3. Configure DNS:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or A records pointing to GitHub's IPs

### Option 4: Traditional Web Hosting

1. Connect to your web host via FTP/SFTP
2. Upload all files from the `landing-page` directory to your web root (usually `public_html` or `www`)
3. Ensure `index.html` is in the root directory
4. Done!

## Pre-Launch Checklist

Before you launch, update these placeholder elements:

### 1. Branding
- [ ] Replace "InvoicePro" with your actual product name (search and replace in all files)
- [ ] Update color scheme in index.html (currently using blue #2563eb)
- [ ] Add your logo (replace text logo in header/footer)

### 2. Images
- [ ] Replace placeholder screenshots with actual app screenshots
  - Dashboard screenshot
  - Invoice editor screenshot
  - Reports screenshot
- [ ] Add hero section app screenshot
- [ ] Optimize images (use WebP format with JPEG fallbacks)
- [ ] Update Open Graph image for social sharing

### 3. Content
- [ ] Verify pricing ($199 launch, $299 regular)
- [ ] Update launch date deadline (currently February 28, 2025)
- [ ] Add real customer testimonials (optional, for later)
- [ ] Update email addresses:
  - support@invoicepro.com → your-support@yourdomain.com
  - sales@invoicepro.com → your-sales@yourdomain.com
  - privacy@invoicepro.com → your-privacy@yourdomain.com
  - legal@invoicepro.com → your-legal@yourdomain.com

### 4. Payment Integration
- [ ] Remove placeholder payment text in final CTA section
- [ ] Add Gumroad, Stripe, or Lemon Squeezy payment button/link
- [ ] Test payment flow end-to-end

### 5. SEO & Analytics
- [ ] Update meta descriptions with real product description
- [ ] Add Google Analytics or Plausible tracking code (optional)
- [ ] Submit sitemap to Google Search Console
- [ ] Add favicon (create favicon.ico and add to root)

### 6. Legal
- [ ] Review and customize privacy policy for your jurisdiction
- [ ] Review and customize terms of service
- [ ] Add company name and registration details in footer
- [ ] Update "Governing Law" section in terms.html

### 7. Performance
- [ ] Test page load speed with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Test on mobile devices
- [ ] Test all links and CTAs
- [ ] Test FAQ accordions
- [ ] Verify smooth scrolling works

## Customization Guide

### Changing Colors

Find this section in `index.html` and update the color values:

```html
<!-- Current color scheme -->
Primary: #2563eb (blue)
Secondary: #059669 (green)
Background: #ffffff (white)
Text: #1e293b (dark gray)
```

Use search and replace to update across the entire file:
- Search: `bg-blue-600` → Replace with your color
- Search: `text-blue-600` → Replace with your color
- Search: `border-blue-600` → Replace with your color

### Adding Real Screenshots

1. Create screenshots at these sizes:
   - Desktop: 1200px wide
   - Ensure images are high quality but optimized
2. Save to `assets/images/`:
   - `dashboard.png` or `dashboard.webp`
   - `invoice-editor.png` or `invoice-editor.webp`
   - `reports.png` or `reports.webp`
3. Update the placeholder divs in index.html:

```html
<!-- Replace this: -->
<div class="screenshot-placeholder">...</div>

<!-- With this: -->
<img src="assets/images/dashboard.webp" alt="Dashboard" class="rounded-lg shadow-lg">
```

### Adding Payment Button

Replace the placeholder payment section in the final CTA:

```html
<!-- Current placeholder: -->
<div class="mt-12 bg-blue-700 bg-opacity-50 rounded-lg p-6 max-w-2xl mx-auto">
    <p class="text-sm text-blue-100">
        <strong>Note:</strong> Payment processing coming soon...
    </p>
</div>

<!-- Replace with Gumroad example: -->
<script src="https://gumroad.com/js/gumroad.js"></script>
<a class="gumroad-button" href="https://gumroad.com/l/your-product">Buy Now</a>

<!-- Or Stripe Checkout button, or Lemon Squeezy, etc. -->
```

## Testing Locally

Simply open `index.html` in your browser. No local server needed!

For a more realistic testing environment:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx http-server -p 8000

# Then visit: http://localhost:8000
```

## Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Benchmarks

Target metrics:
- **Load Time**: < 2 seconds
- **First Contentful Paint**: < 1 second
- **Time to Interactive**: < 3 seconds
- **Lighthouse Score**: 90+

## Support

For questions or issues with this landing page template:
- Create an issue in the repository
- Contact: support@yourdomain.com

## License

This landing page template is part of the InvoicePro project.

---

**Ready to launch?** Follow the pre-launch checklist above, then deploy using one of the options provided. Good luck! 🚀
