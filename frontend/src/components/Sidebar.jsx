import { NavLink } from 'react-router-dom'
import { BarChart3, GraduationCap, LayoutDashboard, Users, Building2, Settings, X } from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
]

export default function Sidebar({ open, onClose }) {
  return <>
    {open && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} />}
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-950 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20"><GraduationCap size={24} /></div>
            <div><p className="text-base font-extrabold tracking-tight">Student Information Management System</p><p className="text-[11px] text-slate-400">Student Information System</p></div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"><X size={19} /></button>
        </div>
        <div className="px-4"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p>
          <nav className="space-y-1">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={19} />{label}</NavLink>)}</nav>
        </div>
        <div className="mx-6 mt-8 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-3 flex items-center gap-2 text-slate-300"><BarChart3 size={17}/><span className="text-xs font-semibold">Academic year</span></div><p className="text-2xl font-bold">2026 / 27</p><p className="mt-1 text-xs text-slate-500">System is up to date</p></div>
        <div className="mt-auto p-4"><button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"><Settings size={19}/>Settings</button><div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/5 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500 font-bold">AD</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Admin User</p><p className="truncate text-xs text-slate-500">Administrator</p></div></div></div>
      </div>
    </aside>
  </>
}
