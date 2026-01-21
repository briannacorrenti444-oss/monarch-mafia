# Monarch Mafia

An impact platform founded by Brianna Correnti.

**Live Site:** [monarchmafia.com](https://monarchmafia.com) (once deployed)

---

## Overview

Monarch Mafia is a personal and professional platform showcasing purpose-driven work across four pillars:

- **Climate Tech** — Advancing clean energy solutions
- **Health** — Relational psychology and human development
- **Culture** — Poetry, writing, STEM education, and preserving humanity
- **Community** — Homeless outreach and hands-on service

---

## Tech Stack

- **HTML5** — Semantic markup with accessibility considerations
- **CSS3** — Custom properties, mobile-first responsive design
- **Vanilla JavaScript** — Minimal, progressive enhancement only
- **Netlify** — Static hosting with form handling

No build tools, no frameworks, no dependencies.

---

## Project Structure

```
MonarchMafia/
├── index.html              # Home page
├── about.html              # About page
├── goals.html              # Goals overview
├── connect.html            # Contact form (Netlify Forms)
├── goals/
│   ├── climate-tech.html   # Climate Tech subpage
│   ├── health.html         # Health subpage
│   ├── culture.html        # Culture subpage
│   └── community.html      # Community subpage
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # JavaScript (mobile nav, form validation)
├── images/
│   └── .gitkeep            # Placeholder for images
├── content/
│   ├── site-copy.md        # All site copy in Markdown
│   └── linkedin-profile.md # LinkedIn content
├── favicon.ico             # Favicon (to be added)
└── README.md               # This file
```

---

## Deployment on Netlify

### Option 1: Deploy via Git (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Select your Git provider and repository
   - Configure build settings:
     - **Build command:** (leave blank - no build needed)
     - **Publish directory:** `.` (root)
   - Click "Deploy site"

3. **Configure Domain (Optional)**
   - In Site settings > Domain management
   - Add custom domain: `monarchmafia.com`
   - Follow Netlify's DNS configuration instructions

### Option 2: Deploy via Drag and Drop

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `MonarchMafia` folder onto the page
3. Site deploys immediately with a temporary URL
4. Claim the site to your Netlify account for permanent hosting

### Option 3: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

---

## Netlify Forms Setup

The contact form on `/connect.html` uses Netlify Forms. This works automatically when deployed to Netlify — no additional configuration needed.

**How it works:**
- Form includes `data-netlify="true"` attribute
- Form includes `name="contact"` attribute
- Submissions appear in Netlify dashboard under "Forms"

**To receive email notifications:**
1. Go to Site settings > Forms > Form notifications
2. Add email notification for the "contact" form
3. Specify recipient email address

**Spam protection:**
- Honeypot field (`netlify-honeypot="bot-field"`) is already configured
- Enable Akismet in Netlify dashboard for additional protection if needed

---

## Content Updates

### Updating Site Copy

All written content is documented in `/content/site-copy.md`. To update content:

1. Edit the relevant section in `site-copy.md`
2. Copy the updated text to the corresponding HTML file
3. Commit and push changes (auto-deploys if connected to Git)

### Content Placeholders

The following placeholders need to be replaced with actual content:

| Location | Placeholder | Description |
|----------|-------------|-------------|
| `about.html` | `[INSERT PERSONAL BIOGRAPHY...]` | Educational background and career journey |
| `goals/climate-tech.html` | `[INSERT SPECIFIC ROLE...]` | NuScale Power contributions |
| `connect.html` | `[INSERT-LINKEDIN-USERNAME]` | LinkedIn profile URL |

### Adding Images

1. Add images to the `/images/` directory
2. Recommended subdirectories:
   - `/images/community/` — Community service photos
   - `/images/og-image.jpg` — OpenGraph social sharing image
   - `/images/apple-touch-icon.png` — iOS home screen icon
3. Update image `src` attributes in HTML files
4. Ensure all images have descriptive `alt` text

**Image Guidelines:**
- Optimize images for web (compress before uploading)
- Recommended formats: WebP, JPEG, PNG
- OpenGraph image: 1200x630px recommended
- Apple touch icon: 180x180px

---

## Favicon Setup

Replace the placeholder favicon with your actual favicon:

1. Generate favicons at [favicon.io](https://favicon.io) or similar
2. Add files to root directory:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (in `/images/`)
3. Update `<link>` tags in HTML files if needed

---

## Development

### Local Preview

Open `index.html` directly in a browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Code Style

- **HTML:** Semantic elements, ARIA attributes where needed
- **CSS:** BEM-inspired naming, CSS custom properties for theming
- **JS:** Vanilla ES6+, IIFE pattern, progressive enhancement

### Accessibility Checklist

- [x] Semantic HTML structure
- [x] ARIA labels on interactive elements
- [x] Skip link (could be added)
- [x] Color contrast meets WCAG AA
- [x] Focus states visible
- [x] Keyboard navigation works
- [x] Alt text on images (placeholders ready)
- [x] Form labels associated with inputs
- [x] Reduced motion support

---

## Browser Support

Designed for modern browsers:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

CSS custom properties and modern layout features are used. No polyfills included.

---

## Architecture Decisions

### Why No Build Tools?

- **Simplicity** — No npm, no webpack, no complexity
- **Longevity** — HTML/CSS/JS won't break with dependency updates
- **Speed** — No build step means instant deploys
- **Portability** — Works anywhere, no environment setup needed

### Why Duplicate Header/Footer?

Without a build tool or server-side includes, HTML must be duplicated across pages. Trade-offs:
- **Pro:** Zero JavaScript dependency for core content
- **Con:** Updates require changing multiple files

Future options:
- Use Netlify Edge Functions for includes
- Migrate to a static site generator (11ty, Hugo)
- Use JavaScript to load header/footer (progressive enhancement)

### Why Netlify?

- Free tier generous for static sites
- Built-in form handling (no backend needed)
- Automatic HTTPS
- Git-based deploys
- Global CDN

---

## License

All rights reserved. Content and code are proprietary to Monarch Mafia / Brianna Correnti.

---

## Contact

For questions about this project, use the contact form at [monarchmafia.com/connect](https://monarchmafia.com/connect.html).
