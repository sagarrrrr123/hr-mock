import React, { useState } from 'react'
import { Award, Users, Plus, Check } from 'lucide-react'
import { Modal, Btn, Input } from './ui'
import { useStore } from '../data/store'

export default function PoolPicker({ open, onClose, onPick, count = 1 }: {
  open: boolean; onClose: () => void; onPick: (poolId: string, poolName: string) => void; count?: number
}) {
  const { pools, addPool } = useStore()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  return (
    <Modal open={open} onClose={onClose} title={`Add ${count > 1 ? `${count} candidates` : 'candidate'} to a pool`}>
      <div className="space-y-2">
        {pools.map(p => (
          <button key={p.id} onClick={() => { onPick(p.id, p.name); onClose() }}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left hover:border-brand-400 hover:bg-brand-50">
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${p.type === 'Silver-Medalist' ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'}`}>
              {p.type === 'Silver-Medalist' ? <Award size={17} /> : <Users size={17} />}
            </span>
            <span className="flex-1"><span className="block text-sm font-medium text-slate-700">{p.name}</span><span className="block text-xs text-slate-400">{p.memberIds.length} members · {p.type}</span></span>
            <Check size={16} className="text-slate-300" />
          </button>
        ))}

        {!creating ? (
          <button onClick={() => setCreating(true)} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
            <Plus size={15} /> Create a new pool
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2">
            <Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="New pool name…" />
            <Btn onClick={() => { if (!name.trim()) return; const id = addPool(name.trim()); onPick(id, name.trim()); onClose(); setName(''); setCreating(false) }}>Create</Btn>
          </div>
        )}
      </div>
    </Modal>
  )
}
