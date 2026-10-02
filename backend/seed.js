import { fileURLToPath } from 'node:url'
import database, { initializeDatabase } from './database.js'

export const initialDepartments = [
  {
    id: 1,
    name: 'Computer Science',
    code: 'CS',
    description: 'Software engineering, systems and computing studies.',
  },
  {
    id: 2,
    name: 'Business Administration',
    code: 'BBA',
    description: 'Management, finance and entrepreneurship studies.',
  },
  {
    id: 3,
    name: 'Information Technology',
    code: 'IT',
    description: 'Applied information technology and digital systems.',
  },
]

export const initialStudents = [
  {
    id: 1,
    student_id: 'STU-2026-001',
    first_name: 'Aarav',
    last_name: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+977 9800000001',
    date_of_birth: '2004-03-18',
    gender: 'male',
    address: 'Kathmandu, Nepal',
    department_id: 1,
    semester: 6,
    enrollment_year: 2023,
    status: 'active',
    gpa: 3.82,
  },
  {
    id: 2,
    student_id: 'STU-2026-002',
    first_name: 'Saanvi',
    last_name: 'Thapa',
    email: 'saanvi.thapa@example.com',
    phone: '+977 9800000002',
    date_of_birth: '2003-11-07',
    gender: 'female',
    address: 'Pokhara, Nepal',
    department_id: 2,
    semester: 8,
    enrollment_year: 2022,
    status: 'graduated',
    gpa: 3.58,
  },
  {
    id: 3,
    student_id: 'STU-2026-003',
    first_name: 'Nischal',
    last_name: 'Gurung',
    email: 'nischal.gurung@example.com',
    phone: '+977 9800000003',
    date_of_birth: '2005-01-26',
    gender: 'male',
    address: 'Lalitpur, Nepal',
    department_id: 3,
    semester: 4,
    enrollment_year: 2024,
    status: 'active',
    gpa: 3.41,
  },
  {
    id: 4,
    student_id: 'STU-2026-004',
    first_name: 'Anisha',
    last_name: 'Karki',
    email: 'anisha.karki@example.com',
    phone: '+977 9800000004',
    date_of_birth: '2004-08-12',
    gender: 'female',
    address: 'Bhaktapur, Nepal',
    department_id: 1,
    semester: 5,
    enrollment_year: 2023,
    status: 'inactive',
    gpa: 3.12,
  },
]

export async function seedDatabase() {
  await initializeDatabase()
  const connection = await database.getConnection()

  try {
    await connection.beginTransaction()

    for (const d of initialDepartments) {
      await connection.execute(`
        INSERT INTO students_department (id, name, code, description)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          code = VALUES(code),
          description = VALUES(description)
      `, [d.id, d.name, d.code, d.description || ''])
    }

    for (const s of initialStudents) {
      await connection.execute(`
        INSERT INTO students_student (
          id, student_id, first_name, last_name, email, phone,
          date_of_birth, gender, address, semester, enrollment_year,
          status, gpa, department_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          student_id = VALUES(student_id),
          first_name = VALUES(first_name),
          last_name = VALUES(last_name),
          email = VALUES(email),
          phone = VALUES(phone),
          date_of_birth = VALUES(date_of_birth),
          gender = VALUES(gender),
          address = VALUES(address),
          semester = VALUES(semester),
          enrollment_year = VALUES(enrollment_year),
          status = VALUES(status),
          gpa = VALUES(gpa),
          department_id = VALUES(department_id),
          updated_at = CURRENT_TIMESTAMP(6)
      `, [
        s.id,
        s.student_id,
        s.first_name,
        s.last_name,
        s.email,
        s.phone || '',
        s.date_of_birth || null,
        s.gender || '',
        s.address || '',
        s.semester ?? 1,
        s.enrollment_year,
        s.status || 'active',
        s.gpa ?? 0,
        s.department_id,
      ])
    }

    await connection.commit()
    console.log(`Database successfully seeded with ${initialDepartments.length} departments and ${initialStudents.length} students.`)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Backward compatibility alias
export const seedDatabaseFromJSON = seedDatabase

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => database.end())
    .catch(error => {
      console.error('Could not seed database:', error.message)
      process.exitCode = 1
    })
}