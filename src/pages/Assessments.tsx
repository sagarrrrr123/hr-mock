import React, { useState } from 'react'
import { ClipboardCheck, Plus } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Modal, Field, Select, Input } from '../components/ui'

const statusCls: Record<string, string> = {
  Assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  Submitted: 'bg-amber-100 text-amber-700 border-amber-200',
  Passed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Failed: 'bg-red-100 text-red-600 border-red-200',
}

export default function Assessments() {
  const { activities, candidates, toast } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <PageHead title="Assessments" subtitle="Coding tests & case studies — pass routes to Interview, fail to Rejected"
        actions={<Btn onClick={() => setOpen(true)}><Plus size={15} /> Assign activity</Btn>} />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_130px_110px_120px_90px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span>Candidate</span><span>Type</span><span>Status</span><span>Deadline</span><span>Score</span>
        </div>
        {activities.map(a => (
          <div key={a.id} className="grid grid-cols-[1fr_130px_110px_120px_90px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
            <div className="flex items-center gap-2.5"><Avatar name={a.candidateName} size={32} /><span className="text-sm font-medium text-slate-700">{a.candidateName}</span></div>
            <span className="text-sm text-slate-600">{a.type}</span>
            <Badge className={statusCls[a.status]}>{a.status}</Badge>
            <span className="text-xs text-slate-500">{new Date(a.deadline).toLocaleDateString()}</span>
            <span className="text-sm font-semibold text-slate-700">{a.score ?? '—'}</span>
          </div>
        ))}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Assign activity">
        <Field label="Candidate"><Select>{candidates.filter(c => ['Shortlisted', 'Activity'].includes(c.stage)).map(c => <option key={c.id}>{c.name}</option>)}</Select></Field>
        <Field label="Type"><Select>{['Coding Test', 'Case Study', 'Take-home'].map(t => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Deadline"><Input type="date" /></Field>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn onClick={() => { setOpen(false); toast('Activity assigned & emailed to candidate') }}>Assign</Btn></div>
      </Modal>
    </div>
  )
}
