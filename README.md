# MindsEye Android OS - Educational Web Simulation

**Live Demo (Cloud Run):** (set after deployment)
**Submission for:** Google AI "New Year, New You" Portfolio Challenge 2026  
**Author:** Peace Thabiwa (@PEACEBINFLOW)

---

## Overview

MindsEye Android OS is an educational web simulation that presents a multi-repository AI automation ecosystem as an Android-style operating system.

This portfolio is built as a document-first system:
- Each repository is represented as a structured XML document
- Navigation mimics Android (home, back, recents)
- Flowcharts are served as static SVG artifacts
- “Frozen data” by design — no dynamic backend required

If live data is needed in the future, it must be implemented as a separate backend service and integrated explicitly.

---

## Key Features

- Android-style interface (home, back, recents)
- Repository Apps (each repo opens as a document screen)
- Tutorials (progressive lessons)
- Flowcharts (static SVG architecture diagrams)
- Offline-ready (PWA + Service Worker caching)
- Mobile-first gestures (swipe back, swipe home)

---

## Technology

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Docs: XML + JSON + SVG
- Deployment: Google Cloud Run
- Optional compatibility: GitHub Pages

---

## Local Run

### Option A: Open directly
Open `index.html` in your browser.

### Option B: Local static server
```bash
python -m http.server 8000

Then open:
http://localhost:8000

Deploy to Cloud Run
gcloud run deploy mindseye-android \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
