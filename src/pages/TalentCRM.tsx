import React, { useState } from 'react'
import { Database, Users, Mail, Send, Plus, Award, Search, X } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Tabs, Modal, Field, Select, Input } from '../components/ui'
import PoolPicker from '../components/PoolPicker'
import { scoreBand } from '../lib/helpers'

export default function TalentCRM() {
  const { pools, campaigns, candidates, toast, addToPool, removeFromPool, addPool } = useStore()
  const [tab, setTab] = useState('Talent Pools')
  const [activePool, setActivePool] = useState<string | null>(null)
  const [newCampaign, setNewCampaign] = useState(false)
  const [q, setQ] = useState('')
  const [pickFor, setPickFor] = useState<string | null>(null)
  const [newPool, setNewPool] = useState(false)
  const [newPoolName, setNewPoolName] = useState('')

  const pool = pools.find(p => p.id === activePool)
  const members = pool ? candidates.filter(c => pool.memberIds.includes(c.id)) : []
  const searchRes = candidates.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.skills.join(' ').toLowerCase().includes(q.toLowerCase())).slice(0, 12)

  return (
    <div>
      <PageHead title="Talent CRM" subtitle="Turn every past candidate into a reusable asset" />
      <Tabs tabs={['Talent Pools', 'Outreach Campaigns', 'Candidate Database']} active={tab} onChange={setTab} />

      {tab === 'Talent Pools' && !pool && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pools.map(p => (
            <Card key={p.id} className="p-5 cursor-pointer hover:shadow-pop transition" >
              <div onClick={() => setActivePool(p.id)}>
                <div className="flex items-center justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-lg ${p.type === 'Silver-Medalist' ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'}`}>{p.type === 'Silver-Medalist' ? <Award size={20} /> : <Users size={20} />}</div>
                  {p.dynamic && <Badge className="bg-violet-50 text-violet-700 border-violet-100">Dynamic</Badge>}
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">{p.name}</h3>
                <p className="text-sm text-slate-500">{p.type}</p>
                <div className="mt-3 flex items-center gap-1 text-sm text-slate-600"><Users size={14} />{p.memberIds.length} candidates</div>
              </div>
            </Card>
          ))}
          <Card onClick={() => setNewPool(true)} className="p-5 flex items-center justify-center border-dashed cursor-pointer hover:bg-slate-50" >
            <div className="text-center text-slate-400"><Plus className="mx-auto mb-1" /><div className="text-sm">New pool</div></div>
          </Card>
        </div>
      )}

      {tab === 'Talent Pools' && pool && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <button onClick={() => setActivePool(null)} className="text-sm text-slate-500 hover:text-slate-700">← All pools</button>
            <div className="flex items-center gap-2"><h3 className="font-semibold text-slate-800">{pool.name}</h3><Badge className="bg-slate-100 text-slate-600 border-slate-200">{members.length}</Badge></div>
            <Btn size="sm" variant="soft" onClick={() => toast(`Outreach launched to ${members.length} candidates`)}><Send size={14} /> Outreach all</Btn>
          </div>
          {members.map(c => (
            <div key={c.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0">
              <Avatar name={c.name} size={34} />
              <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-700">{c.name}</div><div className="text-xs text-slate-400">{c.jobTitle} · {c.currentCompany}</div></div>
              {!c.consent && <Badge className="bg-red-50 text-red-600 border-red-100">opted-out</Badge>}
              <Badge className={scoreBand(c.matchScore).cls}>{c.matchScore}</Badge>
              <button onClick={() => { removeFromPool(pool.id, c.id); toast(`Removed ${c.name.split(' ')[0]} from ${pool.name}`, 'info') }}
                className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500" title="Remove from pool"><X size={16} /></button>
            </div>
          ))}
          {members.length === 0 && <div className="p-10 text-center text-sm text-slate-400">No members yet.</div>}
        </Card>
      )}

      {tab === 'Outreach Campaigns' && (
        <div>
          <div className="mb-4 flex justify-end"><Btn onClick={() => setNewCampaign(true)}><Plus size={15} /> New campaign</Btn></div>
          <div className="grid lg:grid-cols-2 gap-4">
            {campaigns.map(cm => (
              <Card key={cm.id} className="p-5">
                <div className="flex items-center justify-between mb-1"><h3 className="font-semibold text-slate-800">{cm.name}</h3><Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{cm.status}</Badge></div>
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-1"><Mail size={12} />{cm.channel} · {cm.steps.length}-step sequence</div>
                <div className="space-y-1.5 mb-3">{cm.steps.map((s, i) => <div key={i} className="flex items-center gap-2 text-sm text-slate-600"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">{s.delay}</span>{s.subject}</div>)}</div>
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                  <div><div className="text-lg font-bold text-slate-800">{cm.sent}</div><div className="text-[11px] text-slate-400">sent</div></div>
                  <div><div className="text-lg font-bold text-brand-600">{cm.opened}</div><div className="text-[11px] text-slate-400">opened</div></div>
                  <div><div className="text-lg font-bold text-emerald-600">{cm.replied}</div><div className="text-[11px] text-slate-400">replied</div></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'Candidate Database' && (
        <div>
          <div className="relative mb-4 max-w-lg">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search every past applicant by name or skill…" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500" />
          </div>
          <Card className="overflow-hidden">
            {searchRes.map(c => (
              <div key={c.id} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50">
                <Avatar name={c.name} size={32} />
                <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-700">{c.name}</div><div className="text-xs text-slate-400">{c.skills.slice(0, 4).join(', ')}</div></div>
                <Btn size="sm" variant="ghost" onClick={() => setPickFor(c.id)}><Plus size={14} /> Add to pool</Btn>
              </div>
            ))}
          </Card>
        </div>
      )}

      <Modal open={newCampaign} onClose={() => setNewCampaign(false)} title="New outreach campaign">
        <Field label="Campaign name"><Input placeholder="Re-engage Q3 designers" /></Field>
        <Field label="Target pool"><Select>{pools.map(p => <option key={p.id}>{p.name}</option>)}</Select></Field>
        <Field label="Channel"><Select>{['Email', 'SMS', 'WhatsApp'].map(c => <option key={c}>{c}</option>)}</Select></Field>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 mb-3">3-step sequence: Day 0 → Day 3 → Day 7. Respects consent + frequency caps.</div>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setNewCampaign(false)}>Cancel</Btn><Btn onClick={() => { setNewCampaign(false); toast('Campaign launched') }}><Send size={14} /> Launch</Btn></div>
      </Modal>

      <PoolPicker open={!!pickFor} onClose={() => setPickFor(null)}
        onPick={(pid, pname) => { if (pickFor) { addToPool(pid, pickFor); toast(`Added to ${pname}`) } }} />

      <Modal open={newPool} onClose={() => setNewPool(false)} title="Create a new talent pool">
        <Field label="Pool name"><Input autoFocus value={newPoolName} onChange={e => setNewPoolName(e.target.value)} placeholder="e.g. Backend Engineers 2026" /></Field>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setNewPool(false)}>Cancel</Btn>
          <Btn onClick={() => { if (!newPoolName.trim()) return; addPool(newPoolName.trim()); toast(`Created "${newPoolName.trim()}"`); setNewPoolName(''); setNewPool(false) }}>Create pool</Btn></div>
      </Modal>
    </div>
  )
}
