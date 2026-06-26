import React, { useState } from 'react'
import { UserPlus, ShieldCheck, FileCheck2, Lock } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, ScoreBar } from '../components/ui'

const ownerCls: Record<string, string> = {
  HR: 'bg-brand-50 text-brand-700', IT: 'bg-violet-50 text-violet-700', Admin: 'bg-amber-50 text-amber-700',
  Legal: 'bg-slate-100 text-slate-600', Finance: 'bg-emerald-50 text-emerald-700',
}

export default function Onboarding() {
  const { onboardings, toggleTask, toast } = useStore()
  const [active, setActive] = useState(onboardings[0]?.id)
  const ob = onboardings.find(o => o.id === active)

  return (
    <div>
      <PageHead title="Onboarding" subtitle={`${onboardings.length} new hires in progress`} />
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="overflow-hidden h-fit">
          {onboardings.map(o => (
            <button key={o.id} onClick={() => setActive(o.id)} className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 ${active === o.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
              <Avatar name={o.candidateName} size={36} />
              <div className="flex-1 min-w-0"><div className="truncate text-sm font-medium text-slate-700">{o.candidateName}</div><div className="truncate text-xs text-slate-400">{o.jobTitle}</div></div>
              <span className="text-xs font-semibold text-slate-600">{o.progress}%</span>
            </button>
          ))}
        </Card>

        {ob && (
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-slate-800">{ob.candidateName}</h3><Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">{ob.progress}% complete</Badge></div>
              <ScoreBar value={ob.progress} bar="bg-emerald-500" />
              <div className="mt-4 space-y-2">
                {ob.tasks.map((t, i) => (
                  <label key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={t.done} onChange={() => { toggleTask(ob.id, i); if (!t.done) toast(`"${t.label}" completed`) }} className="accent-brand-600 h-4 w-4" />
                    <span className={`flex-1 text-sm ${t.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{t.label}</span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${ownerCls[t.owner]}`}>{t.owner}</span>
                  </label>
                ))}
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3"><FileCheck2 size={16} className="text-brand-600" /><h4 className="font-semibold text-slate-800 text-sm">Document verification</h4></div>
                <ScoreBar value={(ob.docsVerified / ob.docsTotal) * 100} bar="bg-brand-500" />
                <div className="mt-2 text-sm text-slate-600">{ob.docsVerified} of {ob.docsTotal} documents verified</div>
                <Btn size="sm" variant="soft" className="mt-3" onClick={() => toast('Document marked verified')}><ShieldCheck size={14} /> Verify next</Btn>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3"><Lock size={16} className="text-slate-500" /><h4 className="font-semibold text-slate-800 text-sm">Sensitive data (encrypted)</h4></div>
                <div className="space-y-1.5 text-sm text-slate-600 font-mono">
                  <div>PAN · {ob.pan.slice(0, 3)}•••••{ob.pan.slice(-1)}</div>
                  <div>Aadhaar · {ob.aadhaar}</div>
                  <div>Bank A/C · {ob.account}</div>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">AES-256-GCM field-level encryption</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
