import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Candidates from './pages/Candidates'
import PersonProfile from './pages/PersonProfile'
import Pipeline from './pages/Pipeline'
import Interviews from './pages/Interviews'
import Assessments from './pages/Assessments'
import Offers from './pages/Offers'
import Onboarding from './pages/Onboarding'
import TalentCRM from './pages/TalentCRM'
import Analytics from './pages/Analytics'
import Communications from './pages/Communications'
import Admin from './pages/Admin'
import Attrition from './pages/Attrition'
import Careers from './pages/portal/Careers'
import CandidatePortal from './pages/portal/CandidatePortal'

export default function App() {
  const loc = useLocation()
  const isPortal = loc.pathname.startsWith('/careers') || loc.pathname.startsWith('/portal') || loc.pathname.startsWith('/apply')

  if (isPortal) {
    return (
      <Routes>
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:jobId" element={<Careers />} />
        <Route path="/apply/:jobId" element={<Careers apply />} />
        <Route path="/portal" element={<CandidatePortal />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/candidates/:id" element={<PersonProfile />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/crm" element={<TalentCRM />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/communications" element={<Communications />} />
        <Route path="/attrition" element={<Attrition />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
