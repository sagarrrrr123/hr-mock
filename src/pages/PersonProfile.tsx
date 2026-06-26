import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Mail, Phone, MapPin, FolderPlus, MessageSquare, FileText, AlertTriangle, Check, Trash2 } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, Tabs, Avatar, ScoreBar, Modal } from '../components/ui'
import PoolPicker from '../components/PoolPicker'
import { scoreBand, stageColor, riskColor, relTime } from '../lib/helpers'
import type { Stage } from '../data/types'

export default function PersonProfile() {
  const { id } = useParams()
  const nav = useNavigate()
  const { candidates, interviews, messages, addToPool, removeCandidate, toast } = useStore()
  const c = candidates.find(x => x.id === id)
  const [tab, setTab] = useState('Timeline')
  const [poolOpen, setPoolOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)
  if (!c) return <div>Candidate not found</div>
  const band = scoreBand(c.matchScore)
  const ivs = interviews.filter(i => i.candidateId === c.id)
  const msg = messages.find(m => m.candidateId === c.id)
  const timeline = [
    { t: 'Applied via ' + c.source, at: c.appliedAt, dot: 'bg-blue-500' },
    { t: 'Resume parsed by AI · skills extracted', at: c.appliedAt, dot: 'bg-brand-500' },
    { t: `Match score calculated — ${c.matchScore}`, at: c.appliedAt, dot: 'bg-brand-500' },
    ...(['Shortlisted', 'Activity', 'Interview', 'Offer', 'Hired'].includes(c.stage) ? [{ t: 'Shortlisted by recruiter', at: c.appliedAt, dot: 'bg-violet-500' }] : []),
    ...ivs.map(i => ({ t: `${i.type} interview — ${i.status}`, at: i.scheduledAt, dot: 'bg-green-500' })),
  ]

  return (
    <div>
      <button onClick={() => nav(-1)} className="mb-3 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft size={15} /> Back</button>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left card */}
        <Card className="p-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <Avatar name={c.name} size={72} />
            <h2 className="mt-3 text-lg font-bold text-slate-800">{c.name}</h2>
            <p className="text-sm text-slate-500">{c.jobTitle}</p>
            <div className="mt-2 flex gap-1.5"><Badge className={stageColor[c.stage as Stage]}>{c.stage}</Badge>{c.tags.map(t => <Badge key={t} className="bg-slate-100 text-slate-600 border-slate-200">{t}</Badge>)}</div>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3">
            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">AI Match Score</span><span className={`rounded-md border px-2 py-0.5 text-sm font-bold ${band.cls}`}>{c.matchScore}</span></div>
            <ScoreBar value={c.matchScore} bar={band.bar} className="mt-2" />
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" />{c.email}</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" />{c.phone}</div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" />{c.location} · {c.experience}y exp · {c.currentCompany}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Btn variant="soft" onClick={() => toast('Message composer opened')}><MessageSquare size={14} /> Message</Btn>
            <Btn variant="outline" onClick={() => setPoolOpen(true)}><FolderPlus size={14} /> Add to pool</Btn>
          </div>
          <button onClick={() => setDelOpen(true)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-red-500 hover:bg-red-50">
            <Trash2 size={14} /> Delete candidate
          </button>
        </Card>

        {/* Right tabs */}
        <div className="lg:col-span-2">
          <Tabs tabs={['Timeline', 'AI Insights', 'Skills', 'Resume', 'Interviews', 'Communications']} active={tab} onChange={setTab} />
          {tab === 'Timeline' && (
            <Card className="p-5">
              <div className="relative ml-2">
                {timeline.map((e, i) => (
                  <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${e.dot}`} />{i < timeline.length - 1 && <span className="w-px flex-1 bg-slate-200" />}</div>
                    <div className="-mt-0.5"><div className="text-sm text-slate-700">{e.t}</div><div className="text-xs text-slate-400">{relTime(e.at)}</div></div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {tab === 'AI Insights' && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3"><Sparkles size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Match breakdown</h3></div>
                <p className="text-sm text-slate-600">Matched on <b>{c.skills.length}/{c.skills.length + c.gaps.length}</b> required skills for {c.jobTitle}.</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div><div className="text-xs font-semibold text-emerald-600 mb-1.5">Strengths</div>{c.strengths.map(s => <div key={s} className="flex items-center gap-1.5 text-sm text-slate-600 mb-1"><Check size={14} className="text-emerald-500" />{s}</div>)}</div>
                  <div><div className="text-xs font-semibold text-amber-600 mb-1.5">Gaps</div>{c.gaps.map(s => <div key={s} className="flex items-center gap-1.5 text-sm text-slate-600 mb-1"><AlertTriangle size={14} className="text-amber-500" />{s}</div>)}</div>
                </div>
              </Card>
              <Card className="p-5 flex items-center justify-between">
                <div><div className="text-sm font-semibold text-slate-800">Attrition risk</div><div className="text-xs text-slate-500">Predicted early-attrition likelihood</div></div>
                <span className={`rounded-lg px-3 py-1.5 text-sm font-bold ${riskColor[c.attritionRisk]}`}>{c.attritionRisk}</span>
              </Card>
            </div>
          )}
          {tab === 'Skills' && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-1">Skills map</h3>
              <p className="text-xs text-slate-500 mb-3">Normalized to the company skills taxonomy.</p>
              <div className="flex flex-wrap gap-2">{c.skills.map(s => <Badge key={s} className="bg-brand-50 text-brand-700 border-brand-100">{s}</Badge>)}</div>
            </Card>
          )}
          {tab === 'Resume' && (
            <Card className="p-6"><div className="flex items-center gap-2 mb-3 text-slate-500"><FileText size={16} /> resume_{c.name.split(' ')[0].toLowerCase()}.pdf</div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-5 text-sm text-slate-600 leading-relaxed">{c.resumeText}<br /><br />Experience: {c.experience} years.<br />Most recent: {c.currentCompany}.<br />Skills: {c.skills.join(', ')}.</div></Card>
          )}
          {tab === 'Interviews' && (
            <Card className="overflow-hidden">
              {ivs.length === 0 ? <div className="p-8 text-center text-sm text-slate-400">No interviews yet.</div> : ivs.map(i => (
                <div key={i.id} className="border-b border-slate-100 p-4 last:border-0">
                  <div className="flex items-center justify-between"><div className="font-medium text-sm text-slate-700">{i.type}</div><Badge className="bg-slate-100 text-slate-600 border-slate-200">{i.status}</Badge></div>
                  <div className="text-xs text-slate-400 mt-0.5">with {i.interviewer} · {new Date(i.scheduledAt).toLocaleDateString()}</div>
                  {i.feedback && <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm"><b className="text-emerald-600">{i.feedback.recommendation}</b> — {i.feedback.notes}</div>}
                </div>
              ))}
            </Card>
          )}
          {tab === 'Communications' && (
            <Card className="p-5">
              {msg ? <div className="space-y-2">{msg.thread.map((t, i) => (
                <div key={i} className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${t.from === 'company' ? 'ml-auto bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{t.text}</div>
              ))}<div className="text-center text-xs text-slate-400 pt-2">Channel: {msg.channel}</div></div> : <div className="text-sm text-slate-400">No messages yet.</div>}
            </Card>
          )}
        </div>
      </div>

      <PoolPicker open={poolOpen} onClose={() => setPoolOpen(false)}
        onPick={(pid, pname) => { addToPool(pid, c.id); toast(`Added ${c.name.split(' ')[0]} to ${pname}`) }} />
      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Delete candidate?">
        <p className="text-sm text-slate-600">This removes <b>{c.name}</b> from the pipeline and any talent pools. This can't be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="outline" onClick={() => setDelOpen(false)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { removeCandidate(c.id); toast(`Deleted ${c.name}`, 'info'); nav('/candidates') }}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}
