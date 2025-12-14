
const db = require("../dbConnection/connection");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

let transporter;
async function initNodemailer() {
  try {
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  } catch (error) {
    console.error("Error configurando correo:", error);
  }
}
initNodemailer();

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }
  const codigo = Math.floor(10000 + Math.random() * 90000);
  const sql =
    "INSERT INTO usuarios (nombre_completo, email, password, rol, es_valido, codigo_validacion) VALUES (?, ?, ?, ?, 0, ?)";

  try {
    const [result] = await db.query(sql, [
      nombre,
      email,
      password,
      "usuario",
      codigo,
    ]);

    let previewUrl = "#";

    if (transporter) {
      let info = await transporter.sendMail({
        from: "<no-reply@crowdfundingsumate.com>",
        to: email,
        subject: "Activa tu cuenta",
        html: `<a href="http://localhost:3000/api/auth/activar/${codigo}">ACTIVAR MI CUENTA</a>`,
      });

      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("CORREO ENVIADO: %s", previewUrl);
    }

    res.json({
      message: "Registro exitoso. Revisa la consola o este link.",
      emailPreview: previewUrl,
    });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }
    return res
      .status(500)
      .json({ message: "Error al registrar usuario", error: err.message });
  }
};


exports.activar = async (req, res) => {
  const { codigo } = req.params;
  const sql = "UPDATE usuarios SET es_valido = 1 WHERE codigo_validacion = ?";

  try {
    const [result] = await db.query(sql, [codigo]);

    if (result.affectedRows === 0) {
      return res.send("<h1>Código inválido o cuenta ya activada</h1>");
    }

    res.send(`<div style="text-align: center; margin-top: 50px; font-family: Arial;">
                <h1 style="color: orange;">¡Cuenta Activada Exitosamente!</h1>
                <p>Ya puedes cerrar esta ventana e iniciar sesión en la aplicación.</p>
                <a href="http://localhost:3000/login.html">Ir al Login</a>
            </div>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  try {
    const [results] = await db.query(sql, [email, password]);

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = results[0];

    if (usuario.es_valido === 0) {
      return res.status(403).json({
        message:
          "Tu cuenta no está activa. Por favor revisa tu correo para validarla.",
      });
    }


    res.json({
      message: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error en el servidor al intentar login",
      error: err.message,
    });
  }
};