const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const mensajeGlobal = document.getElementById("mensajeGlobal");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorEmail.innerHTML = "";
  errorPassword.innerHTML = "";
  mensajeGlobal.innerHTML = "";

  let hayErrores = false;

  if (inputEmail.value.trim() === "") {
    errorEmail.innerHTML = "Ingrese su correo electrónico";
    hayErrores = true;
  }

  if (inputPassword.value.trim() === "") {
    errorPassword.innerHTML = "Ingrese su contraseña";
    hayErrores = true;
  }

  if (hayErrores) return;

  try {
    const respuesta = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value,
      }),
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {

      localStorage.setItem("usuario", JSON.stringify(datos.usuario));

      if (datos.usuario.rol === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "projects-lists.html";
      }
    } else {
      mensajeGlobal.style.color = "red";
      mensajeGlobal.innerHTML = datos.message;
    }
  } catch (error) {
    console.error(error);
    mensajeGlobal.style.color = "red";
    mensajeGlobal.innerHTML = "Error de conexión con el servidor";
  }
});
