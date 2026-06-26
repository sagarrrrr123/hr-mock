import React, { useState } from 'react'
import { CalendarPlus, Phone, Star, Link2, CalendarClock, UserCheck } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Modal, Field, Select, Input, Avatar, Tabs } from '../components/ui'

export default function Interviews() {
  const { interviews, candidates, toast } = useStore()
  const [tab, setTab] = useState('Upcoming')
  const [sched, setSched] = useState(false)
  const [scoreFor, setScoreFor] = useState<string | null>(null)
  const [mode, setMode] = useState('Direct')
  const [phone, setPhone] = useState(false)
  const [fb, setFb] = useState({ technical: 4, communication: 4, culture: 4, rec: 'Hire' })

  const upcoming = interviews.filter(i => i.status === 'Scheduled')
  const pending = interviews.filter(i => i.status === 'Completed' && !i.feedback)
  const done = interviews.filter(i => i.status === 'Completed' && i.feedback)

  const list = tab === 'Upcoming' ? upcoming : tab === 'Pending reviews' ? interviews.filter(i => i.status === 'Completed').slice(0, 2) : done

  const schedule = () => {
    setSched(false)
    toast(mode === 'Self-book' ? 'Booking link sent — candidate will pick a slot' : 'Interview scheduled + calendar invite sent')
    if (phone) setTimeout(() => toast('AI phone screen queued', 'info'), 500)
  }

  return (
    <div>
      <PageHead title="Interviews" subtitle={`${upcoming.length} upcoming · ${pending.length} pending review`}
        actions={<Btn onClick={() => setSched(true)}><CalendarPlus size={15} /> Schedule interview</Btn>} />

      <Tabs tabs={['Upcoming', 'Pending reviews', 'Completed']} active={tab} onChange={setTab} />

      <div className="grid md:grid-cols-2 gap-3">
        {list.map(i => (
          <Card key={i.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={i.candidateName} size={40} />
              <div className="flex-1 min-w-0"><div className="font-medium text-slate-700">{i.candidateName}</div><div className="text-xs text-slate-400">{i.jobTitle} · {i.type}</div></div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">{i.mode}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-slate-500"><CalendarClock size={14} />{new Date(i.scheduledAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-xs text-slate-400">with {i.interviewer}</span>
            </div>
            {i.feedback ? (
              <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-sm text-emerald-800"><b>{i.feedback.recommendation}</b> — {i.feedback.notes}</div>
            ) : (
              <div className="mt-3 flex gap-2">
                <Btn size="sm" variant="soft" onClick={() => setScoreFor(i.id)}><Star size={14} /> Submit scorecard</Btn>
                <Btn size="sm" variant="ghost" onClick={() => toast('Reminder re-sent')}>Remind</Btn>
              </div>
            )}
          </Card>
        ))}
        {list.length === 0 && <div className="col-span-2 py-12 text-center text-sm text-slate-400">Nothing here yet.</div>}
      </div>

      {/* Schedule modal */}
      <Modal open={sched} onClose={() => setSched(false)} title="Schedule interview">
        <Field label="Candidate"><Select>{candidates.filter(c => ['Shortlisted', 'Activity', 'Interview'].includes(c.stage)).map(c => <option key={c.id}>{c.name} — {c.jobTitle}</option>)}</Select></Field>
        <Field label="Interview type"><Select>{['Technical', 'System Design', 'HR Round', 'Hiring Manager', 'Final'].map(t => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Interviewer"><Select>{['Sara Khan', 'Rohan Gupta', 'Priya Nair'].map(t => <option key={t}>{t}</option>)}</Select></Field>
        <div className="mb-3"><div className="mb-1 text-xs font-medium text-slate-600">Scheduling mode</div>
          <div className="grid grid-cols-3 gap-2">
            {[{ k: 'Direct', i: UserCheck }, { k: 'Booking Link', i: Link2 }, { k: 'Self-book', i: CalendarClock }].map(o => (
              <button key={o.k} onClick={() => setMode(o.k)} className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs ${mode === o.k ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}><o.i size={16} />{o.k}</button>
            ))}
          </div></div>
        <label className="flex items-center gap-2 text-sm text-slate-600 mb-3"><input type="checkbox" className="accent-brand-600" /> Send reminders (24h + 1h before)</label>
        <label className="flex items-center gap-2 text-sm text-slate-600 mb-4"><input type="checkbox" checked={phone} onChange={e => setPhone(e.target.checked)} className="accent-brand-600" /><Phone size={14} /> Run an AI phone screen first</label>
        {phone && <div className="mb-4 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500"><b>AI phone screen preview:</b> "Hi! A quick 5-min screen about your experience…" → captures Q&A, sentiment, and a recommended next step.</div>}
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setSched(false)}>Cancel</Btn><Btn onClick={schedule}>Schedule</Btn></div>
      </Modal>

      {/* Scorecard modal */}
      <Modal open={!!scoreFor} onClose={() => setScoreFor(null)} title="Structured scorecard">
        <p className="text-xs text-slate-500 mb-3">Peer feedback stays hidden until you submit.</p>
        {[['technical', 'Technical skills'], ['communication', 'Communication'], ['culture', 'Culture fit']].map(([k, label]) => (
          <div key={k} className="mb-3"><div className="mb-1 flex items-center justify-between text-sm text-slate-600">{label}<span className="font-semibold text-slate-700">{(fb as any)[k]}/5</span></div>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setFb({ ...fb, [k]: n })}><Star size={20} className={n <= (fb as any)[k] ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} /></button>)}</div>
          </div>
        ))}
        <Field label="Overall recommendation"><Select value={fb.rec} onChange={e => setFb({ ...fb, rec: e.target.value })}>{['Strong Hire', 'Hire', 'No Hire', 'Strong No Hire'].map(r => <option key={r}>{r}</option>)}</Select></Field>
        <Field label="Notes"><Input placeholder="Key observations…" /></Field>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setScoreFor(null)}>Cancel</Btn><Btn onClick={() => { setScoreFor(null); toast(`Scorecard submitted — ${fb.rec}`) }}>Submit scorecard</Btn></div>
      </Modal>
    </div>
  )
}
