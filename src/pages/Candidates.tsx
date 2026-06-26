import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, MessageSquare, FolderPlus, X, Sparkles, Trash2 } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Select } from '../components/ui'
import PoolPicker from '../components/PoolPicker'
import { STAGES, type Stage } from '../data/types'
import { scoreBand, stageColor, relTime } from '../lib/helpers'

export default function Candidates() {
  const { candidates, addToPool, removeCandidate, toast } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [stage, setStage] = useState<string>('all')
  const [minScore, setMinScore] = useState(0)
  const [source, setSource] = useState('all')
  const [sel, setSel] = useState<string[]>([])
  const [semantic, setSemantic] = useState(false)
  const [poolOpen, setPoolOpen] = useState(false)

  const sources = useMemo(() => ['all', ...Array.from(new Set(candidates.map(c => c.source)))], [candidates])
  const rows = candidates.filter(c =>
    (stage === 'all' || c.stage === stage) &&
    (source === 'all' || c.source === source) &&
    c.matchScore >= minScore &&
    (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.skills.join(' ').toLowerCase().includes(q.toLowerCase()) || c.jobTitle.toLowerCase().includes(q.toLowerCase()))
  )

  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div>
      <PageHead title="Candidates" subtitle={`${rows.length} of ${candidates.length} candidates`} />

      <Card className="p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={semantic ? 'Semantic: "backend engineer who scaled payments"' : 'Search name, skill, role…'}
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500" />
          </div>
          <button onClick={() => { setSemantic(s => !s); toast(semantic ? 'Keyword search' : 'Semantic search on', 'info') }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${semantic ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-300 text-slate-600'}`}>
            <Sparkles size={15} /> Semantic
          </button>
          <Select className="w-36" value={stage} onChange={e => setStage(e.target.value)}><option value="all">All stages</option>{STAGES.map(s => <option key={s}>{s}</option>)}</Select>
          <Select className="w-36" value={source} onChange={e => setSource(e.target.value)}>{sources.map(s => <option key={s} value={s}>{s === 'all' ? 'All sources' : s}</option>)}</Select>
          <div className="flex items-center gap-2 text-xs text-slate-500"><SlidersHorizontal size={14} />Min score
            <input type="range" min={0} max={95} value={minScore} onChange={e => setMinScore(+e.target.value)} />
            <span className="w-6 font-semibold text-slate-700">{minScore}</span></div>
        </div>
      </Card>

      {sel.length > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm text-white animate-pop">
          <span className="font-medium">{sel.length} selected</span>
          <div className="flex-1" />
          <Btn size="sm" variant="soft" onClick={() => toast(`Message sent to ${sel.length} candidates`)}><MessageSquare size={14} /> Message</Btn>
          <Btn size="sm" variant="soft" onClick={() => setPoolOpen(true)}><FolderPlus size={14} /> Add to pool</Btn>
          <Btn size="sm" variant="danger" onClick={() => { const n = sel.length; sel.forEach(id => removeCandidate(id)); toast(`Deleted ${n} candidates`, 'info'); setSel([]) }}><Trash2 size={14} /> Delete</Btn>
          <button onClick={() => setSel([])} className="rounded p-1 hover:bg-white/20"><X size={16} /></button>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[28px_1fr_90px_110px_90px_90px_70px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span></span><span>Candidate</span><span>Match</span><span>Stage</span><span>Source</span><span>Exp</span><span>Applied</span>
        </div>
        {rows.map(c => {
          const band = scoreBand(c.matchScore)
          return (
            <div key={c.id} className="grid grid-cols-[28px_1fr_90px_110px_90px_90px_70px] items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-0 hover:bg-slate-50">
              <input type="checkbox" checked={sel.includes(c.id)} onChange={() => toggle(c.id)} className="accent-brand-600" />
              <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={() => nav(`/candidates/${c.id}`)}>
                <Avatar name={c.name} size={32} />
                <div className="min-w-0"><div className="truncate text-sm font-medium text-slate-700">{c.name}</div><div className="truncate text-xs text-slate-400">{c.jobTitle}</div></div>
              </div>
              <Badge className={band.cls}>{c.matchScore}</Badge>
              <Badge className={stageColor[c.stage as Stage]}>{c.stage}</Badge>
              <span className="text-xs text-slate-500">{c.source}</span>
              <span className="text-xs text-slate-500">{c.experience}y</span>
              <span className="text-xs text-slate-400">{relTime(c.appliedAt)}</span>
            </div>
          )
        })}
        {rows.length === 0 && <div className="p-10 text-center text-sm text-slate-400">No candidates match your filters.</div>}
      </Card>

      <PoolPicker open={poolOpen} count={sel.length} onClose={() => setPoolOpen(false)}
        onPick={(pid, pname) => { sel.forEach(id => addToPool(pid, id)); toast(`Added ${sel.length} to ${pname}`); setSel([]) }} />
    </div>
  )
}
