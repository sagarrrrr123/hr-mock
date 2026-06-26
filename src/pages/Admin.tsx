import React, { useState } from 'react'
import { Users, Plug, ShieldCheck, ScrollText, KeyRound, BadgeCheck } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Tabs } from '../components/ui'
import { roleLabel, relTime } from '../lib/helpers'

const INTEGRATIONS = [
  { name: 'Gemini AI', desc: 'Resume parsing, matching, forecasting', on: true },
  { name: 'Brevo', desc: 'Transactional email', on: true },
  { name: 'Telegram', desc: 'Notifications & bot', on: true },
  { name: 'Vapi', desc: 'AI phone screening', on: true },
  { name: 'Google Calendar', desc: 'Interview scheduling', on: true },
  { name: 'Calendly', desc: 'Self-booking links', on: false },
  { name: 'Twilio (SMS)', desc: 'SMS notifications', on: false },
  { name: 'WhatsApp', desc: 'WhatsApp messaging', on: false },
]

export default function Admin() {
  const { users, audit, attrition, toast } = useStore()
  const [tab, setTab] = useState('Users & Roles')
  const [ints, setInts] = useState(INTEGRATIONS)

  return (
    <div>
      <PageHead title="Admin & Settings" subtitle="Manage access, integrations, security, and audit" />
      <Tabs tabs={['Users & Roles', 'Integrations', 'Security & SSO', 'Background Verification', 'Audit Log']} active={tab} onChange={setTab} />

      {tab === 'Users & Roles' && (
        <Card className="overflow-hidden">
          <div className="flex justify-end p-3 border-b border-slate-100"><Btn size="sm" onClick={() => toast('Invite sent')}><Users size={14} /> Invite user</Btn></div>
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
              <Avatar name={u.name} size={36} />
              <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-700">{u.name}</div><div className="text-xs text-slate-400">{u.email} · {u.title}</div></div>
              <Badge className="bg-brand-50 text-brand-700 border-brand-100">{roleLabel[u.role]}</Badge>
              <Badge className={u.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}>{u.active ? 'Active' : 'Inactive'}</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'Integrations' && (
        <div className="grid md:grid-cols-2 gap-3">
          {ints.map((it, i) => (
            <Card key={it.name} className="p-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500"><Plug size={18} /></div>
              <div className="flex-1"><div className="text-sm font-medium text-slate-700">{it.name}</div><div className="text-xs text-slate-400">{it.desc}</div></div>
              <button onClick={() => { setInts(s => s.map((x, k) => k === i ? { ...x, on: !x.on } : x)); toast(`${it.name} ${it.on ? 'disconnected' : 'connected'}`) }}
                className={`relative h-6 w-11 rounded-full transition ${it.on ? 'bg-emerald-500' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${it.on ? 'left-[22px]' : 'left-0.5'}`} /></button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Security & SSO' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5"><div className="flex items-center gap-2 mb-2"><KeyRound size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Single Sign-On</h3></div>
            <p className="text-sm text-slate-500 mb-3">SAML / OIDC for enterprise login.</p>
            <Btn variant="outline" onClick={() => toast('SSO config opened')}>Configure SAML</Btn></Card>
          <Card className="p-5"><div className="flex items-center gap-2 mb-2"><ShieldCheck size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">SCIM Provisioning</h3></div>
            <p className="text-sm text-slate-500 mb-3">Auto provision/deprovision users from your IdP.</p>
            <Btn variant="outline" onClick={() => toast('SCIM token generated')}>Generate token</Btn></Card>
          <Card className="p-5 md:col-span-2"><h3 className="font-semibold text-slate-800 mb-2">Data & compliance</h3>
            <div className="flex flex-wrap gap-2"><Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">AES-256 encryption</Badge><Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">GDPR consent</Badge><Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Append-only audit</Badge><Badge className="bg-slate-100 text-slate-500 border-slate-200">SOC 2 (in progress)</Badge></div></Card>
        </div>
      )}

      {tab === 'Background Verification' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_120px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400"><span>Candidate</span><span>Check</span><span>Status</span></div>
          {attrition.map((a, i) => (
            <div key={a.candidateId} className="grid grid-cols-[1fr_140px_120px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
              <div className="flex items-center gap-2.5"><Avatar name={a.name} size={32} /><span className="text-sm font-medium text-slate-700">{a.name}</span></div>
              <span className="text-sm text-slate-600">Employment + ID</span>
              <Badge className={i === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : i === 1 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}><BadgeCheck size={12} />{['Verified', 'In Progress', 'Initiated'][i] || 'Initiated'}</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'Audit Log' && (
        <Card className="overflow-hidden">
          {audit.map(a => (
            <div key={a.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 text-sm">
              <ScrollText size={15} className="text-slate-400" />
              <span className="font-medium text-slate-700">{a.actor}</span>
              <span className="text-slate-500">{a.action}</span>
              <span className="text-slate-400">· {a.entity}</span>
              <div className="flex-1" /><span className="text-xs text-slate-400">{relTime(a.at)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
