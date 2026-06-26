import type {
  User, Job, Candidate, Interview, Activity, Offer, Onboarding, Pool, Campaign, Message, AuditEntry, AttritionRow, Stage,
} from './types'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString()

export const users: User[] = [
  { id: 'u1', name: 'Aarav Mehta', email: 'aarav@hyre.com', role: 'admin', title: 'Head of Talent', active: true },
  { id: 'u2', name: 'Priya Nair', email: 'priya@hyre.com', role: 'recruiter', title: 'Senior Recruiter', active: true },
  { id: 'u3', name: 'Rohan Gupta', email: 'rohan@hyre.com', role: 'hiring_manager', title: 'Eng Manager', active: true },
  { id: 'u4', name: 'Sara Khan', email: 'sara@hyre.com', role: 'interviewer', title: 'Staff Engineer', active: true },
  { id: 'u5', name: 'Devansh Rao', email: 'devansh@hyre.com', role: 'analyst', title: 'People Analyst', active: true },
  { id: 'u6', name: 'Neha Joshi', email: 'neha@hyre.com', role: 'it_admin', title: 'IT Administrator', active: true },
  { id: 'u7', name: 'Sam Solo', email: 'sam@hyre.com', role: 'individual_hr', title: 'Founder / Solo HR', active: true },
]

export const jobs: Job[] = [
  { id: 'j1', title: 'Senior Backend Engineer', department: 'Engineering', location: 'Bengaluru', type: 'Hybrid', status: 'Published', description: 'Own core services, design scalable APIs, mentor the team.', requiredSkills: ['Node.js', 'PostgreSQL', 'AWS', 'System Design', 'TypeScript'], niceSkills: ['Kafka', 'Kubernetes'], ctcMin: 2800000, ctcMax: 4200000, ownerId: 'u3', postedBoards: ['LinkedIn', 'Indeed'], createdAt: daysAgo(22) },
  { id: 'j2', title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Remote', status: 'Published', description: 'Lead end-to-end product design for our hiring suite.', requiredSkills: ['Figma', 'UX Research', 'Prototyping', 'Design Systems'], niceSkills: ['Motion', 'Webflow'], ctcMin: 1800000, ctcMax: 3000000, ownerId: 'u2', postedBoards: ['LinkedIn'], createdAt: daysAgo(15) },
  { id: 'j3', title: 'DevOps Engineer', department: 'Engineering', location: 'Pune', type: 'Onsite', status: 'Published', description: 'Build and run our cloud infra, CI/CD, and observability.', requiredSkills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Linux'], niceSkills: ['Go', 'Prometheus'], ctcMin: 2400000, ctcMax: 3600000, ownerId: 'u3', postedBoards: ['LinkedIn', 'Indeed', 'Hirist'], createdAt: daysAgo(9) },
  { id: 'j4', title: 'Account Executive', department: 'Sales', location: 'Mumbai', type: 'Hybrid', status: 'Published', description: 'Drive new-business revenue across mid-market accounts.', requiredSkills: ['B2B Sales', 'SaaS', 'Negotiation', 'CRM'], niceSkills: ['HR Tech'], ctcMin: 1500000, ctcMax: 2600000, ownerId: 'u2', postedBoards: ['LinkedIn'], createdAt: daysAgo(6) },
  { id: 'j5', title: 'Data Scientist', department: 'Engineering', location: 'Remote', type: 'Remote', status: 'Draft', description: 'Build ML for matching, ranking, and forecasting.', requiredSkills: ['Python', 'ML', 'SQL', 'Statistics'], niceSkills: ['LLMs', 'PyTorch'], ctcMin: 2600000, ctcMax: 4000000, ownerId: 'u3', postedBoards: [], createdAt: daysAgo(3) },
  { id: 'j6', title: 'Customer Success Manager', department: 'Operations', location: 'Bengaluru', type: 'Hybrid', status: 'On Hold', description: 'Own retention and expansion for strategic customers.', requiredSkills: ['Account Management', 'SaaS', 'Onboarding'], niceSkills: ['SQL'], ctcMin: 1400000, ctcMax: 2200000, ownerId: 'u2', postedBoards: ['LinkedIn'], createdAt: daysAgo(30) },
]

const FIRST = ['Ananya', 'Vikram', 'Ishaan', 'Meera', 'Karan', 'Diya', 'Arjun', 'Tara', 'Nikhil', 'Riya', 'Aditya', 'Pooja', 'Rahul', 'Sneha', 'Yash', 'Kavya', 'Manav', 'Anjali', 'Siddharth', 'Naina', 'Varun', 'Aisha', 'Dhruv', 'Lakshya', 'Mira', 'Kabir', 'Zara', 'Reyansh', 'Saanvi', 'Ved', 'Myra', 'Aryan', 'Anika', 'Ira', 'Vivaan']
const LAST = ['Sharma', 'Patel', 'Reddy', 'Iyer', 'Singh', 'Verma', 'Bose', 'Kapoor', 'Menon', 'Das', 'Chopra', 'Rao', 'Nanda', 'Pillai', 'Bhat']
const SOURCES = ['LinkedIn', 'Referral', 'Careers Page', 'Talent Pool', 'Indeed', 'Naukri']
const COMPANIES = ['Razorpay', 'Swiggy', 'Zomato', 'Freshworks', 'CRED', 'Postman', 'Meesho', 'Groww', 'Zerodha', 'Flipkart', 'PhonePe', 'Dunzo']
const STRENGTHS = ['Strong system design', 'Great communication', 'Deep domain expertise', 'Fast learner', 'Ownership mindset', 'Scaling experience', 'Strong fundamentals']
const GAPS = ['Limited leadership exposure', 'No fintech background', 'Notice period 90 days', 'Lacks Kafka experience', 'Gap in resume', 'Below target on system design']

function rng(seed: number) { let s = seed; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff }
const r = rng(42)
const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)]
const stageWeights: Stage[] = ['Applied', 'Applied', 'Applied', 'Shortlisted', 'Shortlisted', 'Activity', 'Interview', 'Interview', 'Offer', 'Hired', 'Rejected', 'Rejected']

