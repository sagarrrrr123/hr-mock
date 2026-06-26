# Presenter Guide — Hyre demo

> A talk-track for walking the team through the mock. ~8–10 min. Remember to frame it up front: **"This is a clickable prototype with fake data — it shows the product vision and every feature, not the final UI or real AI."**

## 0. Setup (before you present)
- `cd hr-mock && npm run dev` → opens http://localhost:5180
- Start as **Admin** (default) so you can see everything.
- Know the two big controls: top-right **avatar = Switch Role**; sidebar bottom **View Candidate Portal**.

## 1. The one-liner (15 sec)
"Hyre automates the entire hiring journey — a candidate applies, AI reads and scores their resume, we run interviews and offers, and onboard them — with most of the busywork done automatically. Today I'll show the product end-to-end, plus the three big bets we're adding next."

## 2. The dashboard (1 min)
Open **Dashboard**. Point at:
- KPI cards — "these are our north-star numbers: time-to-hire, offer acceptance, pipeline."
- **Hiring forecast card** — "this is new: we predict 13 hires against a target of 20 and recommend the fix (+35% sourcing). That's the Ashby-grade analytics we don't have today."

## 3. The golden path — tell it as one candidate's story (5 min)
**a) A candidate applies.** Sidebar → **View Candidate Portal** → pick a job → **Apply** → click the resume box → *watch the AI "parse" and score in real time* → submit. "No backend — but this is exactly the flow: upload once, AI extracts skills and gives a 0–100 match score."

**b) They show up scored.** Back in the app → **Candidates** → "every applicant arrives pre-scored and pre-sorted. Recruiters filter by skill, score, source — and there's semantic search."

**c) Move them through the pipeline.** **Pipeline** → drag a card Applied → Shortlisted → Interview. "Dragging to Interview auto-sends a booking link; to Offer it kicks off the offer. The whole funnel is a drag-and-drop board."

**d) Interview + feedback.** **Interviews** → "three ways to schedule — recruiter books, send a link, or candidate self-books — plus an optional AI phone screen." → **Submit scorecard** → "structured 1–5 ratings so feedback is consistent and bias shows up in analytics."

**e) Offer.** **Offers → Generate offer** → PDF preview → send. "Auto-generated letter, emailed with accept/reject links."

**f) Candidate accepts.** Switch role → **Candidate** (or portal link) → **Offer tab → Accept** 🎉. "Candidates get one passwordless portal — track status, reschedule, accept offers, complete onboarding, message us."

**g) Onboarding.** **Onboarding** → tick a checklist item. "Auto-checklist across HR/IT/Finance/Legal, document verification, and sensitive data (PAN/Aadhaar/bank) encrypted."

## 4. The three big bets (2 min) — "this is what turns us from an ATS into a platform"
1. **Talent CRM** → **Talent CRM** → Talent Pools → **Silver-Medalist Engineers**. "Today rejected candidates are lost. Now every candidate is a reusable asset — pools, and outreach campaigns to re-engage them. This is the #1 thing that lowers cost-per-hire."
2. **Advanced analytics** → **Analytics** → click through Funnel, Interviewer calibration, Source ROI, **Forecast**. "Where candidates drop off, which interviewer is the bottleneck, and will we hit target."
3. **Candidate portal** (already shown in step f) — "consumer-grade experience → higher offer acceptance, less recruiter chasing."

## 5. Quick hits (30 sec) — open each for one sentence
- **Jobs → a job → Recommendations** = "AI finds past applicants who fit — monetizes the CRM data."
- **Jobs → Post to job boards** = one-click LinkedIn/Indeed.
- **AI Assistant** (top bar ✨) = "ask it 'top candidates for DevOps' or 'forecast'."
- **Communications** = SMS/WhatsApp/Telegram, two-way.
- **Attrition Risk** = predicts who might quit early.
- **Admin** = roles, integrations, SSO/SCIM, audit log.

## 6. Roles (15 sec)
Top-right **Switch Role** → "every role sees only what they need — Recruiter, Hiring Manager, Interviewer, Analyst (reports only), IT Admin, and **Individual HR** for solo operators. Plus the separate candidate experience."

## 7. Close
"That's the full vision in a clickable form. It's a mock — the next step is wiring these screens to the real backend and AI. Questions?"

## Honest caveats to have ready
- "Data is fake and resets on refresh." • "AI is simulated (canned responses + a fake parse)." • "No real emails/calendar/payments." • "This is about flow and features, not final visual design."
