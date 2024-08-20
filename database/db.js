import mysql2 from "mysql2"
import dotenv from "dotenv"

dotenv.config()

let pool

try {
    pool = mysql2
        .createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            // debug: true,
            dateStrings: true,
        })
        .promise()
    ;(async () => {
        try {
            await pool.getConnection()
            console.log(`Connected to database ${process.env.MYSQL_DATABASE}...`)
        } catch (connectionError) {
            console.error("Failed to connect to the database:", connectionError)
            process.exit(1)
        }
    })()
} catch (error) {
    console.error("Failed to create the database pool:", error)
    process.exit(1)
}

export default pool
