import { useEffect, useState } from 'react'
import { Building2, Plus, X, AlertCircle } from 'lucide-react'
import { createDepartment, getDepartments } from '../api'

export default function Departments() {
  const [deps, setDeps] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', description: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getDepartments()
      .then(r => setDeps(r.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const save = async e => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createDepartment({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim(),
      })
      setForm({ name: '', code: '', description: '' })
      setOpen(false)
      load()
    } catch (err) {
      const msg = Object.values(err.response?.data || {}).flat().join(' ')
      setError(msg || 'Could not create department. Ensure code and name are unique.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Academic Departments</h2>
          <p className="text-sm text-slate-500">{deps.length} departments currently registered</p>
        </div>
        <button className="btn-primary" onClick={() => { setError(''); setOpen(true) }}>
          <Plus size={18} /> Add department
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading departments from MySQL…</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deps.map(d => (
            <div className="card p-5 hover:border-slate-300 transition" key={d.id}>
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 size={21} />
                </div>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 font-mono">
                  {d.code}
                </span>
              </div>
              <h3 className="mt-5 font-bold text-slate-900 text-base">{d.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-slate-500 line-clamp-2">
                {d.description || 'Academic faculty department'}
              </p>
              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Enrolled students</span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-700 font-bold">
                  {d.student_count} {d.student_count === 1 ? 'student' : 'students'}
                </span>
              </div>
            </div>
          ))}

          {!deps.length && (
            <div className="card col-span-full p-12 text-center text-sm text-slate-500">
              No academic departments registered yet. Click "Add department" to create one.
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm animate-fade-in">
          <form onSubmit={save} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Add Department</h3>
                <p className="text-xs text-slate-500">Create a new academic faculty or department.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="label">Department Name</span>
                <input
                  required
                  placeholder="e.g. Civil Engineering"
                  className="input"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="label">Department Code</span>
                <input
                  required
                  placeholder="e.g. CIVIL"
                  className="input font-mono uppercase"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </label>

              <label className="block">
                <span className="label">Description (Optional)</span>
                <textarea
                  placeholder="Overview of curriculum and academic discipline..."
                  className="input min-h-24 resize-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </label>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                <Plus size={16} /> {saving ? 'Creating…' : 'Create Department'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
