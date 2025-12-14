
const form = document.getElementById("formCrearProyecto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuarioString = localStorage.getItem("usuario");

  if (!usuarioString) {
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(usuarioString);

  const formData = new FormData(form);

  formData.append("usuario_id", usuario.id);

  const btnSubmit = form.querySelector(".btn-submit");
  btnSubmit.inneHTML = "Subiendo...";
  btnSubmit.disabled = true;

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      window.location.href = "projects-lists.html";
    } else {
      console.error("Error al crear proyecto");
    }
  } catch (error) {
    console.error(error);
  }
});
