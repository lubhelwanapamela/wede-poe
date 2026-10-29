# Campus Connect

Campus Connect is a student-focused website that brings academic support, study resources, campus events and wellbeing information into one place, so students don't have to search across multiple sites and social media pages.

**Module:** WEDE5020 Web Development (Introduction) | **Part:** 3 (POE) - Enhancing Functionality and SEO
**Student:** Noxolo Pamella Lubhelwana | **Student number:** `[ADD YOUR STUDENT NUMBER]`
**Repository:** https://github.com/lubhelwanapamela/Wede-part2
**Live site (GitHub Pages):** https://lubhelwanapamela.github.io/Wede-part2/

---

## Site structure

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Overview, dynamic upcoming events, student-life gallery with lightbox |
| About | `about.html` | Mission, vision and audience in an accessible tabbed panel |
| Resources | `resources.html` | Dynamic, searchable, filterable and sortable resources/events; FAQ accordion; details modal |
| Enquiry | `enquiry.html` | Service enquiry form that validates input and responds with cost and availability |
| Contact | `contact.html` | Contact form that compiles and sends an email, plus an interactive Leaflet map |

Supporting files: `css/style.css`, `js/script.js`, `js/data.js` (content data), `images/` (descriptively named gallery images), `robots.txt`, `sitemap.xml`.

## Part 3 features

### JavaScript enhancements
- **Accordion** (FAQ, `resources.html`): one panel open at a time, `aria-expanded` kept in sync.
- **Tabs** (`about.html`): Mission / Vision / Audience, with arrow-key navigation and ARIA roles.
- **Modal** (`resources.html`): "View details" opens an accessible dialog; closes with the button, overlay click or Esc; focus returns to the trigger.
- **Interactive map** (`contact.html`): Leaflet + OpenStreetMap with markers, popups and buttons that fly to each location. The location pins are sample points and should be replaced with the real campus locations.
- **Animations and transitions:** CSS keyframes/transitions plus `IntersectionObserver` scroll reveals, animated counters and progress bars. All motion is disabled when the user prefers reduced motion.
- **Advanced DOM manipulation:** all dynamic content is built with `createElement`/`textContent` (never `innerHTML` with data), which also prevents XSS.
- **Gallery with lightbox** (`index.html`): 8 lazy-loaded images, keyboard (Esc, left/right arrows) and button controls, captions and position counter.

### Dynamic content and search
- Resources and events are rendered from `js/data.js` using JavaScript (homepage shows the three upcoming events).
- `resources.html` has live **search** (multi-word, matches title, description, place and tags), **category filter chips**, **sort** (date or A-Z), a result counter, an empty state and a **Load more** button.

### SEO
- **Unique `<title>` and meta description** on every page; **meta keywords** per page; canonical URLs; Open Graph and Twitter tags; JSON-LD `Organization` data on the home page.
- **Keyword research:** primary keywords were chosen from what students search for: *student support, campus events, study resources, peer tutoring, past papers, student wellbeing, NSFAS/bursaries, South Africa*. They are worked into titles, headings (one `H1` per page, logical `H2`/`H3`), body text and alt text.
- **Image optimisation:** descriptive file names (e.g. `student-peer-tutoring-session.svg`), meaningful alt text, `width`/`height` set, `loading="lazy"`.
- **Clean URLs and internal linking:** short descriptive file names; navigation, footer and in-page calls-to-action link between pages.
- **Mobile-friendly:** responsive layout, `viewport` meta tag, off-canvas navigation below 720px.
- **Off-page SEO plan:** backlinks (student council, faculty and residence pages, campus societies, university library guides), social profiles linked in the footer (Instagram, X, Facebook), and local SEO (South African English, Gauteng region and `Organization` address data).
- **`robots.txt`** and **`sitemap.xml`** are in the repository root.
- **Page speed:** no frameworks, `defer` on scripts, preconnect for fonts, lazy-loaded images, lightweight SVG images, no render-blocking JS.
- **Security:** Content-Security-Policy meta tag, `referrer` policy, `rel="noopener noreferrer"` on external links, output built with `textContent`, honeypot field against form spam, input length limits and validation.

### Forms and validation
- **`enquiry.html`:** name, email, optional phone and student number, service dropdown, number of sessions, preferred date, notes and consent checkbox. After validation it **processes the input and shows an instant response**: the service, an estimated cost (e.g. sponsoring events is R2 500 per event, other services are free), availability for the chosen date (weekends are flagged) and next steps.
- **`contact.html`:** name, email, optional phone, message type dropdown, subject, message (20-500 characters with live counter). After validation the details are **compiled into an email** addressed to the recipient set in `js/script.js` (`RECIPIENT`), shown as a preview and **sent asynchronously with AJAX (`fetch`)** through the FormSubmit service. If the request fails or the user is offline, a one-click "Open my email app" link (`mailto:`) with the compiled message is offered so the client can still send it.
- **Validation:** HTML5 attributes (`required`, `type`, `min`/`max`, `minlength`/`maxlength`) plus JavaScript checks for name format, email format, South African phone numbers, student number length, dates (not in the past, within 6 months), number ranges and consent. Errors appear next to the field with `role="alert"`, fields are marked valid/invalid, and focus moves to the first error.

## Changelog

