import 'dotenv/config'
import mysql from 'mysql2/promise'

const dbName = process.env.MYSQL_DATABASE || 'student_information_system'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  decimalNumbers: true,
})

export function serializeStudent(student) {
  return {
    ...student,
    full_name: `${student.first_name} ${student.last_name}`.trim(),
  }
}

export const studentQuery = `
  SELECT students_student.*, students_student.department_id AS department,
    students_department.name AS department_name,
    students_department.code AS department_code
  FROM students_student
  JOIN students_department ON students_department.id = students_student.department_id
`

export async function ensureDatabaseExists() {
  const rootConn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  })
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await rootConn.end()
}

export async function initializeDatabase() {
  await ensureDatabaseExists()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students_department (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL UNIQUE,
      code VARCHAR(20) NOT NULL UNIQUE,
      description TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students_student (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(30) NOT NULL UNIQUE,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      phone VARCHAR(25) NOT NULL DEFAULT '',
      date_of_birth DATE NULL,
      gender VARCHAR(10) NOT NULL DEFAULT '',
      address VARCHAR(255) NOT NULL DEFAULT '',
      semester SMALLINT UNSIGNED NOT NULL DEFAULT 1,
      enrollment_year SMALLINT UNSIGNED NOT NULL,
      status VARCHAR(12) NOT NULL DEFAULT 'active',
      gpa DECIMAL(4, 2) NOT NULL DEFAULT 0,
      created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      department_id INT UNSIGNED NOT NULL,
      CONSTRAINT students_student_department_fk
        FOREIGN KEY (department_id) REFERENCES students_department(id) ON DELETE RESTRICT,
      INDEX students_student_department_idx (department_id),
      INDEX students_student_status_idx (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
}

export default pool