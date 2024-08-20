import pool from "../database/db.js"

const getCourses = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM course ORDER BY name")
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
            res.status(200).send({ status: 200, course: row[0] })
            return
        }
        res.status(404).send({ status: 400, error: "Course not found" })
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
        availableAt,
        mark,
        presenter,
        presentedBy,
        attendance,
        sessions,
        createdBy,
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
            res.status(409).send({ status: 409, error: "Course already exists" })
            return
        }

        const [result] = await pool.query(
            `
            INSERT INTO course (name, length, price, language, available_at, mark, presenter, presented_by, attendance, sessions, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [name, length, price, language, availableAt, mark, presenter, presentedBy, attendance, sessions, createdBy]
        )
        res.status(201).send({ status: 201, result })
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
        availableAt,
        mark,
        presenter,
        presentedBy,
        attendance,
        sessions,
        updatedBy,
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
                availableAt,
                mark,
                presenter,
                presentedBy,
                attendance,
                sessions,
                updatedBy,
                id,
            ]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Course updated successfully" })
            return
        }
        res.status(404).send({ status: 400, error: "Course not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateCourseStatus = async (req, res) => {
    const { id } = req.params
    const { updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
        UPDATE course
        SET Active = !Active, updated_by = ?
        WHERE id = ?
    `,
            [updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ status: 200, message: "Course status updated successfully" })
            return
        }
        res.status(404).send({ status: 404, error: "Course not found" })
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
    updateCourseStatus,
}
