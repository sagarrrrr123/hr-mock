import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList,
  LineChart, Line, CartesianGrid, Cell, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts'
import { Sparkles } from 'lucide-react'
import { useStore } from '../data/store'
import { Card, PageHead, Tabs, Badge } from '../components/ui'
import { STAGES } from '../data/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#14b8a6', '#10b981']

export default function Analytics() {
  const { candidates } = useStore()
  const [tab, setTab] = useState('Funnel')

  const funnel = STAGES.filter(s => s !== 'Rejected').map((s, i) => ({ name: s, value: candidates.filter(c => STAGES.indexOf(c.stage) >= i && c.stage !== 'Rejected').length || candidates.filter(c => c.stage === s).length, fill: COLORS[i] }))
  const tti = [{ stage: 'Applied→Shortlist', days: 3 }, { stage: 'Shortlist→Activity', days: 4 }, { stage: 'Activity→Interview', days: 5 }, { stage: 'Interview→Offer', days: 4 }, { stage: 'Offer→Hire', days: 2 }]
  const interviewers = [{ name: 'Sara Khan', pass: 72, count: 18 }, { name: 'Rohan Gupta', pass: 58, count: 22 }, { name: 'Priya Nair', pass: 81, count: 12 }, { name: 'Vikram I.', pass: 39, count: 15 }]
  const sources = [{ name: 'Own Database', cph: 8000 }, { name: 'Referral', cph: 22000 }, { name: 'Careers Page', cph: 14000 }, { name: 'LinkedIn', cph: 48000 }, { name: 'Naukri', cph: 36000 }]

  return (
    <div>
      <PageHead title="Analytics & Reports" subtitle="Decision-grade hiring intelligence" />
      <Tabs tabs={['Funnel', 'Time to Hire', 'Interviewer Calibration', 'Source ROI', 'Forecast']} active={tab} onChange={setTab} />

      {tab === 'Funnel' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Funnel drop-off</h3>
          <p className="text-xs text-slate-500 mb-4">Where candidates fall out of the pipeline.</p>
          <ResponsiveContainer width="100%" height={320}>
            <FunnelChart><Tooltip /><Funnel dataKey="value" data={funnel} isAnimationActive><LabelList position="right" fill="#475569" stroke="none" dataKey="name" /><LabelList position="center" fill="#fff" stroke="none" dataKey="value" /></Funnel></FunnelChart>
          </ResponsiveContainer>
        </Card>
      )}

      {tab === 'Time to Hire' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Time in stage</h3>
          <p className="text-xs text-slate-500 mb-4">Average days · total ≈ 18 days (goal ≤ 15).</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tti}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="stage" fontSize={11} tickLine={false} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="days" radius={[6, 6, 0, 0]} fill="#2d4a7c" /></BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {tab === 'Interviewer Calibration' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Interviewer pass rates</h3>
          <p className="text-xs text-slate-500 mb-4">Outliers may signal bias or a bottleneck.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interviewers} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0, 100]} fontSize={11} /><YAxis type="category" dataKey="name" fontSize={11} width={90} /><Tooltip /><Bar dataKey="pass" radius={[0, 6, 6, 0]}>{interviewers.map((d, i) => <Cell key={i} fill={d.pass < 45 ? '#ef4444' : d.pass > 75 ? '#10b981' : '#f59e0b'} />)}</Bar></BarChart>
          </ResponsiveContainer>
          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 p-2.5 text-xs text-amber-800">⚠ Vikram I. passes only 39% — review calibration.</div>
        </Card>
      )}

      {tab === 'Source ROI' && (
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Cost per hire by source</h3>
          <p className="text-xs text-slate-500 mb-4">Your own database is the cheapest source.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sources}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} tickFormatter={v => `₹${v / 1000}k`} /><Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} /><Bar dataKey="cph" radius={[6, 6, 0, 0]}>{sources.map((d, i) => <Cell key={i} fill={i === 0 ? '#10b981' : '#94a3b8'} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {tab === 'Forecast' && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5 flex flex-col items-center">
            <div className="flex items-center gap-2 self-start mb-1"><Sparkles size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Hiring forecast</h3></div>
            <p className="text-xs text-slate-500 self-start mb-2">Engineering · this quarter</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'progress', value: 65, fill: '#f59e0b' }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-32 text-center"><div className="text-3xl font-bold text-slate-800">13<span className="text-slate-300">/20</span></div><div className="text-xs text-slate-500">predicted / target</div></div>
          </Card>
          <Card className="p-5 flex flex-col justify-center">
            <h3 className="font-semibold text-slate-800 mb-2">Recommendation</h3>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 text-sm text-amber-900 mb-3"><b>Gap: 7 hires.</b> Based on current pipeline and historical conversion.</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><span className="text-brand-600">→</span> Increase top-of-funnel sourcing by <b>35%</b></li>
              <li className="flex gap-2"><span className="text-brand-600">→</span> Improve onsite→offer conversion from <b>40% to 55%</b></li>
              <li className="flex gap-2"><span className="text-brand-600">→</span> Re-engage the silver-medalist pool (11 warm replies)</li>
            </ul>
            <Badge className="mt-3 self-start bg-slate-100 text-slate-500 border-slate-200">Confidence: 82%</Badge>
          </Card>
        </div>
      )}
    </div>
  )
}
