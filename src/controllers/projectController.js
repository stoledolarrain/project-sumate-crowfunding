const db = require("../dbConnection/connection");

exports.crearProyecto = async (req, res) => {
  const files = req.files;
  const img1 = files && files[0] ? "/uploads/" + files[0].filename : null;
  const img2 = files && files[1] ? "/uploads/" + files[1].filename : null;
  const img3 = files && files[2] ? "/uploads/" + files[2].filename : null;
  const img4 = files && files[3] ? "/uploads/" + files[3].filename : null;

  const { usuario_id, categoria_id, titulo, descripcion, meta, fecha_limite } =
    req.body;

  if (!usuario_id || !titulo || !meta || !fecha_limite) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO proyectos 
    (usuario_id, categoria_id, titulo, descripcion, meta_financiera, fecha_limite, imagen_url, imagen2_url, imagen3_url, imagen4_url, estado_aprobacion, estado_campana)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'borrador', 'no_iniciada')
  `;

  try {
    const [result] = await db.query(sql, [
      usuario_id,
      categoria_id,
      titulo,
      descripcion,
      meta,
      fecha_limite,
      img1,
      img2,
      img3,
      img4,
    ]);
    res.json({
      message: "Proyecto creado con galería exitosamente",
      proyectoId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error al crear proyecto", error: err.message });
  }
};

exports.listarProyectos = async (req, res) => {
  const sql = `
    SELECT p.*, u.nombre_completo as autor, c.nombre as categoria 
    FROM proyectos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.estado_aprobacion = 'publicado' 
    AND p.estado_campana != 'en_pausa' 
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: err.message });
  }
};

exports.obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, u.nombre_completo as autor_nombre 
    FROM proyectos p
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.id = ?
  `;

  try {
    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.json(result[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener detalle", error: err.message });
  }
};

exports.listarTodosLosProyectos = async (req, res) => {
  const sql = `
    SELECT p.*, u.nombre_completo as autor_nombre 
    FROM proyectos p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.created_at DESC
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: err.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado, observacion } = req.body;

  let sql = "UPDATE proyectos SET estado_aprobacion = ?";
  const params = [nuevoEstado];

  if (observacion) {
    sql += ", observaciones_admin = ?";
    params.push(observacion);
  }

  sql += " WHERE id = ?";
  params.push(id);

  try {
    const [result] = await db.query(sql, params);
    res.json({ message: `Estado actualizado a ${nuevoEstado}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al cambiar estado", error: err.message });
  }
};

exports.misProyectos = async (req, res) => {
  const { usuario_id } = req.params;
  const sql = `
    SELECT * FROM proyectos 
    WHERE usuario_id = ? 
    ORDER BY created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [usuario_id]);
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener proyectos", error: err.message });
  }
};

exports.eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM proyectos WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    res.json({ message: "Proyecto eliminado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar proyecto", error: err.message });
  }
};

exports.cambiarEstadoCampana = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const sql = "UPDATE proyectos SET estado_campana = ? WHERE id = ?";

  try {
    const [result] = await db.query(sql, [estado, id]);
    res.json({ message: "Estado de campaña actualizado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar campaña", error: err.message });
  }
};

exports.editarProyecto = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, meta, fecha_limite } = req.body;
  const sql = `
    UPDATE proyectos 
    SET titulo = ?, descripcion = ?, meta_financiera = ?, fecha_limite = ?, estado_aprobacion = 'en_revision'
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(sql, [
      titulo,
      descripcion,
      meta,
      fecha_limite,
      id,
    ]);
    res.json({ message: "Proyecto editado y enviado a revisión" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al editar proyecto", error: err.message });
  }
};
