import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Clock, CheckCircle2, Briefcase, Users, Plus, CalendarPlus, UserPlus, Sparkles } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, Stat, Btn, Avatar, Badge, PageHead } from '../components/ui'
import { STAGES } from '../data/types'
import { stageColor, stageDot, roleLabel } from '../lib/helpers'

export default function Dashboard() {
  const { candidates, jobs, role, currentUser, recentActivity } = useStore()
  const nav = useNavigate()
  const openRoles = jobs.filter(j => j.status === 'Published').length
  const inPipeline = candidates.filter(c => !['Hired', 'Rejected'].includes(c.stage)).length
  const hired = candidates.filter(c => c.stage === 'Hired').length
  const counts = STAGES.map(s => ({ s, n: candidates.filter(c => c.stage === s).length }))
  const maxN = Math.max(...counts.map(c => c.n), 1)
  const user = currentUser()
  const analystOnly = role === 'analyst'

  return (
    <div>
      <PageHead title={`Welcome back, ${user.name.split(' ')[0]} 👋`} subtitle={`${roleLabel[role]} · here's your hiring at a glance`}
        actions={!analystOnly && <>
          <Btn variant="outline" onClick={() => nav('/jobs')}><Plus size={15} /> Post a job</Btn>
          <Btn onClick={() => nav('/candidates')}><UserPlus size={15} /> Add candidate</Btn>
        </>} />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label="Time to hire" value="18 days" sub={<span className="text-emerald-600">goal ≤ 15</span>} />
        <Stat label="Offer acceptance" value="65%" sub={<span className="text-emerald-600">goal 75%</span>} />
        <Stat label="Open roles" value={openRoles} sub="across 4 depts" accent="text-brand-700" />
        <Stat label="In pipeline" value={inPipeline} sub="active candidates" accent="text-brand-700" />
        <Stat label="Hired (Q)" value={hired} sub="this quarter" accent="text-emerald-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pipeline health */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Pipeline health</h3>
            <Btn size="sm" variant="ghost" onClick={() => nav('/pipeline')}>Open board →</Btn>
          </div>
          <div className="space-y-2.5">
            {counts.map(({ s, n }) => (
              <div key={s} className="flex items-center gap-3">
                <div className="w-24 flex items-center gap-1.5 text-sm text-slate-600"><span className={`h-2 w-2 rounded-full ${stageDot[s]}`} />{s}</div>
                <div className="flex-1 h-6 rounded-md bg-slate-100 overflow-hidden">
                  <div className={`h-full ${stageDot[s]} opacity-80`} style={{ width: `${(n / maxN) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-sm font-semibold text-slate-700">{n}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Forecast */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-1"><Sparkles size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Hiring forecast</h3></div>
          <p className="text-xs text-slate-500 mb-4">Engineering · this quarter</p>
          <div className="flex items-end gap-4 mb-4">
            <div><div className="text-3xl font-bold text-slate-800">13</div><div className="text-xs text-slate-500">predicted</div></div>
            <div className="text-slate-300 text-2xl pb-1">/</div>
            <div><div className="text-3xl font-bold text-brand-600">20</div><div className="text-xs text-slate-500">target</div></div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-3"><div className="h-full bg-amber-500" style={{ width: '65%' }} /></div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800">
            <b>Gap: 7 hires.</b> Recommendation: increase sourcing by <b>35%</b>, or improve onsite→offer conversion 40%→55%.
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-3">Recent activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {a.who === 'AI' ? <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600"><Sparkles size={15} /></span> : <Avatar name={a.who} size={32} />}
                <div className="flex-1"><span className="font-medium text-slate-700">{a.who}</span> <span className="text-slate-500">{a.what}</span></div>
                <span className="text-xs text-slate-400">{a.when}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Quick actions</h3>
          <div className="space-y-2">
            <Btn className="w-full justify-start" variant="soft" onClick={() => nav('/jobs')}><Briefcase size={15} /> Create & publish a job</Btn>
            <Btn className="w-full justify-start" variant="soft" onClick={() => nav('/interviews')}><CalendarPlus size={15} /> Schedule an interview</Btn>
            <Btn className="w-full justify-start" variant="soft" onClick={() => nav('/crm')}><Users size={15} /> Re-engage past candidates</Btn>
            <Btn className="w-full justify-start" variant="soft" onClick={() => nav('/analytics')}><TrendingUp size={15} /> View hiring analytics</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
