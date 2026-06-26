import type { Stage, Role } from '../data/types'

export const stageColor: Record<Stage, string> = {
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  Shortlisted: 'bg-violet-100 text-violet-700 border-violet-200',
  Activity: 'bg-amber-100 text-amber-700 border-amber-200',
  Interview: 'bg-green-100 text-green-700 border-green-200',
  Offer: 'bg-teal-100 text-teal-700 border-teal-200',
  Hired: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-100 text-red-600 border-red-200',
}
export const stageDot: Record<Stage, string> = {
  Applied: 'bg-blue-500', Shortlisted: 'bg-violet-500', Activity: 'bg-amber-500',
  Interview: 'bg-green-500', Offer: 'bg-teal-500', Hired: 'bg-emerald-500', Rejected: 'bg-red-500',
}

export function scoreBand(s: number) {
  if (s >= 75) return { label: 'Strong', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' }
  if (s >= 50) return { label: 'Good', cls: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500' }
  return { label: 'Weak', cls: 'bg-red-100 text-red-600 border-red-200', bar: 'bg-red-500' }
}

export const riskColor: Record<string, string> = {
  Low: 'text-emerald-600 bg-emerald-50', Medium: 'text-amber-600 bg-amber-50', High: 'text-red-600 bg-red-50',
}

export function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}
const AV = ['#2d4a7c', '#0e7490', '#7c3aed', '#be123c', '#15803d', '#b45309', '#9333ea', '#0369a1']
export function avatarColor(name: string) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return AV[h % AV.length]
}

export function inr(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export const roleLabel: Record<Role, string> = {
  admin: 'Organization Admin', recruiter: 'Recruiter', hiring_manager: 'Hiring Manager',
  interviewer: 'Interviewer', analyst: 'Analyst', it_admin: 'IT Admin',
  individual_hr: 'Individual HR', candidate: 'Candidate',
}

// which nav keys each role may see
export const roleNav: Record<Role, string[] | '*'> = {
  admin: '*',
  individual_hr: '*',
  recruiter: ['dashboard', 'jobs', 'candidates', 'pipeline', 'interviews', 'assessments', 'offers', 'onboarding', 'crm', 'communications', 'analytics'],
  hiring_manager: ['dashboard', 'jobs', 'candidates', 'pipeline', 'interviews', 'offers', 'analytics'],
  interviewer: ['dashboard', 'interviews', 'candidates'],
  analyst: ['dashboard', 'analytics', 'attrition'],
  it_admin: ['dashboard', 'onboarding', 'admin'],
  candidate: [],
}

export function relTime(iso: string) {
  const d = new Date(iso).getTime(); const now = Date.now()
  const days = Math.round((now - d) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.round(days / 30)}mo ago`
}
