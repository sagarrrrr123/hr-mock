import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Badge, PageHead, Avatar, ScoreBar } from '../components/ui'

export default function Attrition() {
  const { attrition } = useStore()
  const band = (r: number) => r >= 60 ? { cls: 'bg-red-100 text-red-600 border-red-200', bar: 'bg-red-500', label: 'High' } : r >= 35 ? { cls: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500', label: 'Medium' } : { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', label: 'Low' }

  return (
    <div>
      <PageHead title="Attrition Risk" subtitle="AI-predicted early-attrition risk for new hires (first 3 months)" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attrition.map(a => {
          const b = band(a.risk)
          return (
            <Card key={a.candidateId} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={a.name} size={40} />
                <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-700">{a.name}</div><div className="text-xs text-slate-400">{a.role}</div></div>
                <Badge className={b.cls}><ShieldAlert size={12} />{b.label}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mb-1"><span className="text-slate-500">Risk score</span><span className="font-bold text-slate-700">{a.risk}%</span></div>
              <ScoreBar value={a.risk} bar={b.bar} />
              <p className="mt-3 text-xs text-slate-500"><b>Signal:</b> {a.signal}</p>
            </Card>
          )
        })}
      </div>
      <Card className="mt-4 p-4 text-xs text-slate-500 flex items-center gap-2"><ShieldAlert size={14} className="text-brand-600" /> Predictions come from onboarding signals (form-completion speed, document completeness, engagement) — surfaced so HR can intervene early.</Card>
    </div>
  )
}