### Part 3 - new work
| # | Area | Change |
|---|------|--------|
| 1 | Interactive | Added FAQ accordion, About tabs, details modal, gallery lightbox and Leaflet map (see features above). |
| 2 | Dynamic content | Replaced hard-coded event/resource cards with JavaScript-rendered content from `js/data.js`; added search, filter chips, sorting, counter, empty state and Load more. |
| 3 | Forms | Created `enquiry.html` (instant cost/availability response) and rebuilt `contact.html` (email compile + AJAX send + mailto fallback) with full client-side validation and accessible error messages. |
| 4 | SEO | Unique titles, meta descriptions and keywords, canonical, Open Graph, JSON-LD, descriptive image names and alt text, header hierarchy, internal links. |
| 5 | SEO | Added `robots.txt` and `sitemap.xml`. |
| 6 | Performance and security | Deferred scripts, lazy-loaded images, Content-Security-Policy, referrer policy, safe DOM building, honeypot. |
| 7 | Accessibility | Skip link, `aria-current` in navigation, `aria-expanded`/`aria-pressed`, dialog roles, visible focus styles, reduced-motion support. |
| 8 | Navigation | Added **Enquiry** to the main menu and footer on every page. |
| 9 | Deployment | Published through GitHub Pages (steps below). |

### Edits to Part 2 content
These are the corrections made to the Part 2 pages. **Replace or extend this table with the exact points from your Part 2 marks and feedback so the lecturer can match each entry to a comment.**

| # | Part 2 page | What was changed | Why |
|---|-------------|------------------|-----|
| 1 | All pages | Social links that pointed to `#` now link to the social platforms and open safely in a new tab. | Placeholder links did not go anywhere. |
| 2 | `index.html` | "How it works" step titles changed from `h4` to `h3`. | Fixes the heading hierarchy (no skipped levels). |
| 3 | `resources.html` | Every "Book a session / Get feedback / Request access" button pointed to the contact page; the resources are now dynamic and "Enquire about this" links to the enquiry form. | Gives visitors a form designed for service requests. |
| 4 | `resources.html` | Static event cards replaced with searchable, dynamic listings. | Improves findability, one of the original website goals. |
| 5 | All pages | Added a skip link, `aria-label`s and unique page titles/descriptions. | Accessibility and SEO improvements. |
| 6 | All pages | Contact email in the footer now matches the address that receives form messages. | The `campusconnect.co.za` mailbox does not exist yet. |
| 7 | `README.md` | Added Part 3 documentation, changelog and updated references. | Required for Part 3. |

## Running the site locally
No build step is required. Serve the folder with any static server, for example:

```
python -m http.server 8000
```

then visit `http://localhost:8000`. (Opening `index.html` directly also works, but the map and form email service need an internet connection.)

## Deployment (GitHub Pages)
1. Push all files to the `main` branch of the repository.
2. On GitHub open **Settings > Pages**.
3. Under **Build and deployment** choose **Deploy from a branch**, select **main** and **/ (root)**, then **Save**.
4. After about a minute the site is live at `https://lubhelwanapamela.github.io/Wede-part2/`.
5. Open the live URL and check every page, then submit the repository link and live link on the LMS.

**First-time email set-up:** the first time the contact form is submitted from the live site, FormSubmit sends an activation email to the recipient address. Click the link in that email once; after that messages are delivered straight to the inbox.

## Technologies
HTML5, CSS3 (Flexbox/Grid, animations), vanilla JavaScript (ES5-compatible), Leaflet 1.9.4 (via cdnjs), OpenStreetMap tiles, Google Fonts (Poppins), FormSubmit (AJAX email delivery), GitHub and GitHub Pages.

## Design
- **Colour palette:** navy `#0f2545`, blue `#1d4ed8`, sky `#38bdf8` and light grey `#f6f8fb`.
- **Typography:** Poppins with a system-font fallback stack.
- **Responsiveness:** layouts adapt for desktop, tablet and mobile; collapsible navigation below 720px.

## References
CJX Studios (2026) *How much does it cost to register a website in South Africa?* Available at: https://cjxstudio.co.za/website-registration-cost-south-africa-2026 (Accessed: 14 August 2026).

FormSubmit (n.d.) *FormSubmit documentation: AJAX submissions*. Available at: https://formsubmit.co/ (Accessed: 29 October 2026).

GitHub (2026) *About custom domains and GitHub Pages*. Available at: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages (Accessed: 14 August 2026).

GitHub (2026) *GitHub Pages documentation*. Available at: https://docs.github.com/en/pages (Accessed: 14 August 2026).

GitHub (2026) *GitHub Pages limits*. Available at: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (Accessed: 14 August 2026).

Google (n.d.) *Search Engine Optimization (SEO) Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 29 October 2026).

Google Fonts (n.d.) *Poppins*. Available at: https://fonts.google.com/specimen/Poppins (Accessed: 14 August 2026).

Leaflet (n.d.) *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com/ (Accessed: 29 October 2026).

MDN Web Docs (n.d.) *CSS animations*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations (Accessed: 14 August 2026).

MDN Web Docs (n.d.) *Fetch API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API (Accessed: 29 October 2026).

MDN Web Docs (n.d.) *Intersection Observer API*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 14 August 2026).

MDN Web Docs (n.d.) *Client-side form validation*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 29 October 2026).

OpenStreetMap contributors (n.d.) *OpenStreetMap*. Available at: https://www.openstreetmap.org/ (Accessed: 29 October 2026).

Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 29 October 2026).

W3C (n.d.) *WAI-ARIA Authoring Practices Guide*. Available at: https://www.w3.org/WAI/ARIA/apg/ (Accessed: 29 October 2026).

W3Schools (n.d.) *HTML, CSS and JavaScript tutorials*. Available at: https://www.w3schools.com (Accessed: 14 August 2026).

## Author
Noxolo Pamella Lubhelwana
