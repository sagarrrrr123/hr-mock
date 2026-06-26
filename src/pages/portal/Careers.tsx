import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore } from '../../data/store'
import { Card, Btn, Badge, Input } from '../../components/ui'
import { inr } from '../../lib/helpers'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/careers" className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">H</div><div className="font-bold text-slate-800">Hyre Careers</div></Link>
          <Link to="/portal" className="text-sm text-brand-700 hover:underline">Candidate login →</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 animate-fadein">{children}</main>
    </div>
  )
}

export default function Careers({ apply }: { apply?: boolean }) {
  const { jobs, addCandidate, toast } = useStore()
  const { jobId } = useParams()
  const nav = useNavigate()
  const job = jobs.find(j => j.id === jobId)
  const [submitted, setSubmitted] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<{ score: number; skills: string[] } | null>(null)
  const [name, setName] = useState('')

  // Apply view
  if (apply && job) {
    const doParse = () => {
      setParsing(true)
      setTimeout(() => { setParsing(false); setParsed({ score: 78, skills: job.requiredSkills.slice(0, 3) }) }, 1500)
    }
    const submit = () => {
      addCandidate({
        id: 'c' + Date.now(), name: name || 'New Applicant', email: 'applicant@gmail.com', phone: '+91 90000 00000',
        jobId: job.id, jobTitle: job.title, stage: 'Applied', matchScore: parsed?.score || 72, source: 'Careers Page',
        experience: 5, currentCompany: 'Acme Corp', skills: parsed?.skills || job.requiredSkills.slice(0, 3), location: 'Remote',
        appliedAt: new Date().toISOString(), daysInStage: 0, strengths: ['Strong fundamentals'], gaps: ['New to domain'],
        attritionRisk: 'Low', tags: ['New'], pools: [], resumeText: 'Applied via careers page.', consent: true,
      })
      setSubmitted(true); toast('Application submitted')
    }
    if (submitted) return <Shell><Card className="p-10 text-center"><CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" /><h2 className="text-xl font-bold text-slate-800">Application received!</h2><p className="text-slate-500 mt-1">We'll be in touch. Track your status anytime in the candidate portal.</p><Btn className="mt-5" onClick={() => nav('/portal')}>Go to candidate portal <ArrowRight size={15} /></Btn></Card></Shell>

    return (
      <Shell>
        <button onClick={() => nav(`/careers/${job.id}`)} className="mb-4 text-sm text-slate-500 hover:text-slate-700">← Back</button>
        <Card className="p-6">
          <h1 className="text-lg font-bold text-slate-800">Apply — {job.title}</h1>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Full name</div><Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
            <label className="block"><div className="mb-1 text-xs font-medium text-slate-600">Email</div><Input placeholder="you@email.com" /></label>
          </div>
          <div className="mt-4">
            <div className="mb-1 text-xs font-medium text-slate-600">Resume</div>
            {!parsed ? (
              <button onClick={doParse} disabled={parsing} className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 text-slate-400 hover:border-brand-400 hover:text-brand-600">
                {parsing ? <><Sparkles className="animate-pulse text-brand-600" /><span className="text-sm text-brand-600">Parsing resume with AI…</span></> : <><Upload /><span className="text-sm">Upload resume (PDF) — we'll auto-fill with AI</span></>}
              </button>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 animate-pop">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800"><Sparkles size={15} /> Resume parsed — match score {parsed.score}/100</div>
                <div className="mt-2 flex flex-wrap gap-1.5">{parsed.skills.map(s => <Badge key={s} className="bg-white text-emerald-700 border-emerald-200">{s}</Badge>)}</div>
              </div>
            )}
          </div>
          <Btn className="mt-5 w-full justify-center" size="lg" onClick={submit} disabled={!parsed}>Submit application</Btn>
        </Card>
      </Shell>
    )
  }

  // Job detail
  if (job) return (
    <Shell>
      <Link to="/careers" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-700">← All openings</Link>
      <Card className="p-6">
        <Badge className="bg-brand-50 text-brand-700 border-brand-100 mb-2">{job.department}</Badge>
        <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500"><span className="flex items-center gap-1"><MapPin size={14} />{job.location} · {job.type}</span><span>{inr(job.ctcMin)}–{inr(job.ctcMax)}</span></div>
        <p className="mt-4 text-slate-600">{job.description}</p>
        <h3 className="mt-5 font-semibold text-slate-800 text-sm">What we're looking for</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">{job.requiredSkills.map(s => <Badge key={s} className="bg-slate-100 text-slate-600 border-slate-200">{s}</Badge>)}</div>
        <Btn className="mt-6" size="lg" onClick={() => nav(`/apply/${job.id}`)}>Apply now <ArrowRight size={15} /></Btn>
      </Card>
    </Shell>
  )

  // Listing
  return (
    <Shell>
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-800">Open roles</h1><p className="text-slate-500">Join us — we're hiring across the company.</p></div>
      <div className="space-y-3">
        {jobs.filter(j => j.status === 'Published').map(j => (
          <Card key={j.id} className="p-5 flex items-center justify-between hover:shadow-pop transition cursor-pointer" >
            <div onClick={() => nav(`/careers/${j.id}`)} className="min-w-0">
              <div className="font-semibold text-slate-800">{j.title}</div>
              <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5"><span>{j.department}</span>·<span className="flex items-center gap-1"><MapPin size={13} />{j.location}</span>·<span>{j.type}</span></div>
            </div>
            <Btn variant="outline" onClick={() => nav(`/careers/${j.id}`)}>View <ArrowRight size={14} /></Btn>
          </Card>
        ))}
      </div>
    </Shell>
  )
}
