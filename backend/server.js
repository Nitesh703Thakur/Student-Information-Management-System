import cors from 'cors'
import express from 'express'
import database, { initializeDatabase, serializeStudent, studentQuery } from './database.js'
import { seedDatabaseFromJSON } from './seed.js'

const app = express()
const port = Number(process.env.PORT) || 8000
const statuses = new Set(['active', 'inactive', 'graduated'])
const genders = new Set(['', 'male', 'female', 'other'])

app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json())

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

function validationError(res, errors) {
  return res.status(400).json(errors)
}

async function getStudentPayload(body, existing = {}) {
  const payload = { ...existing, ...body }
  const errors = {}
  const requiredFields = ['student_id', 'first_name', 'last_name', 'email', 'department', 'enrollment_year']

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '') {
      errors[field] = ['This field is required.']
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = ['Enter a valid email address.']
  }
  if (payload.status && !statuses.has(payload.status)) {
    errors.status = ['Select a valid status.']
  }
  if (payload.gender && !genders.has(payload.gender)) {
    errors.gender = ['Select a valid gender.']
  }

  const departmentId = Number(payload.department)
  const semester = Number(payload.semester ?? 1)
  const enrollmentYear = Number(payload.enrollment_year)
  const gpa = Number(payload.gpa ?? 0)
  if (payload.department) {
    if (!Number.isInteger(departmentId)) {
      errors.department = ['Select a valid department.']
    } else {
      const [departments] = await database.execute('SELECT id FROM students_department WHERE id = ?', [departmentId])
      if (!departments.length) errors.department = ['Select a valid department.']
    }
  }
  if (!Number.isInteger(semester) || semester < 1 || semester > 32767) {
    errors.semester = ['Ensure this value is between 1 and 32767.']
  }
  if (!Number.isInteger(enrollmentYear) || enrollmentYear < 1 || enrollmentYear > 32767) {
    errors.enrollment_year = ['Enter a valid year.']
  }
  if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4) {
    errors.gpa = ['Ensure this value is between 0 and 4.']
  }
  if (payload.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_of_birth)) {
    errors.date_of_birth = ['Use the YYYY-MM-DD date format.']
  }

  if (Object.keys(errors).length) return { errors }
  return {
    values: {
      student_id: String(payload.student_id).trim(),
      first_name: String(payload.first_name).trim(),
      last_name: String(payload.last_name).trim(),
      email: String(payload.email).trim(),
      phone: payload.phone || '',
      date_of_birth: payload.date_of_birth || null,
      gender: payload.gender || '',
      address: payload.address || '',
      department_id: departmentId,
      semester,
      enrollment_year: enrollmentYear,
      status: payload.status || 'active',
      gpa,
    },
  }
}

function handleUniqueConstraint(error, res) {
  const field = error.message.includes('email') ? 'email' : 'student_id'
  return validationError(res, { [field]: ['A student with this value already exists.'] })
}

