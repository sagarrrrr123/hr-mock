import React, { useState } from 'react'
import { FileText, Plus, Send, Download } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Modal, Field, Select, Input } from '../components/ui'
import { inr } from '../lib/helpers'
import type { OfferStatus } from '../data/types'

const statusCls: Record<OfferStatus, string> = {
  Generated: 'bg-slate-100 text-slate-600 border-slate-200',
  Sent: 'bg-blue-100 text-blue-700 border-blue-200',
  Viewed: 'bg-violet-100 text-violet-700 border-violet-200',
  Accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-100 text-red-600 border-red-200',
  Expired: 'bg-amber-100 text-amber-700 border-amber-200',
}

export default function Offers() {
  const { offers, candidates, sendOffer, toast } = useStore()
  const [gen, setGen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const o = offers.find(x => x.id === preview)

  return (
    <div>
      <PageHead title="Offers" subtitle={`${offers.length} offers · ${offers.filter(o => o.status === 'Accepted').length} accepted`}
        actions={<Btn onClick={() => setGen(true)}><Plus size={15} /> Generate offer</Btn>} />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_120px_120px_120px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span>Candidate</span><span>CTC</span><span>Joining</span><span>Status</span><span></span>
        </div>
        {offers.map(o => (
          <div key={o.id} className="grid grid-cols-[1fr_140px_120px_120px_120px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
            <div className="flex items-center gap-2.5 min-w-0"><Avatar name={o.candidateName} size={32} /><div className="min-w-0"><div className="truncate text-sm font-medium text-slate-700">{o.candidateName}</div><div className="truncate text-xs text-slate-400">{o.jobTitle}</div></div></div>
            <span className="text-sm font-medium text-slate-700">{inr(o.ctc)}</span>
            <span className="text-xs text-slate-500">{new Date(o.joiningDate).toLocaleDateString()}</span>
            <Badge className={statusCls[o.status]}>{o.status}</Badge>
            <div className="flex gap-1.5">
              <Btn size="sm" variant="ghost" onClick={() => setPreview(o.id)}><FileText size={14} /></Btn>
              {['Generated', 'Sent', 'Viewed'].includes(o.status) && <Btn size="sm" variant="soft" onClick={() => { sendOffer(o.id); toast(`Offer ${o.status === 'Generated' ? 'sent' : 're-sent'} to ${o.candidateName.split(' ')[0]}`) }}><Send size={13} /> {o.status === 'Generated' ? 'Send' : 'Resend'}</Btn>}
            </div>
          </div>
        ))}
      </Card>

      {/* Generate */}
      <Modal open={gen} onClose={() => setGen(false)} title="Generate offer letter" wide>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <div className="sm:col-span-2"><Field label="Candidate"><Select>{candidates.filter(c => ['Interview', 'Offer'].includes(c.stage)).map(c => <option key={c.id}>{c.name} — {c.jobTitle}</option>)}</Select></Field></div>
          <Field label="Annual CTC (₹)"><Input type="number" defaultValue={3500000} /></Field>
          <Field label="Joining date"><Input type="date" /></Field>
          <div className="sm:col-span-2"><Field label="Template"><Select>{['Standard FTE', 'Senior FTE', 'Contract', 'Intern'].map(t => <option key={t}>{t}</option>)}</Select></Field></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <div className="font-semibold text-slate-700 mb-1">Offer letter preview (PDF)</div>
          Dear Candidate,<br />We are delighted to offer you the position with an annual CTC of ₹35,00,000…
          <div className="mt-2 text-xs text-slate-400">Generated via template engine · auto-emailed with accept/reject links.</div>
        </div>
        <div className="mt-3 flex justify-end gap-2"><Btn variant="outline" onClick={() => setGen(false)}>Cancel</Btn><Btn onClick={() => { setGen(false); toast('Offer generated & sent') }}><Send size={14} /> Generate & send</Btn></div>
      </Modal>

      {/* Preview */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Offer letter">
        {o && <div className="rounded-lg border border-slate-200 p-6 text-sm text-slate-700 leading-relaxed">
          <div className="text-center font-bold text-base mb-4">Offer of Employment</div>
          Dear {o.candidateName},<br /><br />
          We are pleased to offer you the role of <b>{o.jobTitle}</b> at Hyre, with an annual CTC of <b>{inr(o.ctc)}</b>, joining on <b>{new Date(o.joiningDate).toLocaleDateString()}</b>.<br /><br />
          Template: {o.template} · Status: <b>{o.status}</b>
          <div className="mt-5 flex justify-end"><Btn size="sm" variant="outline" onClick={() => toast('PDF downloaded')}><Download size={14} /> Download PDF</Btn></div>
        </div>}
      </Modal>
    </div>
  )
}
