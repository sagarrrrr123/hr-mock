import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import type { Role, Stage, Candidate, Job, Interview, Offer, Onboarding, Pool, Campaign, Message, Activity } from './types'
import * as seed from './seed'

export interface Toast { id: number; text: string; kind: 'success' | 'info' | 'error' }

interface Store {
  role: Role; setRole: (r: Role) => void
  currentUser: () => { name: string; title: string }
  jobs: Job[]; candidates: Candidate[]; interviews: Interview[]; offers: Offer[]
  onboardings: Onboarding[]; pools: Pool[]; campaigns: Campaign[]; messages: Message[]; activities: Activity[]
  users: typeof seed.users; audit: typeof seed.audit; attrition: typeof seed.attrition; recentActivity: typeof seed.recentActivity
  // actions
  moveCandidate: (id: string, stage: Stage) => void
  addCandidate: (c: Candidate) => void
  addJob: (j: Job) => void
  publishBoards: (jobId: string, boards: string[]) => void
  sendOffer: (id: string) => void
  setOfferStatus: (id: string, status: Offer['status']) => void
  toggleTask: (obId: string, idx: number) => void
  addToPool: (poolId: string, candidateId: string) => void
  removeFromPool: (poolId: string, candidateId: string) => void
  removeCandidate: (id: string) => void
  addPool: (name: string) => string
  assignToJob: (candidateId: string, jobId: string) => void
  toast: (text: string, kind?: Toast['kind']) => void
  toasts: Toast[]; dismiss: (id: number) => void
}

const Ctx = createContext<Store>(null as any)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('admin')
  const [candidates, setCandidates] = useState<Candidate[]>(seed.candidates)
  const [jobs, setJobs] = useState<Job[]>(seed.jobs)
  const [interviews] = useState<Interview[]>(seed.interviews)
  const [offers, setOffers] = useState<Offer[]>(seed.offers)
  const [onboardings, setOnboardings] = useState<Onboarding[]>(seed.onboardings)
  const [pools, setPools] = useState<Pool[]>(seed.pools)
  const [campaigns] = useState<Campaign[]>(seed.campaigns)
  const [messages] = useState<Message[]>(seed.messages)
  const [activities] = useState<Activity[]>(seed.activities)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((text: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts(t => [...t, { id, text, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])
  const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id))

  const moveCandidate = (id: string, stage: Stage) =>
    setCandidates(cs => cs.map(c => c.id === id ? { ...c, stage, daysInStage: 0 } : c))
  const addCandidate = (c: Candidate) => setCandidates(cs => [c, ...cs])
  const addJob = (j: Job) => setJobs(js => [j, ...js])
  const publishBoards = (jobId: string, boards: string[]) =>
    setJobs(js => js.map(j => j.id === jobId ? { ...j, postedBoards: Array.from(new Set([...j.postedBoards, ...boards])), status: 'Published' } : j))
  const sendOffer = (id: string) => setOffers(os => os.map(o => o.id === id ? { ...o, status: 'Sent', sentAt: new Date().toISOString() } : o))
  const setOfferStatus = (id: string, status: Offer['status']) => setOffers(os => os.map(o => o.id === id ? { ...o, status } : o))
  const toggleTask = (obId: string, idx: number) => setOnboardings(obs => obs.map(o => {
    if (o.id !== obId) return o
    const tasks = o.tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t)
    return { ...o, tasks, progress: Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) }
  }))
  const addToPool = (poolId: string, candidateId: string) => setPools(ps => ps.map(p => p.id === poolId ? { ...p, memberIds: Array.from(new Set([...p.memberIds, candidateId])) } : p))
  const removeFromPool = (poolId: string, candidateId: string) => setPools(ps => ps.map(p => p.id === poolId ? { ...p, memberIds: p.memberIds.filter(m => m !== candidateId) } : p))
  const removeCandidate = (id: string) => {
    setCandidates(cs => cs.filter(c => c.id !== id))
    setPools(ps => ps.map(p => ({ ...p, memberIds: p.memberIds.filter(m => m !== id) })))
  }
  const addPool = (name: string) => {
    const id = 'p' + Date.now()
    setPools(ps => [...ps, { id, name, type: 'Talent Community', dynamic: false, memberIds: [] }])
    return id
  }
  const assignToJob = (candidateId: string, jobId: string) => setCandidates(cs => cs.map(c =>
    c.id === candidateId ? { ...c, jobId, jobTitle: jobs.find(j => j.id === jobId)?.title || c.jobTitle, stage: 'Applied', daysInStage: 0 } : c))

  const currentUser = useCallback(() => {
    const u = seed.users.find(x => x.role === role)
    return u ? { name: u.name, title: u.title } : { name: 'Demo User', title: '—' }
  }, [role])

  const value = useMemo<Store>(() => ({
    role, setRole, currentUser, jobs, candidates, interviews, offers, onboardings, pools, campaigns, messages, activities,
    users: seed.users, audit: seed.audit, attrition: seed.attrition, recentActivity: seed.recentActivity,
    moveCandidate, addCandidate, addJob, publishBoards, sendOffer, setOfferStatus, toggleTask,
    addToPool, removeFromPool, removeCandidate, addPool, assignToJob, toast, toasts, dismiss,
  }), [role, jobs, candidates, offers, onboardings, pools, toasts, currentUser])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
