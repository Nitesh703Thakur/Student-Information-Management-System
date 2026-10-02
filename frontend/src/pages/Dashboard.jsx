import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Users, UserCheck, Award, Building2, AlertCircle } from 'lucide-react'
import { getDashboard } from '../api'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = () => {
    setLoading(true)
    setError('')
    getDashboard()
      .then(r => setData(r.data))
      .catch(() => setError('Could not connect to the backend API. Please make sure the backend server is running on http://127.0.0.1:8000.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (error) {
    return (
      <div className="card p-8">
        <div className="flex items-start gap-4 text-rose-600">
          <AlertCircle size={24} className="shrink-0 mt-0.5" />
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Backend Connection Error</h3>
            <p className="text-sm text-slate-600">{error}</p>
            <button
              onClick={loadDashboard}
              className="btn-primary text-xs !py-2 !px-4"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading dashboard metrics from MySQL…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={data.total_students}
          trend="Live"
          note="in database"
          icon={Users}
        />
        <StatCard
          label="Active students"
          value={data.active_students}
          trend="Current"
          note="enrolled students"
          icon={UserCheck}
        />
        <StatCard
          label="Average GPA"
          value={Number(data.average_gpa).toFixed(2)}
          trend="Overall"
          note="academic performance"
          icon={Award}
        />
        <StatCard
          label="Departments"
          value={data.departments}
          trend="Active"
          note="academic faculties"
          icon={Building2}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Recent Students */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-950">Recently added students</h2>
              <p className="mt-1 text-xs text-slate-500">Latest records saved in MySQL</p>
            </div>
            <Link to="/students" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recent_students && data.recent_students.length ? (
              data.recent_students.map(s => (
                <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/60 transition">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {s.first_name?.[0]}{s.last_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <Link to={`/students/${s.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:text-indigo-600">
                        {s.full_name || `${s.first_name} ${s.last_name}`}
                      </Link>
                      <p className="truncate text-xs text-slate-500">
                        {s.student_id} · {s.department_code}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                No student records in the database yet.
              </div>
            )}
          </div>
        </section>

        {/* Academic Status Snapshot */}
        <section className="card p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-950">Academic status breakdown</h2>
              <p className="text-xs text-slate-500">Distribution across enrollment statuses</p>
            </div>
          </div>
          <div className="mt-7 space-y-5">
            <Metric label="Active" value={data.active_students} total={data.total_students} color="bg-emerald-500" />
            <Metric label="Graduated" value={data.graduated_students} total={data.total_students} color="bg-indigo-500" />
            <Metric label="Inactive" value={data.inactive_students} total={data.total_students} color="bg-amber-500" />
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value, total, color = 'bg-indigo-500' }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">
          {value} <span className="font-normal text-slate-400">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
