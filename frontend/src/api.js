import axios from 'axios'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api' })

export const getStudents = (params = {}) => api.get('/students/', { params })
export const getStudent = (id) => api.get(`/students/${id}/`)
export const createStudent = (data) => api.post('/students/', data)
export const updateStudent = (id, data) => api.put(`/students/${id}/`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}/`)
export const getDepartments = () => api.get('/departments/')
export const createDepartment = (data) => api.post('/departments/', data)
export const getDashboard = () => api.get('/dashboard/')
