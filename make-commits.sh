#!/usr/bin/env bash
# Run this INSIDE your cloned Wede-part2 repo AFTER copying these project files into it.
# It creates several small, descriptive commits (rubric: "multiple descriptive commits") and pushes them.
set -e
c() { git add "$@" && git commit -m "$MSG"; }
MSG="Add shared stylesheet with accordion, tabs, modal, lightbox, map and form styles" c css/style.css
MSG="Add content data file for dynamic resources, events, map locations and gallery" c js/data.js
MSG="Add JavaScript: navigation, accordion, tabs, modal, search/filter/sort, lightbox and map" c js/script.js
MSG="Add descriptively named gallery images for SEO and lightbox" c images/
MSG="Update home page: dynamic upcoming events, gallery with lightbox, JSON-LD and SEO meta tags" c index.html
MSG="Update about page: accessible Mission/Vision/Audience tabs and SEO meta tags" c about.html
MSG="Update resources page: dynamic searchable listings, FAQ accordion, details modal and SEO tags" c resources.html
MSG="Add enquiry page with validated form and instant cost/availability response" c enquiry.html
MSG="Rebuild contact page: validated form, compiled email with AJAX send, mailto fallback, Leaflet map" c contact.html
MSG="Add robots.txt and sitemap.xml for search engine crawling" c robots.txt sitemap.xml
MSG="Update README with Part 3 features, changelog (Part 2 feedback edits), deployment steps and references" c README.md
git push origin main