export const candidates: Candidate[] = Array.from({ length: 32 }).map((_, i) => {
  const name = `${FIRST[i % FIRST.length]} ${pick(LAST)}`
  const job = pick(jobs.filter(j => j.status === 'Published'))
  const stage = stageWeights[i % stageWeights.length]
  const score = stage === 'Rejected' ? 35 + Math.floor(r() * 35) : 55 + Math.floor(r() * 45)
  const exp = 2 + Math.floor(r() * 12)
  const skills = [...job.requiredSkills].filter(() => r() > 0.3)
  return {
    id: `c${i + 1}`, name, email: name.toLowerCase().replace(' ', '.') + '@gmail.com',
    phone: '+91 9' + String(800000000 + Math.floor(r() * 99999999)),
    jobId: job.id, jobTitle: job.title, stage, matchScore: Math.min(99, score),
    source: pick(SOURCES), experience: exp, currentCompany: pick(COMPANIES),
    skills: skills.length ? skills : job.requiredSkills.slice(0, 2),
    location: pick(['Bengaluru', 'Mumbai', 'Pune', 'Remote', 'Hyderabad', 'Delhi']),
    appliedAt: daysAgo(2 + Math.floor(r() * 40)), daysInStage: 1 + Math.floor(r() * 14),
    strengths: [pick(STRENGTHS), pick(STRENGTHS)].filter((v, idx, a) => a.indexOf(v) === idx),
    gaps: [pick(GAPS)], attritionRisk: pick(['Low', 'Low', 'Medium', 'High']) as any,
    tags: r() > 0.6 ? [pick(['Top Pick', 'Diversity', 'Referral', 'Reapplied'])] : [],
    pools: stage === 'Rejected' && score > 60 ? ['p1'] : [],
    resumeText: `${name} — ${exp} yrs experience, currently at ${pick(COMPANIES)}. Skilled in ${skills.slice(0, 3).join(', ')}.`,
    consent: r() > 0.15,
  }
})

