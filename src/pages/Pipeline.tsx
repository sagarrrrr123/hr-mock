import React, { useState } from 'react'
import { useStore } from '../data/store'
import { PageHead, Select, Card } from '../components/ui'
import Kanban from '../components/Kanban'

export default function Pipeline() {
  const { candidates, jobs } = useStore()
  const [jobId, setJobId] = useState('all')
  const filtered = jobId === 'all' ? candidates : candidates.filter(c => c.jobId === jobId)

  return (
    <div>
      <PageHead title="Pipeline" subtitle="Drag candidates across stages — moving to Interview or Offer triggers the next step"
        actions={
          <div className="w-56"><Select value={jobId} onChange={e => setJobId(e.target.value)}>
            <option value="all">All jobs</option>
            {jobs.filter(j => j.status === 'Published').map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </Select></div>
        } />
      <Card className="p-3"><Kanban candidates={filtered} /></Card>
    </div>
  )
}
