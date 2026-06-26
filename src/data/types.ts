export type Role =
  | 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer'
  | 'analyst' | 'it_admin' | 'individual_hr' | 'candidate'

export type Stage = 'Applied' | 'Shortlisted' | 'Activity' | 'Interview' | 'Offer' | 'Hired' | 'Rejected'
export const STAGES: Stage[] = ['Applied', 'Shortlisted', 'Activity', 'Interview', 'Offer', 'Hired', 'Rejected']

export type OfferStatus = 'Generated' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired'

export interface User {
  id: string; name: string; email: string; role: Role; title: string; active: boolean
}

export interface Job {
  id: string; title: string; department: string; location: string; type: 'Remote' | 'Hybrid' | 'Onsite'
  status: 'Draft' | 'Published' | 'Closed' | 'On Hold'
  description: string; requiredSkills: string[]; niceSkills: string[]
  ctcMin: number; ctcMax: number; ownerId: string; postedBoards: string[]; createdAt: string
}

export interface Candidate {
  id: string; name: string; email: string; phone: string; jobId: string; jobTitle: string
  stage: Stage; matchScore: number; source: string; experience: number; currentCompany: string
  skills: string[]; location: string; appliedAt: string; daysInStage: number
  strengths: string[]; gaps: string[]; attritionRisk: 'Low' | 'Medium' | 'High'
  tags: string[]; pools: string[]; resumeText: string; consent: boolean
}

export interface Interview {
  id: string; candidateId: string; candidateName: string; jobTitle: string
  type: string; interviewer: string; scheduledAt: string; status: 'Scheduled' | 'Completed' | 'Pending Booking' | 'No Show'
  mode: 'Direct' | 'Booking Link' | 'Self-book'; feedback?: Feedback
}

export interface Feedback {
  technical: number; communication: number; culture: number
  recommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire'; notes: string; by: string
}

export interface Activity {
  id: string; candidateId: string; candidateName: string; type: 'Coding Test' | 'Case Study' | 'Take-home'
  status: 'Assigned' | 'Submitted' | 'Passed' | 'Failed'; deadline: string; score?: number
}

export interface Offer {
  id: string; candidateId: string; candidateName: string; jobTitle: string
  ctc: number; joiningDate: string; status: OfferStatus; sentAt?: string; template: string
}

export interface ChecklistTask { label: string; owner: 'HR' | 'IT' | 'Admin' | 'Legal' | 'Finance'; done: boolean }
export interface Onboarding {
  id: string; candidateId: string; candidateName: string; jobTitle: string
  progress: number; tasks: ChecklistTask[]; docsVerified: number; docsTotal: number
  pan: string; aadhaar: string; account: string
}

export interface Pool {
  id: string; name: string; type: 'Silver-Medalist' | 'Talent Community' | 'Role'; memberIds: string[]; dynamic: boolean
}

export interface Campaign {
  id: string; name: string; poolId: string; channel: 'Email' | 'SMS' | 'WhatsApp'
  status: 'Draft' | 'Active' | 'Completed'; steps: { delay: string; subject: string }[]
  sent: number; opened: number; replied: number
}

export interface Message {
  id: string; candidateId: string; candidateName: string; channel: 'Email' | 'Telegram' | 'SMS' | 'WhatsApp'
  thread: { from: 'company' | 'candidate'; text: string; at: string }[]
}

export interface AuditEntry { id: string; actor: string; action: string; entity: string; at: string }
export interface AttritionRow { candidateId: string; name: string; role: string; risk: number; signal: string }
