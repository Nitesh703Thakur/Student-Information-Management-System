import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = { '/dashboard': ['Dashboard', 'Overview of your institution'], '/students': ['Students', 'Manage student records and academic information'], '/departments': ['Departments', 'Manage academic departments and programs'] }
export default function Topbar({ onMenu }) {
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] || ['Student profile', 'View and manage student information']
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-xl border border-slate-200 p-2.5 lg:hidden"><Menu size={20}/></button><div><h1 className="text-xl font-extrabold tracking-tight text-slate-950">{title}</h1><p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p></div></div><div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400 md:flex"><Search size={17}/><span>Quick search</span><kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">⌘ K</kbd></div><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"><Bell size={19}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500"/></button></div></div></header>
}
