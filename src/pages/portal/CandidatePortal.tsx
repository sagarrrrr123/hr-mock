import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, CalendarClock, FileText, MessageSquare, Send, Mail, Upload } from 'lucide-react'
import { useStore } from '../../data/store'
import { Card, Btn, Badge, Input } from '../../components/ui'

const STEPS = ['Applied', 'Screening', 'Interview', 'Offer', 'Onboarding']

export default function CandidatePortal() {
  const { toast, offers } = useStore()
  const [loggedIn, setLoggedIn] = useState(false)
  const [sent, setSent] = useState(false)
  const [tab, setTab] = useState('Status')
  const [offerState, setOfferState] = useState<'pending' | 'accepted' | 'declined'>('pending')
  const [draft, setDraft] = useState('')
  const current = 3 // Offer stage

  if (!loggedIn) return (
    <div className="min-h-full grid place-items-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm p-8 text-center animate-pop">
        <div className="grid h-12 w-12 mx-auto place-items-center rounded-xl bg-brand-600 text-white font-bold text-lg">H</div>
        <h1 className="mt-4 text-lg font-bold text-slate-800">Candidate Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Track your application — passwordless login.</p>
        {!sent ? (
          <div className="mt-5 space-y-2">
            <Input placeholder="you@email.com" defaultValue="ananya.sharma@gmail.com" />
            <Btn className="w-full justify-center" onClick={() => { setSent(true); toast('Magic link sent (demo)') }}><Mail size={15} /> Send magic link</Btn>
          </div>
        ) : (
          <div className="mt-5">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800 mb-3">We sent a one-click link to your email.</div>
            <Btn className="w-full justify-center" onClick={() => setLoggedIn(true)}>Open my application (demo) →</Btn>
          </div>
        )}
        <Link to="/careers" className="mt-4 inline-block text-xs text-slate-400 hover:text-slate-600">← Back to careers</Link>
      </Card>
    </div>
  )

  return (
    <div className="min-h-full bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">H</div><div className="font-bold text-slate-800">Hyre</div></div>
          <div className="text-sm text-slate-500">Ananya Sharma</div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 animate-fadein">
        <h1 className="text-xl font-bold text-slate-800">Your application</h1>
        <p className="text-slate-500 text-sm">Senior Backend Engineer · Hyre</p>

        {/* Stepper */}
        <Card className="mt-4 p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1.5">
                  {i < current ? <CheckCircle2 className="text-emerald-500" /> : i === current ? <div className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white text-xs font-bold animate-pulse">{i + 1}</div> : <Circle className="text-slate-300" />}
                  <span className={`text-xs ${i <= current ? 'font-medium text-slate-700' : 'text-slate-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < current ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-brand-50 border border-brand-100 p-3 text-sm text-brand-800"><b>Next step:</b> You have an offer waiting — review and respond below.</div>
        </Card>

        {/* Tabs */}
        <div className="mt-4 flex gap-2">{['Status', 'Interview', 'Offer', 'Onboarding', 'Messages'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{t}</button>
        ))}</div>

        <div className="mt-4">
          {tab === 'Status' && <Card className="p-5 text-sm text-slate-600">You're in the <b>Offer</b> stage. Average response time from here is 2 days. Reach out anytime via Messages.</Card>}

          {tab === 'Interview' && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3"><CalendarClock size={16} className="text-brand-600" /><h3 className="font-semibold text-slate-800">Reschedule your interview</h3></div>
              <div className="grid sm:grid-cols-3 gap-2">{['Wed 2:00 PM', 'Thu 11:00 AM', 'Fri 4:30 PM'].map(s => (
                <button key={s} onClick={() => toast('Interview rescheduled — invite sent')} className="rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-600 hover:border-brand-400 hover:bg-brand-50">{s}</button>
              ))}</div>
            </Card>
          )}

          {tab === 'Offer' && (
            <Card className="p-6">
              {offerState === 'pending' ? <>
                <div className="flex items-center gap-2 mb-3 text-slate-500"><FileText size={16} /> offer_letter.pdf</div>
                <div className="rounded-lg border border-slate-200 p-5 text-sm text-slate-700 leading-relaxed mb-4">
                  <div className="text-center font-bold mb-3">Offer of Employment</div>
                  Dear Ananya,<br />We are delighted to offer you the role of <b>Senior Backend Engineer</b> with an annual CTC of <b>₹38,00,000</b>, joining in 30 days.
                </div>
                <div className="flex gap-2"><Btn variant="success" onClick={() => { setOfferState('accepted'); toast('Offer accepted! 🎉') }}>Accept offer</Btn><Btn variant="outline" onClick={() => { setOfferState('declined'); toast('Offer declined') }}>Decline</Btn></div>
              </> : offerState === 'accepted' ? (
                <div className="text-center py-6"><CheckCircle2 size={44} className="mx-auto text-emerald-500 mb-2" /><h3 className="font-bold text-slate-800">Offer accepted!</h3><p className="text-sm text-slate-500 mt-1">Onboarding has started — complete your tasks under the Onboarding tab.</p></div>
              ) : <div className="text-center py-6 text-slate-500">You declined this offer.</div>}
            </Card>
          )}

          {tab === 'Onboarding' && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Complete your onboarding</h3>
              {['Upload PAN card', 'Upload address proof', 'Bank details form', 'Sign NDA'].map((t, i) => (
                <label key={t} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 mb-2 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" className="accent-brand-600 h-4 w-4" onChange={() => toast(`"${t}" done`)} />
                  <span className="flex-1 text-sm text-slate-700">{t}</span>
                  <Upload size={15} className="text-slate-400" />
                </label>
              ))}
            </Card>
          )}

          {tab === 'Messages' && (
            <Card className="flex flex-col" style={{ minHeight: 320 }}>
              <div className="flex-1 space-y-2 p-4">
                <div className="max-w-[75%] rounded-2xl bg-slate-100 px-3.5 py-2 text-sm text-slate-700">Hi Ananya! Congrats on the offer. Let us know if you have any questions.</div>
                <div className="ml-auto max-w-[75%] rounded-2xl bg-brand-600 px-3.5 py-2 text-sm text-white">Thank you! What's the joining flexibility?</div>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 p-3">
                <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message the company…" className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
                <Btn onClick={() => { if (draft) { toast('Message sent'); setDraft('') } }}><Send size={15} /></Btn>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
