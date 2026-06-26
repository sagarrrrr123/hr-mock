# Hyre — AI Hiring Platform (clickable demo mock)

A high-fidelity, **front-end only** prototype of the AI hiring & onboarding platform — built for an internal team demo. No backend, no real AI, no integrations: everything runs on in-memory mock data and simulated actions.

## Run it

```bash
cd hr-mock
npm install      # already done if node_modules exists
npm run dev      # opens http://localhost:5180
```

Build / preview:
```bash
npm run build && npm run preview
```

## Demo golden path (click this through)

1. **Jobs → Create job** → publish it.
2. Open **View Candidate Portal** (sidebar, bottom) → pick a job → **Apply** → upload resume → watch the AI "parse" + score → submit.
3. **Pipeline** → drag a candidate Applied → Shortlisted → Interview (booking-link toast fires).
4. **Interviews → Submit scorecard** (structured 1–5 + recommendation).
5. **Offers → Generate offer** → send.
6. **Candidate Portal** (top-right role switch → Candidate, or the sidebar link) → **Offer tab → Accept** 🎉.
7. **Onboarding** → tick a checklist item; see doc verification + masked PII.
8. **Analytics** → Funnel, Time-to-hire, Interviewer calibration, Source ROI, **Forecast** (13/20 + recommendation).
9. **Talent CRM** → Silver-Medalist pool + active outreach campaign.
10. **AI Assistant** (top bar ✨) → "top candidates for DevOps", "hiring forecast".

## Switch roles
Top-right avatar → **Demo · Switch Role**: Admin, Recruiter, Hiring Manager, Interviewer, Analyst, IT Admin, Individual HR, and **Candidate** (jumps to the portal). Nav + permissions update live.

## What's covered (maps to the PDFs)
- 8 roles + RBAC-gated navigation
- Full pipeline: Apply → AI parse → match score → shortlist → activity → interview (3 scheduling modes + AI phone screen) → scorecard → offer → hired → onboarding + doc verification
- **Talent CRM** (pools, silver-medalist, outreach campaigns, candidate database search)
- **Analytics** (funnel, time-to-hire, interviewer calibration, source ROI, forecast)
- **Candidate Portal** (passwordless login, status tracker, self-service reschedule/onboarding/offer, messaging)
- Supporting: skills map, find-past-matches (rediscovery), post-to-job-boards, SMS/WhatsApp channels, attrition prediction, background verification, SSO/SCIM, audit log, AI assistant

## Stack
React + TypeScript + Vite · Tailwind CSS · Recharts · lucide-react · react-router. All mock data lives in `src/data/seed.ts`; state + actions in `src/data/store.tsx`.

> This is a **mock**. To make it real, wire `src/data/store.tsx` actions to the backend/API described in the technical blueprint.
