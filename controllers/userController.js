import pool from "../database/db.js"

const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM user")
        if (rows.length) {
            res.status(200).send(rows)
            return
        }
        res.status(404).send({ error: "No users found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.message)
    }
}

const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const [row] = await pool.query(
            `
        SELECT * 
        FROM user 
        WHERE id = ?
        `,
            [id]
        )
        if (row[0]) {
            res.status(200).send(row[0])
            return
        }
        res.status(404).send({ error: "User not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const validateUser = async (req, res) => {
    const { username, password } = req.body
    try {
        const [row] = await pool.query(
            `
        SELECT * 
        FROM user 
        WHERE username = ? AND password = MD5(?)
        `,
            [username, password]
        )
        if (row[0]) {
            res.status(200).send(row[0])
            return
        }
        res.status(404).send({ error: "Invalid username or password" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, username, password, createdBy } = req.body
    try {
        const [row] = await pool.query(
            `
            SELECT *
            FROM user
            WHERE username = ?
        `,
            [username]
        )
        if (row[0]) {
            res.status(409).send({ error: "Username already exists" })
            return
        }
        const [result] = await pool.query(
            `
        INSERT INTO user (first_name, last_name, username, password, created_by)
        VALUES (?, ?, ?, MD5(?), ?)
        `,
            [firstName, lastName, username, password, createdBy]
        )
        res.status(201).send(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params
    const { firstName, lastName, username, password, updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
        UPDATE user
        SET first_name = ?, last_name = ?, username = ?, password = MD5(?), updated_by = ?
        WHERE id = ?
    `,
            [firstName, lastName, username, password, updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ message: "User updated successfully" })
            return
        }
        res.status(404).send({ error: "User not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

const updateUserStatus = async (req, res) => {
    const { id } = req.params
    const { updatedBy } = req.body
    try {
        const [result] = await pool.query(
            `
        UPDATE user
        SET Active = !Active, updated_by = ?
        WHERE id = ?
    `,
            [updatedBy, id]
        )
        if (result.affectedRows) {
            res.status(200).send({ message: "User status updated successfully" })
            return
        }
        res.status(404).send({ error: "User not found" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.error(error.stack)
    }
}

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    validateUser,
    updateUserStatus,
}