const byStage = (s: Stage) => candidates.filter(c => c.stage === s)

export const interviews: Interview[] = [
  ...byStage('Interview').slice(0, 4).map((c, i) => ({
    id: `iv${i + 1}`, candidateId: c.id, candidateName: c.name, jobTitle: c.jobTitle,
    type: pick(['Technical', 'HR Round', 'System Design', 'Hiring Manager']),
    interviewer: pick(['Sara Khan', 'Rohan Gupta', 'Priya Nair']),
    scheduledAt: i < 2 ? daysAhead(1 + i) : daysAgo(2 + i), status: (i < 2 ? 'Scheduled' : 'Completed') as any,
    mode: pick(['Direct', 'Booking Link', 'Self-book']) as any,
    feedback: i >= 2 ? { technical: 4, communication: 4, culture: 5, recommendation: 'Hire' as any, notes: 'Solid candidate, strong on fundamentals.', by: 'Sara Khan' } : undefined,
  })),
  { id: 'iv5', candidateId: byStage('Offer')[0]?.id || 'c1', candidateName: byStage('Offer')[0]?.name || 'Candidate', jobTitle: 'DevOps Engineer', type: 'Final Round', interviewer: 'Rohan Gupta', scheduledAt: daysAgo(5), status: 'Completed', mode: 'Self-book', feedback: { technical: 5, communication: 4, culture: 4, recommendation: 'Strong Hire', notes: 'Excellent, move to offer.', by: 'Rohan Gupta' } },
]

export const activities: Activity[] = byStage('Activity').slice(0, 4).map((c, i) => ({
  id: `a${i + 1}`, candidateId: c.id, candidateName: c.name,
  type: pick(['Coding Test', 'Case Study', 'Take-home']) as any,
  status: pick(['Assigned', 'Submitted', 'Passed', 'Failed']) as any,
  deadline: daysAhead(2 + i), score: i % 2 ? 60 + Math.floor(r() * 35) : undefined,
}))

export const offers: Offer[] = [
  ...byStage('Offer').slice(0, 3).map((c, i) => ({
    id: `o${i + 1}`, candidateId: c.id, candidateName: c.name, jobTitle: c.jobTitle,
    ctc: 3000000 + i * 400000, joiningDate: daysAhead(30 + i * 5),
    status: (['Sent', 'Viewed', 'Generated'][i] || 'Sent') as any, sentAt: daysAgo(3 + i), template: 'Standard FTE',
  })),
  { id: 'o4', candidateId: byStage('Hired')[0]?.id || 'c10', candidateName: byStage('Hired')[0]?.name || 'Candidate', jobTitle: 'Senior Backend Engineer', ctc: 3800000, joiningDate: daysAhead(20), status: 'Accepted', sentAt: daysAgo(10), template: 'Standard FTE' },
  { id: 'o5', candidateId: 'c9', candidateName: candidates[8].name, jobTitle: 'Product Designer', ctc: 2400000, joiningDate: daysAgo(2), status: 'Rejected', sentAt: daysAgo(14), template: 'Standard FTE' },
]

const checklist = (): { label: string; owner: any; done: boolean }[] => [
  { label: 'Background verification', owner: 'HR', done: true },
  { label: 'Offer signed & uploaded', owner: 'HR', done: true },
  { label: 'Company email provisioned', owner: 'IT', done: false },
  { label: 'Laptop allocated', owner: 'IT', done: false },
  { label: 'PF & bank setup', owner: 'Finance', done: false },
  { label: 'NDA signed', owner: 'Legal', done: true },
  { label: 'Welcome kit shipped', owner: 'Admin', done: false },
]
export const onboardings: Onboarding[] = [
  ...byStage('Hired').slice(0, 3).map((c, i) => {
    const tasks = checklist().map((t, k) => ({ ...t, done: k <= 2 + i }))
    return { id: `ob${i + 1}`, candidateId: c.id, candidateName: c.name, jobTitle: c.jobTitle, tasks, progress: Math.round((tasks.filter(t => t.done).length / tasks.length) * 100), docsVerified: 2 + i, docsTotal: 4, pan: 'ABCDE1234F', aadhaar: 'XXXX XXXX 4321', account: 'XXXXXX7890' }
  }),
]

