import pool from "../database/db.js"

const getSessionsByCourse = async (req, res) => {
    const { id } = req.params
    try {
        const [rows] = await pool.query(
            `
            SELECT * FROM course_session cs
            JOIN course c ON c.id = cs.course_id
            WHERE course_id = ?
                AND cs.active
        `,
            [id]
        )
        const response = {
            data: rows,
            recordsTotal: rows.length,
            recordsFiltered: rows.length,
        }
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.message)
    }
}

const getSessions = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT cs.id AS id, name, number, url, cs.active AS active, cs.created_at AS created_at 
            FROM course_session cs
            JOIN course c ON c.id = cs.course_id
            ORDER BY name, number;
        `
        )
        const response = {
            data: rows,
            recordsTotal: rows.length,
            recordsFiltered: rows.length,
        }
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.message)
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
            res.status(200).send({ status: 200, session: row[0] })
            return
        }
        res.status(404).send({ status: 404, error: "Session not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const createSession = async (req, res) => {
    const { courseID, number, url, createdBy } = req.body
    try {
        const [row] = await pool.query(
            `
            SELECT *
            FROM course_session cs
            JOIN course c ON c.id = cs.course_id
            WHERE course_id = ?
                AND number = ?
                AND cs.active
        `,
            [courseID, number]
        )
        if (row[0]) {
            res.status(409).send({ status: 409, error: "Session number for this course already exists" })
            return
        }

        const [count] = await pool.query(
            `
            SELECT IF(COUNT(*) >= c.sessions, TRUE, FALSE) AS result
            FROM course_session cs
            JOIN course c ON c.id = cs.course_id
            WHERE cs.course_id = ?
                AND c.active
                AND cs.active
        `,
            [courseID]
        )
        if (count[0].result) {
            res.status(400).send({ status: 400, error: "Course can't have any more sessions" })
            return
        }

        const [result] = await pool.query(
            `
            INSERT INTO course_session (course_id, number, url, created_by)
            VALUES (?, ?, ?, ?)
        `,
            [courseID, number, url, createdBy]
        )
        res.status(201).send({ status: 201, result })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateSession = async (req, res) => {
    const { id } = req.params
    const { courseID, url, updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
            UPDATE course_session
            SET course_id = ?, url = ?, updated_by = ?
            WHERE id = ?
        `,
            [courseID, url, updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Session updated successfully" })
            return
        }
        res.status(404).send({ status: 404, error: "Session not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateSessionStatus = async (req, res) => {
    const { id } = req.params
    const { updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
            UPDATE course_session
            SET Active = !Active, updated_by = ?
            WHERE id = ?
        `,
            [updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Session status updated successfully" })
            return
        }
        res.status(404).send({ status: 404, error: "Session not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

export default {
    getSessionsByCourse,
    getSession,
    getSessions,
    createSession,
    updateSession,
    updateSessionStatus,
}
