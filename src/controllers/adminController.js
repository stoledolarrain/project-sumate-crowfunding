const db = require('../dbConnection/connection');

exports.listarAdmins = async (req, res) => {
    const sql = "SELECT id, nombre_completo, email, fecha_registro FROM usuarios WHERE rol = 'admin'";
    
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener administradores" });
    }
};

exports.crearAdmin = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO usuarios (nombre_completo, email, password, rol, es_valido) VALUES (?, ?, ?, 'admin', 1)";

    try {
        await db.query(sql, [nombre, email, password]);
        res.json({ message: "Administrador creado exitosamente" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "El correo ya existe" });
        }
        console.error(err);
        res.status(500).json({ message: "Error al crear administrador" });
    }
};

exports.editarAdmin = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    let sql = "UPDATE usuarios SET nombre_completo = ?, email = ? WHERE id = ?";
    let params = [nombre, email, id];

    if (password && password.trim() !== "") {
        sql = "UPDATE usuarios SET nombre_completo = ?, email = ?, password = ? WHERE id = ?";
        params = [nombre, email, password, id];
    }

    try {
        await db.query(sql, params);
        res.json({ message: "Administrador actualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al actualizar administrador" });
    }
};

exports.eliminarAdmin = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ? AND rol = 'admin'";

    try {
        await db.query(sql, [id]);
        res.json({ message: "Administrador eliminado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al eliminar administrador" });
    }
};