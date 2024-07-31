import pool from "../database/db.js"

const getCourses = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM course")
        if (rows.length) {
            res.status(200).send(rows)
            return
        }
        res.status(404).send({ error: "No courses found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const getCourse = async (req, res) => {
    const { id } = req.params
    try {
        const [row] = await pool.query(
            `
        SELECT * 
        FROM course
        WHERE id = ?
        `,
            [id]
        )
        if (row[0]) {
            res.status(200).send(row[0])
            return
        }
        res.status(404).send({ error: "Course not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const createCourse = async (req, res) => {
    const {
        name,
        length,
        price,
        language,
        available_at,
        mark,
        presenter,
        presented_by,
        attendance,
        sessions,
        created_by,
    } = req.body
    try {
        const [row] = await pool.query(
            `
            SELECT *
            FROM course
            WHERE name = ?
        `,
            [name]
        )
        if (row[0]) {
            res.status(409).send({ error: "Course already exists" })
            return
        }

        const [result] = await pool.query(
            `
            INSERT INTO course (name, length, price, language, available_at, mark, presenter, presented_by, attendance, sessions, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                name,
                length,
                price,
                language,
                available_at,
                mark,
                presenter,
                presented_by,
                attendance,
                sessions,
                created_by,
            ]
        )
        res.status(201).send(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateCourse = async (req, res) => {
    const { id } = req.params
    const {
        name,
        length,
        price,
        language,
        available_at,
        mark,
        presenter,
        presented_by,
        attendance,
        sessions,
        updated_by,
    } = req.body
    try {
        const [result] = await pool.query(
            `
        UPDATE course
        SET name = ?, length = ?, price = ?, language = ?, available_at = ?, mark = ?, presenter = ?, presented_by = ?, attendance = ?, sessions = ?, updated_by = ?
        WHERE id = ?
    `,
            [
                name,
                length,
                price,
                language,
                available_at,
                mark,
                presenter,
                presented_by,
                attendance,
                sessions,
                updated_by,
                id,
            ]
        )
        if (result.affectedRows) {
            res.status(200).send({ message: "Course updated successfully" })
            return
        }
        res.status(404).send({ error: "Course not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

export default {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
}
