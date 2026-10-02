import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, SlidersHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react'
import { deleteStudent, getDepartments, getStudents } from '../api'
import StatusBadge from '../components/StatusBadge'

const PAGE_SIZE = 8

export default function Students() {
  const [params, setParams] = useSearchParams()
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  const search = params.get('search') || ''
  const status = params.get('status') || ''
  const department = params.get('department') || ''

  const load = () => {
    setLoading(true)
    setError('')
    getStudents({ search, status, department })
      .then(r => {
        setStudents(r.data || [])
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load students from the server. Please check your backend connection.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getDepartments()
      .then(r => setDepartments(r.data || []))
      .catch(err => console.error('Failed to load departments', err))
  }, [])

  useEffect(() => {
    setPage(1)
    load()
  }, [search, status, department])

  const setFilter = (key, value) => {
    const p = new URLSearchParams(params)
    if (value) {
      p.set(key, value)
    } else {
      p.delete(key)
    }
    setParams(p)
  }

  const remove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name || 'this student'}?`)) return
    try {
      await deleteStudent(id)
      load()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete student.')
    }
  }

  // Client-side pagination
  const totalStudents = students.length
  const totalPages = Math.max(1, Math.ceil(totalStudents / PAGE_SIZE))
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return students.slice(start, start + PAGE_SIZE)
  }, [students, page])

  const startRecord = totalStudents > 0 ? (page - 1) * PAGE_SIZE + 1 : 0
  const endRecord = Math.min(page * PAGE_SIZE, totalStudents)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Student Directory</h2>
          <p className="text-sm text-slate-500">{totalStudents} student records found</p>
        </div>
        <Link to="/students/new" className="btn-primary">
          <Plus size={18} /> Add student
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
          <button onClick={load} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700">
            Retry
          </button>
        </div>
      )}

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={17} />
            <input
              value={search}
              onChange={e => setFilter('search', e.target.value)}
              placeholder="Search by name, student ID or email…"
              className="input pl-10"
            />
          </div>
          <select
            value={department}
            onChange={e => setFilter('department', e.target.value)}
            className="input lg:w-56"
          >
            <option value="">All departments</option>
            {departments.map(d => (
              <option value={d.id} key={d.id}>
                {d.code} — {d.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setFilter('status', e.target.value)}
            className="input lg:w-44"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
          {(search || status || department) && (
            <button className="btn-secondary" onClick={() => setParams({})}>
              <X size={16} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Semester</th>
                <th className="px-5 py-3.5 font-semibold">GPA</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-slate-500">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <p className="mt-2 text-sm">Loading students from MySQL…</p>
                  </td>
                </tr>
              ) : paginatedStudents.length ? (
                paginatedStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                          {s.first_name?.[0]}{s.last_name?.[0]}
                        </div>
                        <div className="min-w-0">
                          <Link className="font-semibold text-slate-900 hover:text-indigo-600 truncate block" to={`/students/${s.id}`}>
                            {s.full_name || `${s.first_name} ${s.last_name}`}
                          </Link>
                          <p className="mt-0.5 text-xs text-slate-500 truncate">
                            {s.student_id} · {s.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-800">{s.department_code}</span>
                      <p className="text-xs text-slate-500">{s.department_name}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium">Semester {s.semester}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{Number(s.gpa).toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/students/${s.id}`}
                          title="View Profile"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                        >
                          <Eye size={17} />
                        </Link>
                        <Link
                          to={`/students/${s.id}/edit`}
                          title="Edit Student"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                        >
                          <Pencil size={17} />
                        </Link>
                        <button
                          onClick={() => remove(s.id, s.full_name)}
                          title="Delete Record"
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="mx-auto max-w-sm">
                      <SlidersHorizontal className="mx-auto text-slate-300" size={32} />
                      <p className="mt-3 font-semibold text-slate-900">No students found</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {search || status || department
                          ? 'Try clearing or changing your filters.'
                          : 'No student records in the database. Click "Add student" above to create one.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Functional Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
          <span>
            {totalStudents > 0
              ? `Showing ${startRecord} to ${endRecord} of ${totalStudents} students`
              : '0 students'}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
