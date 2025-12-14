const db = require("../dbConnection/connection");

const pagosPendientes = {};

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3001";

exports.crearIntencionPago = async (req, res) => {
  const { usuario_id, proyecto_id, monto } = req.body;

  if (!usuario_id || !proyecto_id || !monto) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    console.log(`Iniciando pago de Bs ${monto} en el Gateway...`);

    const response = await fetch(`${GATEWAY_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monto: parseFloat(monto) }),
    });

    if (!response.ok)
      throw new Error("Error al conectar con la pasarela de pagos");

    const data = await response.json();

    pagosPendientes[data.id] = {
      usuario_id,
      proyecto_id,
      monto,
      estado: "pendiente",
    };

    res.json({
      success: true,
      payment_id: data.id,
      qr_url: data.qr,
    });
  } catch (error) {
    console.error("Error paymentController:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.consultarEstado = (req, res) => {
  const { id } = req.params;
  const pago = pagosPendientes[id];

  if (!pago) {
    return res.status(404).json({ error: "Pago no encontrado o expirado" });
  }

  res.json({
    id: id,
    estado: pago.estado,
    monto: pago.monto,
  });
};

exports.recibirWebhook = async (req, res) => {
  const { id, fechaPago } = req.body;

  console.log(`Webhook recibido para pago ID: ${id}`);

  const pago = pagosPendientes[id];

  if (!pago) {
    console.log("Pago no encontrado");
    return res.status(404).json({ error: "Pago desconocido" });
  }

  if (pago.estado === "confirmado") {
    return res.json({ message: "Pago ya procesado anteriormente" });
  }

  try {
    const sqlDonacion =
      "INSERT INTO donaciones (usuario_id, proyecto_id, monto) VALUES (?, ?, ?)";
    await db.query(sqlDonacion, [
      pago.usuario_id,
      pago.proyecto_id,
      pago.monto,
    ]);

    const sqlProyecto =
      "UPDATE proyectos SET monto_recaudado = monto_recaudado + ? WHERE id = ?";
    await db.query(sqlProyecto, [pago.monto, pago.proyecto_id]);

    pago.estado = "confirmado";
    pago.fechaConfirmacion = fechaPago;

    const sqlCheck =
      "SELECT monto_recaudado, meta_financiera FROM proyectos WHERE id = ?";
    const [rows] = await db.query(sqlCheck, [pago.proyecto_id]);

    if (rows.length > 0) {
      const proyecto = rows[0];
      const recaudado = parseFloat(proyecto.monto_recaudado);
      const meta = parseFloat(proyecto.meta_financiera);

      if (recaudado >= meta) {
        console.log(
          `🎉 ¡Proyecto ${pago.proyecto_id} alcanzó la meta! Cerrando campaña...`
        );
        await db.query(
          "UPDATE proyectos SET estado_campana = 'finalizada' WHERE id = ?",
          [pago.proyecto_id]
        );
      }
    }

    console.log("Donación registrada y proyecto actualizado exitosamente");

    res.json({ success: true, message: "Donación registrada correctamente" });
  } catch (error) {
    console.error("Error guardando en BD:", error);
    res
      .status(500)
      .json({ error: "Error interno al guardar en base de datos" });
  }
};
