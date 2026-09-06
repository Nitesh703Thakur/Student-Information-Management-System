export default function StatusBadge({ status }) {
  const styles = { active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', inactive: 'bg-amber-50 text-amber-700 ring-amber-600/10', graduated: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[status] || 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>{status}</span>
}
