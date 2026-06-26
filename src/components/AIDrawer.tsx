import React, { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { Drawer, Btn } from './ui'
import { useStore } from '../data/store'

const CANNED: { q: string; a: string }[] = [
  { q: 'top candidates for devops', a: 'Top 3 for **DevOps Engineer** by match score:\n1. 92 — strong on Kubernetes, Terraform, AWS\n2. 88 — ex-Razorpay, great CI/CD depth\n3. 84 — solid Linux + observability\n\nWant me to add them to the pipeline?' },
  { q: 'forecast', a: 'Current pipeline predicts **13 hires** vs a target of **20**.\nRecommendation: increase sourcing by **35%**, or lift onsite→offer conversion from 40%→55%.' },
  { q: 'move', a: 'Done — moved the candidate to **Interview** and triggered a booking link. ✅' },
  { q: 'silver', a: 'Your **Silver-Medalist** pool has strong-but-rejected engineers. An outreach campaign is already running: 42 sent · 28 opened · 11 replied.' },
]

export default function AIDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useStore()
  const [log, setLog] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm your hiring copilot. Try: \"show top candidates for DevOps\", \"give me the hiring forecast\", or \"move John to interview\"." },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const send = (text?: string) => {
    const q = (text ?? input).trim()
    if (!q) return
    setLog(l => [...l, { role: 'user', text: q }])
    setInput(''); setBusy(true)
    setTimeout(() => {
      const hit = CANNED.find(c => q.toLowerCase().includes(c.q)) || { a: "Here's what I found across your pipeline. (This is a mock assistant — wire it to your AI service to make it live.)" }
      setLog(l => [...l, { role: 'ai', text: hit.a }])
      setBusy(false)
      if (q.toLowerCase().includes('move')) toast('Candidate moved to Interview')
    }, 900)
  }

  return (
    <Drawer open={open} onClose={onClose} title="AI Assistant" width={440}>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {log.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') }} />
            </div>
          ))}
          {busy && <div className="flex justify-start"><div className="rounded-2xl bg-slate-100 px-3.5 py-2 text-sm text-slate-400">thinking…</div></div>}
        </div>
        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {['Top candidates for DevOps', 'Hiring forecast', 'Show silver-medalists'].map(s => (
              <button key={s} onClick={() => send(s)} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700 hover:bg-brand-100">{s}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
            <Btn onClick={() => send()}><Send size={15} /></Btn>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
