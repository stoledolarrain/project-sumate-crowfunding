const db = require("../dbConnection/connection");

exports.toggleFavorito = async (req, res) => {
  const { usuario_id, proyecto_id } = req.body;

  try {
    const checkSql =
      "SELECT * FROM favoritos WHERE usuario_id = ? AND proyecto_id = ?";
    const [results] = await db.query(checkSql, [usuario_id, proyecto_id]);

    if (results.length > 0) {
      const deleteSql = "DELETE FROM favoritos WHERE id = ?";
      await db.query(deleteSql, [results[0].id]);
      res.json({ message: "Eliminado de favoritos", esFavorito: false });
    } else {
      const insertSql =
        "INSERT INTO favoritos (usuario_id, proyecto_id) VALUES (?, ?)";
      await db.query(insertSql, [usuario_id, proyecto_id]);
      res.json({ message: "Agregado a favoritos", esFavorito: true });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al procesar favorito", error: err.message });
  }
};

exports.verificarFavorito = async (req, res) => {
  const { usuario_id, proyecto_id } = req.params;
  const sql =
    "SELECT * FROM favoritos WHERE usuario_id = ? AND proyecto_id = ?";

  try {
    const [results] = await db.query(sql, [usuario_id, proyecto_id]);
    res.json({ esFavorito: results.length > 0 });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al verificar favorito", error: err.message });
  }
};

exports.misFavoritos = async (req, res) => {
  const { usuario_id } = req.params;
  const sql = `
        SELECT p.* FROM proyectos p
        JOIN favoritos f ON p.id = f.proyecto_id
        WHERE f.usuario_id = ?
    `;

  try {
    const [results] = await db.query(sql, [usuario_id]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error al listar favoritos", error: err.message });
  }
};
