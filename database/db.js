import mysql2 from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql2
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    })
    .promise()

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user")
    return rows
}

export async function getUser(id) {
    const [row] = await pool.query(
        `
    SELECT * 
    FROM user 
    WHERE id = ?
    `,
        [id]
    )
    return row[0]
}

export async function createUser(first_name, last_name, username, password, created_by) {
    const [result] = await pool.query(
        `
    INSERT INTO user (first_name, last_name, username, password, created_by) 
    VALUES (?, ?, ?, PASSWORD(?), ?)    
    `,
        [first_name, last_name, username, password, created_by]
    )
    return getUser(result.insertId)
}
