import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, MapPin, Users } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Modal, Field, Input, Select, Textarea } from '../components/ui'
import { inr } from '../lib/helpers'

const statusCls: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Closed: 'bg-red-100 text-red-600 border-red-200',
  'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
}

export default function Jobs() {
  const { jobs, candidates, addJob, toast } = useStore()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', department: 'Engineering', location: 'Bengaluru', type: 'Hybrid', description: '', skills: '', ctcMin: 2000000, ctcMax: 3500000 })

  const create = () => {
    if (!form.title) return toast('Add a job title', 'error')
    addJob({
      id: 'j' + Date.now(), title: form.title, department: form.department, location: form.location, type: form.type as any,
      status: 'Published', description: form.description || 'New role.', requiredSkills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      niceSkills: [], ctcMin: +form.ctcMin, ctcMax: +form.ctcMax, ownerId: 'u2', postedBoards: ['LinkedIn'], createdAt: new Date().toISOString(),
    })
    setOpen(false); toast(`Published "${form.title}"`)
    setForm({ ...form, title: '', description: '', skills: '' })
  }

  return (
    <div>
      <PageHead title="Jobs" subtitle={`${jobs.length} roles · ${jobs.filter(j => j.status === 'Published').length} live`}
        actions={<Btn onClick={() => setOpen(true)}><Plus size={15} /> Create job</Btn>} />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map(j => {
          const n = candidates.filter(c => c.jobId === j.id).length
          return (
            <Card key={j.id} className="p-5 hover:shadow-pop transition cursor-pointer" >
              <div onClick={() => nav(`/jobs/${j.id}`)}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-800">{j.title}</h3>
                  <Badge className={statusCls[j.status]}>{j.status}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{j.department}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                  <span className="flex items-center gap-1"><MapPin size={13} />{j.location} · {j.type}</span>
                  <span className="flex items-center gap-1"><Users size={13} />{n} candidates</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {j.requiredSkills.slice(0, 4).map(s => <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{s}</span>)}
                </div>
                <div className="mt-3 text-sm font-medium text-slate-700">{inr(j.ctcMin)}–{inr(j.ctcMax)}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                {j.postedBoards.length ? <>Posted on {j.postedBoards.join(', ')}</> : 'Not posted yet'}
              </div>
            </Card>
          )
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a new job" wide>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <div className="sm:col-span-2"><Field label="Job title"><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Backend Engineer" /></Field></div>
          <Field label="Department"><Select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{['Engineering', 'Design', 'Sales', 'Operations', 'Marketing'].map(d => <option key={d}>{d}</option>)}</Select></Field>
          <Field label="Location"><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Work type"><Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{['Remote', 'Hybrid', 'Onsite'].map(d => <option key={d}>{d}</option>)}</Select></Field>
          <Field label="Required skills (comma separated)"><Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Node.js, PostgreSQL, AWS" /></Field>
          <Field label="CTC min (₹)"><Input type="number" value={form.ctcMin} onChange={e => setForm({ ...form, ctcMin: +e.target.value })} /></Field>
          <Field label="CTC max (₹)"><Input type="number" value={form.ctcMax} onChange={e => setForm({ ...form, ctcMax: +e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field></div>
        </div>
        <div className="mt-2 flex justify-end gap-2"><Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn onClick={create}>Publish job</Btn></div>
      </Modal>
    </div>
  )
}
