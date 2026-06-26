import React, { useState } from 'react'
import { Send, Mail } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Btn, Badge, PageHead, Avatar, Modal, Field, Select, Textarea } from '../components/ui'

const channelCls: Record<string, string> = {
  Email: 'bg-blue-50 text-blue-700 border-blue-100', Telegram: 'bg-sky-50 text-sky-700 border-sky-100',
  SMS: 'bg-violet-50 text-violet-700 border-violet-100', WhatsApp: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default function Communications() {
  const { messages, toast } = useStore()
  const [active, setActive] = useState(messages[0]?.id)
  const [bulk, setBulk] = useState(false)
  const [draft, setDraft] = useState('')
  const m = messages.find(x => x.id === active)

  return (
    <div>
      <PageHead title="Communications" subtitle="Two-way candidate conversations across channels"
        actions={<Btn onClick={() => setBulk(true)}><Mail size={15} /> Bulk message</Btn>} />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="overflow-hidden h-fit">
          {messages.map(msg => (
            <button key={msg.id} onClick={() => setActive(msg.id)} className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 ${active === msg.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
              <Avatar name={msg.candidateName} size={36} />
              <div className="flex-1 min-w-0"><div className="truncate text-sm font-medium text-slate-700">{msg.candidateName}</div><div className="truncate text-xs text-slate-400">{msg.thread[msg.thread.length - 1].text}</div></div>
              <Badge className={channelCls[msg.channel]}>{msg.channel}</Badge>
            </button>
          ))}
        </Card>

        {m && (
          <Card className="lg:col-span-2 flex flex-col" >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><Avatar name={m.candidateName} size={36} /><div><div className="text-sm font-medium text-slate-700">{m.candidateName}</div><Badge className={channelCls[m.channel]}>{m.channel}</Badge></div></div>
            <div className="flex-1 space-y-2 overflow-auto p-4" style={{ minHeight: 280 }}>
              {m.thread.map((t, i) => (
                <div key={i} className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${t.from === 'company' ? 'ml-auto bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{t.text}</div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-200 p-3">
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && draft) { toast('Message sent'); setDraft('') } }} placeholder={`Reply via ${m.channel}…`} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
              <Btn onClick={() => { if (draft) { toast('Message sent'); setDraft('') } }}><Send size={15} /></Btn>
            </div>
          </Card>
        )}
      </div>

      <Modal open={bulk} onClose={() => setBulk(false)} title="Bulk message">
        <Field label="Audience"><Select>{['All shortlisted', 'Silver-Medalist pool', 'Interview stage', 'Custom segment'].map(a => <option key={a}>{a}</option>)}</Select></Field>
        <Field label="Channel"><Select>{['Email', 'Telegram', 'SMS', 'WhatsApp'].map(c => <option key={c}>{c}</option>)}</Select></Field>
        <Field label="Message"><Textarea rows={4} placeholder="Hi {{first_name}}, …" /></Field>
        <div className="flex justify-end gap-2"><Btn variant="outline" onClick={() => setBulk(false)}>Cancel</Btn><Btn onClick={() => { setBulk(false); toast('Bulk message queued to 18 candidates') }}><Send size={14} /> Send</Btn></div>
      </Modal>
    </div>
  )
}
