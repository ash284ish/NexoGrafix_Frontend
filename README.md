# Nexografix Frontend (Next.js)

Nexografix is an enterprise-focused technology + AI-enabled services brand for Publishing, Content Operations, Assessments, and Automation.  
This repository contains the **frontend website** built with **Next.js (App Router)**, using a premium UI system with reusable sections, animated components, and production-ready layout.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- next/font (Inter)
- react-icons
- Next Image (`remotePatterns` enabled)

---

## Key UI/UX Highlights

- Premium **SiteHeader** with dropdown menus:
  - Home
  - Solutions
  - Products
  - Resources
  - Book an Appointment CTA
- Premium **SiteFooter**:
  - Newsletter + CTA buttons
  - Structured link columns (Home / Product / Resources / Solutions / Contact)
  - Social icons
  - Clean gradient background + subtle motion elements
- Brand theme (orange + soft cream background) aligned across all pages

---

## Pages & Routes

> App Router pages live under `app/`

- `/` — Homepage
- `/about` — About Nexografix
- `/contact` — Contact / Appointment
- `/blog` — Blog / Insights listing
- `/faqs` — FAQs page
- `/feedback` — Feedback page

### Solutions
- `/solutions/ai`
- `/solutions/publishing`
- `/solutions/content`
- `/solutions/bpo`
- `/solutions/web-development`
- `/solutions/mobile-development`
- `/solutions/product-engineering`

### Products
- `/products/arohio`

---

## Project Structure

- `app/`
  - `layout.tsx` — Root layout (Header/Footer + global providers)
  - `page.tsx` — Homepage
  - route folders like `about/`, `contact/`, `solutions/`, `products/`, etc.
- `components/`
  - `SiteHeader.tsx`
  - `SiteFooter.tsx`
  - `CustomCursor.tsx`
  - Other UI sections: hero, testimonials, marquee, blog cards, etc.
- `public/`
  - `images/` — local assets, favicon, UI images
- `styles/`
  - `globals.css`

---

## Getting Started (Local Dev)

Install dependencies:

```bash
npm install
