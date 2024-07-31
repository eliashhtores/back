import pool from "../database/db.js"

const getSessionsByCourse = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.query(
            `
        SELECT * FROM course_session cs
        JOIN course c ON c.id = cs.course_id
        WHERE course_id = ?
        `,
            [id]
        )
        if (rows.length) {
            res.status(200).send(rows)
            return
        }
        res.status(404).send({ error: "No sessions found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const getSession = async (req, res) => {
    const { id } = req.params
    try {
        const [row] = await pool.query(
            `
        SELECT * 
        FROM course_session 
        WHERE id = ?
        `,
            [id]
        )
        if (row[0]) {
            res.status(200).send(row[0])
            return
        }
        res.status(404).send({ error: "Session not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const createSession = async (req, res) => {
    const { course_id, number, url, created_by } = req.body
    try {
        const [row] = await pool.query(
            `
            SELECT *
            FROM course_session cs
            JOIN course c ON c.id = cs.course_id
            WHERE course_id = ?
                AND number = ?;
        `,
            [course_id, number]
        )
        if (row[0]) {
            res.status(409).send({ error: "Session number already exists" })
            return
        }
        const [result] = await pool.query(
            `
        INSERT INTO course_session (course_id, number, url, created_by)
        VALUES (?, ?, ?, ?)
        `,
            [course_id, number, url, created_by]
        )
        res.status(201).send(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateSession = async (req, res) => {
    const { id } = req.params
    const { url, updated_by } = req.body
    try {
        const [result] = await pool.query(
            `
        UPDATE course_session
        SET url = ?, updated_by = ?
        WHERE id = ?
    `,
            [url, updated_by, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ message: "Session updated successfully" })
            return
        }
        res.status(404).send({ error: "Session not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

export default {
    getSessionsByCourse,
    getSession,
    createSession,
    updateSession,
}
