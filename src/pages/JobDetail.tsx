import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Megaphone, Sparkles, Plus, Check } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, Tabs, Modal, Avatar } from '../components/ui'
import { inr, scoreBand } from '../lib/helpers'
import Kanban from '../components/Kanban'

const BOARDS = ['LinkedIn', 'Indeed', 'Naukri', 'Hirist', 'AngelList', 'Instahyre']

export default function JobDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { jobs, candidates, publishBoards, toast, assignToJob } = useStore()
  const job = jobs.find(j => j.id === id)
  const [tab, setTab] = useState('Overview')
  const [boardModal, setBoardModal] = useState(false)
  const [sel, setSel] = useState<string[]>([])
  if (!job) return <div>Job not found</div>
  const jobCands = candidates.filter(c => c.jobId === job.id)
  // "find past matches" = candidates from other jobs with overlapping skills
  const matches = candidates.filter(c => c.jobId !== job.id && c.skills.some(s => job.requiredSkills.includes(s)))
    .map(c => ({ c, overlap: c.skills.filter(s => job.requiredSkills.includes(s)) }))
    .sort((a, b) => b.overlap.length - a.overlap.length).slice(0, 5)

  return (
    <div>
      <button onClick={() => nav('/jobs')} className="mb-3 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft size={15} /> Back to jobs</button>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{job.title}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
            <span>{job.department}</span><span className="flex items-center gap-1"><MapPin size={13} />{job.location} · {job.type}</span>
            <span>{inr(job.ctcMin)}–{inr(job.ctcMax)}</span>
          </div>
        </div>
        <Btn variant="outline" onClick={() => setBoardModal(true)}><Megaphone size={15} /> Post to job boards</Btn>
      </div>

      <Tabs tabs={['Overview', `Pipeline (${jobCands.length})`, `Candidates (${jobCands.length})`, 'Recommendations']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
            <p className="text-sm text-slate-600">{job.description}</p>
            <h4 className="font-semibold text-slate-800 mt-4 mb-2 text-sm">Required skills</h4>
            <div className="flex flex-wrap gap-1.5">{job.requiredSkills.map(s => <Badge key={s} className="bg-brand-50 text-brand-700 border-brand-100">{s}</Badge>)}</div>
            {job.niceSkills.length > 0 && <><h4 className="font-semibold text-slate-800 mt-4 mb-2 text-sm">Nice to have</h4>
              <div className="flex flex-wrap gap-1.5">{job.niceSkills.map(s => <Badge key={s} className="bg-slate-100 text-slate-600 border-slate-200">{s}</Badge>)}</div></>}
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Posting</h3>
            <p className="text-xs text-slate-500 mb-1">Live on</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{job.postedBoards.length ? job.postedBoards.map(b => <Badge key={b} className="bg-emerald-50 text-emerald-700 border-emerald-100">{b}</Badge>) : <span className="text-sm text-slate-400">Not posted</span>}</div>
            <div className="text-sm text-slate-600">{jobCands.length} applicants · pipeline template: <b>Standard 5-stage</b></div>
          </Card>
        </div>
      )}

      {tab.startsWith('Pipeline') && <Card className="p-3"><Kanban candidates={jobCands} /></Card>}

      {tab.startsWith('Candidates') && (
        <Card className="overflow-hidden">
          {jobCands.map(c => {
            const band = scoreBand(c.matchScore)
            return (
              <div key={c.id} onClick={() => nav(`/candidates/${c.id}`)} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 cursor-pointer">
                <Avatar name={c.name} size={34} />
                <div className="flex-1 min-w-0"><div className="font-medium text-sm text-slate-700">{c.name}</div><div className="text-xs text-slate-400">{c.currentCompany} · {c.experience}y</div></div>
                <Badge className={band.cls}>{c.matchScore}</Badge>
                <span className="text-xs text-slate-400 w-20 text-right">{c.stage}</span>
              </div>
            )
          })}
        </Card>
      )}

      {tab === 'Recommendations' && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1"><Sparkles size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Find past matches</h3></div>
          <p className="text-sm text-slate-500 mb-4">AI surfaced these past applicants who fit <b>{job.title}</b> — re-engage before sourcing new candidates.</p>
          <div className="space-y-2">
            {matches.map(({ c, overlap }) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                <Avatar name={c.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-700">{c.name} <span className="text-xs font-normal text-slate-400">· {c.currentCompany}</span></div>
                  <div className="text-xs text-slate-500 mt-0.5">Matched on {overlap.length}/{job.requiredSkills.length} required skills — {overlap.join(', ')}</div>
                </div>
                <Badge className={scoreBand(c.matchScore).cls}>{c.matchScore}</Badge>
                <Btn size="sm" variant="soft" onClick={() => { assignToJob(c.id, job.id); toast(`Added ${c.name.split(' ')[0]} to ${job.title} pipeline`) }}><Plus size={14} /> Add</Btn>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={boardModal} onClose={() => setBoardModal(false)} title="Post to job boards">
        <p className="text-sm text-slate-500 mb-3">Select boards — applicants flow back in automatically, tagged by source.</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {BOARDS.map(b => {
            const on = sel.includes(b) || job.postedBoards.includes(b)
            const already = job.postedBoards.includes(b)
            return (
              <button key={b} disabled={already} onClick={() => setSel(s => s.includes(b) ? s.filter(x => x !== b) : [...s, b])}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${on ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} ${already ? 'opacity-60' : ''}`}>
                {b} {on && <Check size={15} />}
              </button>
            )
          })}
        </div>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setBoardModal(false)}>Cancel</Btn>
          <Btn onClick={() => { publishBoards(job.id, sel); setBoardModal(false); setSel([]); toast(`Published to ${sel.length || 'selected'} boards`) }}>Publish</Btn></div>
      </Modal>
    </div>
  )
}