app.get('/api/students/', asyncHandler(async (req, res) => {
  const clauses = []
  const values = []
  const search = String(req.query.search || '').trim()

  if (search) {
    const pattern = `%${search}%`
    clauses.push('(first_name LIKE ? OR last_name LIKE ? OR student_id LIKE ? OR email LIKE ?)')
    values.push(pattern, pattern, pattern, pattern)
  }
  if (req.query.department) {
    clauses.push('department_id = ?')
    values.push(req.query.department)
  }
  if (req.query.status) {
    clauses.push('status = ?')
    values.push(req.query.status)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const [students] = await database.execute(`${studentQuery} ${where} ORDER BY first_name, last_name`, values)
  res.json(students.map(serializeStudent))
}))

app.post('/api/students/', asyncHandler(async (req, res) => {
  const { values, errors } = await getStudentPayload(req.body)
  if (errors) return validationError(res, errors)

  try {
    const fields = Object.keys(values)
    const [result] = await database.execute(`
      INSERT INTO students_student (${fields.join(', ')})
      VALUES (${fields.map(() => '?').join(', ')})
    `, fields.map(field => values[field]))
    const [students] = await database.execute(`${studentQuery} WHERE students_student.id = ?`, [result.insertId])
    res.status(201).json(serializeStudent(students[0]))
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return handleUniqueConstraint(error, res)
    throw error
  }
}))

app.get('/api/students/:id/', asyncHandler(async (req, res) => {
  const [students] = await database.execute(`${studentQuery} WHERE students_student.id = ?`, [req.params.id])
  if (!students.length) return res.status(404).json({ detail: 'Student not found.' })
  res.json(serializeStudent(students[0]))
}))

app.put('/api/students/:id/', asyncHandler(async (req, res) => {
  const [records] = await database.execute(
    'SELECT *, department_id AS department FROM students_student WHERE id = ?',
    [req.params.id],
  )
  if (!records.length) return res.status(404).json({ detail: 'Student not found.' })

  const { values, errors } = await getStudentPayload(req.body, records[0])
  if (errors) return validationError(res, errors)
  try {
    const fields = Object.keys(values)
    await database.execute(`
      UPDATE students_student SET ${fields.map(field => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP(6)
      WHERE id = ?
    `, [...fields.map(field => values[field]), req.params.id])
    const [students] = await database.execute(`${studentQuery} WHERE students_student.id = ?`, [req.params.id])
    res.json(serializeStudent(students[0]))
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return handleUniqueConstraint(error, res)
    throw error
  }
}))

app.delete('/api/students/:id/', asyncHandler(async (req, res) => {
  const [result] = await database.execute('DELETE FROM students_student WHERE id = ?', [req.params.id])
  if (!result.affectedRows) return res.status(404).json({ detail: 'Student not found.' })
  res.status(204).end()
}))

app.get('/api/departments/', asyncHandler(async (req, res) => {
  const [departments] = await database.execute(`
    SELECT students_department.*, COUNT(students_student.id) AS student_count
    FROM students_department
    LEFT JOIN students_student ON students_student.department_id = students_department.id
    GROUP BY students_department.id
    ORDER BY students_department.name
  `)
  res.json(departments)
}))

app.post('/api/departments/', asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim()
  const code = String(req.body.code || '').trim()
  const description = String(req.body.description || '')
  const errors = {}
  if (!name) errors.name = ['This field is required.']
  if (!code) errors.code = ['This field is required.']
  if (Object.keys(errors).length) return validationError(res, errors)

  try {
    const [result] = await database.execute(`
      INSERT INTO students_department (name, code, description) VALUES (?, ?, ?)
    `, [name, code, description])
    res.status(201).json({ id: result.insertId, name, code, description, student_count: 0 })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('name')) {
      return validationError(res, { name: ['A department with this name already exists.'] })
    }
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('code')) {
      return validationError(res, { code: ['A department with this code already exists.'] })
    }
    throw error
  }
}))

app.get('/api/dashboard/', asyncHandler(async (req, res) => {
  const [[stats]] = await database.execute(`
    SELECT COUNT(*) AS total_students,
      COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active_students,
      COALESCE(SUM(CASE WHEN status = 'graduated' THEN 1 ELSE 0 END), 0) AS graduated_students,
      COALESCE(SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END), 0) AS inactive_students,
      COALESCE(ROUND(AVG(gpa), 2), 0) AS average_gpa
    FROM students_student
  `)
  const [[{ count: departments }]] = await database.execute('SELECT COUNT(*) AS count FROM students_department')
  const [recentStudents] = await database.execute(`${studentQuery} ORDER BY created_at DESC LIMIT 5`)
  res.json({ ...stats, departments, recent_students: recentStudents.map(serializeStudent) })
}))

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ detail: 'An unexpected server error occurred.' })
})

async function start() {
  await initializeDatabase()
  try {
    const [rows] = await database.execute('SELECT COUNT(*) AS count FROM students_department')
    if (rows[0].count === 0) {
      console.log('No departments found in MySQL. Automatically seeding initial data...')
      await seedDatabaseFromJSON()
    }
  } catch (err) {
    console.warn('Could not check/auto-seed demo data:', err.message)
  }

  app.listen(port, () => {
    console.log(`Student API listening on http://127.0.0.1:${port}`)
  })
}

start().catch(error => {
  console.error('Could not connect to MySQL or initialize its schema:', error.message)
  process.exitCode = 1
})