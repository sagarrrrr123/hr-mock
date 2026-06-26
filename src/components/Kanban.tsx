import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import { STAGES, type Stage, type Candidate } from '../data/types'
import { stageDot, scoreBand } from '../lib/helpers'
import { Avatar } from './ui'

export default function Kanban({ candidates }: { candidates: Candidate[] }) {
  const { moveCandidate, toast } = useStore()
  const nav = useNavigate()
  const [drag, setDrag] = useState<string | null>(null)
  const [over, setOver] = useState<Stage | null>(null)

  const drop = (stage: Stage) => {
    if (!drag) return
    const c = candidates.find(x => x.id === drag)
    moveCandidate(drag, stage)
    setDrag(null); setOver(null)
    if (c && c.stage !== stage) {
      toast(`${c.name} → ${stage}`)
      if (stage === 'Interview') setTimeout(() => toast('Booking link sent to candidate', 'info'), 400)
      if (stage === 'Offer') setTimeout(() => toast('Open Offers to generate the letter', 'info'), 400)
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {STAGES.map(stage => {
        const items = candidates.filter(c => c.stage === stage)
        return (
          <div key={stage}
            onDragOver={e => { e.preventDefault(); setOver(stage) }}
            onDragLeave={() => setOver(o => o === stage ? null : o)}
            onDrop={() => drop(stage)}
            className={`w-64 shrink-0 rounded-xl border p-2 transition ${over === stage ? 'border-brand-400 bg-brand-50/40' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center justify-between px-1.5 py-1.5">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"><span className={`h-2 w-2 rounded-full ${stageDot[stage]}`} />{stage}</div>
              <span className="rounded-full bg-white px-2 text-xs font-medium text-slate-500 border border-slate-200">{items.length}</span>
            </div>
            <div className="space-y-2 min-h-[40px]">
              {items.map(c => {
                const band = scoreBand(c.matchScore)
                return (
                  <div key={c.id} draggable onDragStart={() => setDrag(c.id)} onDragEnd={() => setDrag(null)}
                    onClick={() => nav(`/candidates/${c.id}`)}
                    className={`group rounded-lg border border-slate-200 bg-white p-2.5 shadow-card cursor-grab active:cursor-grabbing hover:shadow-pop transition ${drag === c.id ? 'opacity-40' : ''}`}>
                    <div className="flex items-center gap-2">
                      <Avatar name={c.name} size={28} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-700">{c.name}</div>
                        <div className="truncate text-[11px] text-slate-400">{c.jobTitle}</div>
                      </div>
                      <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${band.cls}`}>{c.matchScore}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{c.source}</span><span>{c.daysInStage}d in stage</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