export const pools: Pool[] = [
  { id: 'p1', name: 'Silver-Medalist Engineers', type: 'Silver-Medalist', dynamic: true, memberIds: candidates.filter(c => c.pools.includes('p1')).map(c => c.id) },
  { id: 'p2', name: 'Senior Designers 2026', type: 'Talent Community', dynamic: false, memberIds: candidates.filter(c => c.jobTitle === 'Product Designer').slice(0, 4).map(c => c.id) },
]

export const campaigns: Campaign[] = [
  { id: 'cm1', name: 'Re-engage Backend Silver Medalists', poolId: 'p1', channel: 'Email', status: 'Active', steps: [{ delay: 'Day 0', subject: 'A new role that fits your profile' }, { delay: 'Day 3', subject: 'Following up — 15 min chat?' }, { delay: 'Day 7', subject: 'Last nudge before we close' }], sent: 42, opened: 28, replied: 11 },
]

export const messages: Message[] = candidates.slice(0, 5).map((c, i) => ({
  id: `m${i + 1}`, candidateId: c.id, candidateName: c.name, channel: pick(['Email', 'Telegram', 'SMS', 'WhatsApp']) as any,
  thread: [
    { from: 'company', text: `Hi ${c.name.split(' ')[0]}, thanks for applying to ${c.jobTitle}! Are you available this week for a quick call?`, at: daysAgo(3) },
    { from: 'candidate', text: 'Yes! I am free Wed or Thu afternoon.', at: daysAgo(2) },
    { from: 'company', text: 'Great — sending a booking link now.', at: daysAgo(2) },
  ],
}))

export const audit: AuditEntry[] = [
  { id: 'au1', actor: 'Priya Nair', action: 'Moved candidate to Interview', entity: candidates[6].name, at: daysAgo(1) },
  { id: 'au2', actor: 'Rohan Gupta', action: 'Submitted scorecard (Strong Hire)', entity: candidates[7].name, at: daysAgo(1) },
  { id: 'au3', actor: 'Aarav Mehta', action: 'Published job', entity: 'DevOps Engineer', at: daysAgo(9) },
  { id: 'au4', actor: 'Priya Nair', action: 'Sent offer', entity: offers[0].candidateName, at: daysAgo(3) },
  { id: 'au5', actor: 'Neha Joshi', action: 'Provisioned company email', entity: onboardings[0]?.candidateName || '—', at: daysAgo(2) },
]

export const attrition: AttritionRow[] = onboardings.map((o, i) => ({
  candidateId: o.candidateId, name: o.candidateName, role: o.jobTitle,
  risk: [72, 41, 23][i] ?? 30, signal: ['Slow form completion + low doc completeness', 'Long notice-period negotiation', 'Healthy engagement'][i] ?? 'Normal',
}))

export const recentActivity = [
  { who: 'Priya Nair', what: `moved ${candidates[6].name} to Interview`, when: '2h ago' },
  { who: 'AI', what: `parsed resume & scored ${candidates[0].name} (${candidates[0].matchScore})`, when: '3h ago' },
  { who: 'Rohan Gupta', what: `left a Strong Hire scorecard`, when: '5h ago' },
  { who: 'System', what: `offer accepted by ${offers[3].candidateName}`, when: 'yesterday' },
  { who: 'Priya Nair', what: `launched outreach to Silver-Medalist pool`, when: 'yesterday' },
]
