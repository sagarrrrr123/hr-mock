import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { initials, avatarColor } from '../lib/helpers'

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-white rounded-xl border border-slate-200 shadow-card ${className}`}>{children}</div>
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled }: any) {
  const v: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
    ghost: 'text-slate-600 hover:bg-slate-100',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  }
  const s: Record<string, string> = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  return <button type={type} disabled={disabled} onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition ${v[variant]} ${s[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>{children}</button>
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return <div className="flex items-center justify-center rounded-full text-white font-semibold shrink-0"
    style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.38 }}>{initials(name)}</div>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${props.className || ''}`} />
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${props.className || ''}`} />
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${props.className || ''}`} />
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[6vh] overflow-auto" onMouseDown={onClose}>
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} animate-pop`} onMouseDown={e => e.stopPropagation()}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
          </div>
          <div className="px-5 py-4">{children}</div>
        </Card>
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, title, children, width = 420 }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; width?: number }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onMouseDown={onClose}>
      <div className="h-full bg-white shadow-pop animate-slidein flex flex-col" style={{ width }} onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-3"><div className="mb-1 text-xs font-medium text-slate-600">{label}</div>{children}</label>
}

export function PageHead({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-slate-200 mb-4 overflow-x-auto">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={`whitespace-nowrap px-3.5 py-2 text-sm font-medium border-b-2 -mb-px transition ${active === t ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}</button>
      ))}
    </div>
  )
}

export function ScoreBar({ value, className = '', bar }: { value: number; className?: string; bar: string }) {
  return <div className={`h-1.5 w-full rounded-full bg-slate-100 ${className}`}><div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} /></div>
}

export function Empty({ icon: Icon, title, hint }: { icon: any; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
      <Icon size={40} className="mb-3 opacity-50" />
      <p className="font-medium text-slate-600">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
    </div>
  )
}

export function Stat({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub?: React.ReactNode; accent?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold animate-count ${accent || 'text-slate-800'}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </Card>
  )
}
