import pool from "../database/db.js"

const getRegistrations = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM registration")
        const response = {
            data: rows,
            recordsTotal: rows.length,
            recordsFiltered: rows.length,
        }
        res.status(200).send(response)
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
        console.error(error.message)
    }
}

const getRegistration = async (req, res) => {
    const { id } = req.params
    try {
        const [row] = await pool.query(
            `
            SELECT * 
            FROM registration 
            WHERE id = ?
        `,
            [id]
        )
        if (row[0]) {
            res.status(200).send(row[0])
            return
        }
        res.status(404).send({ status: 400, error: "Registration not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const getRegistrationByUser = async (req, res) => {
    const { userID } = req.params
    try {
        const [row] = await pool.query(
            `
            SELECT r.id AS id, name, COALESCE(time_spent, '') AS time_spent, IF(r.active=1, "Sí", "No") AS active, r.created_at AS created_at
            FROM registration r
            JOIN course c ON c.id = r.course_id
            WHERE user_id = ?
            ORDER BY id DESC
        `,
            [userID]
        )
        if (row) {
            res.status(200).send(row)
            return
        }
        res.status(404).send({ status: 400, error: "Registration not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const createRegistration = async (req, res) => {
    const { userID, courseID, createdBy } = req.body
    try {
        const [row] = await pool.query(
            `
            SELECT *
            FROM registration
            WHERE user_id = ?
                AND course_id = ?
                AND active
        `,
            [userID, courseID]
        )
        if (row[0]) {
            res.status(409).send({ status: 409, error: "User already enrolled in this course" })
            return
        }
        const [result] = await pool.query(
            `
            INSERT INTO registration (user_id, course_id, created_by) 
            VALUES (?, ?, ?)
        `,
            [userID, courseID, createdBy]
        )
        res.status(201).send({ status: 201, result })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateRegistration = async (req, res) => {
    const { id } = req.params
    const { timeSpent, updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
            UPDATE registration
            SET time_spent = ?, updated_by = ?
            WHERE id = ?
        `,
            [timeSpent, updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Registration updated successfully" })
            return
        }
        res.status(404).send({ status: 400, error: "Registration not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateRegistrationStatus = async (req, res) => {
    const { id } = req.params
    const { updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
            UPDATE registration
            SET active = !active, updated_by = ?
            WHERE id = ?
        `,
            [updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Registration status updated successfully" })
            return
        }
        res.status(404).send({ error: "Registration not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

export default {
    getRegistrations,
    getRegistration,
    createRegistration,
    updateRegistration,
    updateRegistrationStatus,
    getRegistrationByUser,
}
