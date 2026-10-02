import { DatabaseSync } from 'node:sqlite'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import database, { initializeDatabase } from './database.js'

const backendDirectory = path.dirname(fileURLToPath(import.meta.url))
const sqlitePath = path.join(backendDirectory, 'db.sqlite3')

async function migrate() {
  if (!existsSync(sqlitePath)) {
    throw new Error(`SQLite database was not found at ${sqlitePath}`)
  }

  const sqlite = new DatabaseSync(sqlitePath)
  const departments = sqlite.prepare('SELECT id, name, code, description FROM students_department').all()
  const students = sqlite.prepare('SELECT * FROM students_student').all()
  sqlite.close()

  await initializeDatabase()
  const connection = await database.getConnection()
  try {
    await connection.beginTransaction()
    for (const department of departments) {
      await connection.execute(`
        INSERT INTO students_department (id, name, code, description)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name), code = VALUES(code), description = VALUES(description)
      `, [department.id, department.name, department.code, department.description])
    }

    for (const student of students) {
      await connection.execute(`
        INSERT INTO students_student (
          id, student_id, first_name, last_name, email, phone, date_of_birth,
          gender, address, semester, enrollment_year, status, gpa, created_at,
          updated_at, department_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          created_at = VALUES(created_at),
          updated_at = VALUES(updated_at),
          department_id = VALUES(department_id)
      `, [
        student.id,
        student.student_id,
        student.first_name,
        student.last_name,
        student.email,
        student.phone,
        student.date_of_birth,
        student.gender,
        student.address,
        student.semester,
        student.enrollment_year,
        student.status,
        student.gpa,
        student.created_at,
        student.updated_at,
        student.department_id,
      ])
    }
    await connection.commit()
    console.log(`Imported ${departments.length} departments and ${students.length} students from SQLite.`)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
    await database.end()
  }
}

migrate().catch(error => {
  console.error('Could not import the SQLite database:', error.message)
  process.exitCode = 1
})