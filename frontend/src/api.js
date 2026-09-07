import axios from 'axios'
import demoData from './data/demoData.json'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api' })

const fallback = (data) => Promise.resolve({ data })
const readDemoStudents = (params = {}) => {
	const search = String(params.search || '').toLowerCase()
	return demoData.students.filter(student => {
		const matchesSearch = !search || [student.full_name, student.student_id, student.email].some(value => value.toLowerCase().includes(search))
		const matchesStatus = !params.status || student.status === params.status
		const matchesDepartment = !params.department || String(student.department) === String(params.department)
		return matchesSearch && matchesStatus && matchesDepartment
	})
}
const readDemoDashboard = () => {
	const students = demoData.students
	const activeStudents = students.filter(student => student.status === 'active').length
	const graduatedStudents = students.filter(student => student.status === 'graduated').length
	const inactiveStudents = students.filter(student => student.status === 'inactive').length
	const averageGpa = students.reduce((total, student) => total + student.gpa, 0) / students.length
	return {
		total_students: students.length,
		active_students: activeStudents,
		graduated_students: graduatedStudents,
		inactive_students: inactiveStudents,
		average_gpa: averageGpa,
		departments: demoData.departments.length,
		recent_students: students.slice(0, 4),
	}
}

export const getStudents = (params = {}) => api.get('/students/', { params }).catch(() => fallback(readDemoStudents(params)))
export const getStudent = (id) => api.get(`/students/${id}/`).catch(() => fallback(demoData.students.find(student => String(student.id) === String(id))))
export const createStudent = (data) => api.post('/students/', data)
export const updateStudent = (id, data) => api.put(`/students/${id}/`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}/`)
export const getDepartments = () => api.get('/departments/').catch(() => fallback(demoData.departments))
export const createDepartment = (data) => api.post('/departments/', data)
export const getDashboard = () => api.get('/dashboard/').catch(() => fallback(readDemoDashboard()))
