import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, Users, Kanban, CalendarDays, ClipboardCheck, FileText, UserPlus,
  Database, BarChart3, MessageSquare, Settings, ShieldAlert, Sparkles, Bell, Search, ChevronDown, LogOut, ExternalLink,
} from 'lucide-react'
import { useStore } from '../data/store'
import { roleLabel, roleNav } from '../lib/helpers'
import type { Role } from '../data/types'
import { Avatar } from './ui'
import AIDrawer from './AIDrawer'

const NAV = [
  { key: 'dashboard', to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { key: 'jobs', to: '/jobs', label: 'Jobs', icon: Briefcase },
  { key: 'candidates', to: '/candidates', label: 'Candidates', icon: Users },
  { key: 'pipeline', to: '/pipeline', label: 'Pipeline', icon: Kanban },
  { key: 'interviews', to: '/interviews', label: 'Interviews', icon: CalendarDays },
  { key: 'assessments', to: '/assessments', label: 'Assessments', icon: ClipboardCheck },
  { key: 'offers', to: '/offers', label: 'Offers', icon: FileText },
  { key: 'onboarding', to: '/onboarding', label: 'Onboarding', icon: UserPlus },
  { key: 'crm', to: '/crm', label: 'Talent CRM', icon: Database },
  { key: 'analytics', to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'communications', to: '/communications', label: 'Communications', icon: MessageSquare },
  { key: 'attrition', to: '/attrition', label: 'Attrition Risk', icon: ShieldAlert },
  { key: 'admin', to: '/admin', label: 'Admin & Settings', icon: Settings },
]

const ROLES: Role[] = ['admin', 'recruiter', 'hiring_manager', 'interviewer', 'analyst', 'it_admin', 'individual_hr', 'candidate']

export default function Layout({ children }: { children: React.ReactNode }) {
  const { role, setRole, currentUser, toasts, dismiss } = useStore()
  const [aiOpen, setAiOpen] = useState(false)
  const [roleMenu, setRoleMenu] = useState(false)
  const nav = useNavigate()
  const allowed = roleNav[role]
  const items = NAV.filter(n => allowed === '*' || (allowed as string[]).includes(n.key))
  const user = currentUser()

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">H</div>
          <div><div className="font-bold text-slate-800 leading-none">Hyre</div><div className="text-[10px] text-slate-400 mt-0.5">AI Hiring Platform</div></div>
        </div>
        <nav className="flex-1 overflow-auto px-3 py-3 space-y-0.5">
          {items.map(n => (
            <NavLink key={n.key} to={n.to} end={n.end as any}
              className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <n.icon size={17} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button onClick={() => nav('/careers')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
            <ExternalLink size={16} /> View Candidate Portal
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
          <div className="relative hidden sm:block w-72">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input placeholder="Search candidates, jobs…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:bg-white focus:border-brand-400" />
          </div>
          <div className="flex-1" />
          <button onClick={() => setAiOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100">
            <Sparkles size={16} /> <span className="hidden sm:inline">AI Assistant</span>
          </button>
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {/* Role switcher */}
          <div className="relative">
            <button onClick={() => setRoleMenu(v => !v)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 hover:bg-slate-50">
              <Avatar name={user.name} size={28} />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-slate-700">{user.name}</div>
                <div className="text-[10px] text-slate-400">{roleLabel[role]}</div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {roleMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoleMenu(false)} />
                <div className="absolute right-0 z-20 mt-1 w-60 animate-pop rounded-xl border border-slate-200 bg-white p-1.5 shadow-pop">
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Demo · Switch Role</div>
                  {ROLES.map(rr => (
                    <button key={rr} onClick={() => { setRole(rr); setRoleMenu(false); if (rr === 'candidate') nav('/portal'); else nav('/') }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${role === rr ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">{roleLabel[rr].split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                      {roleLabel[rr]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 animate-fadein">{children}</main>
      </div>

      <AIDrawer open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[60] space-y-2">
        {toasts.map(t => (
          <div key={t.id} onClick={() => dismiss(t.id)}
            className={`animate-pop cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-pop ${t.kind === 'error' ? 'bg-red-600' : t.kind === 'info' ? 'bg-slate-800' : 'bg-emerald-600'}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
