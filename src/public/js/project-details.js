document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const usuarioString = localStorage.getItem("usuario");
  let usuario = null;

  if (usuarioString) {
    usuario = JSON.parse(usuarioString);
    const navAuth = document.getElementById("nav-auth");
    if (navAuth) navAuth.innerHTML = `<a href="#">Hola, ${usuario.nombre}</a>`;
  }

  if (!projectId) {
    window.location.href = "projects-lists.html";
    return;
  }

  try {
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) throw new Error("Proyecto no encontrado");
    const proyecto = await response.json();

    document.getElementById("projectTitle").innerHTML = proyecto.titulo;
    document.getElementById("projectAuthor").innerHTML = proyecto.autor_nombre;
    document.getElementById("projectDescription").innerText =
      proyecto.descripcion;

    const recaudado = parseFloat(proyecto.monto_recaudado) || 0;
    const meta = parseFloat(proyecto.meta_financiera);
    const porcentaje = meta > 0 ? Math.round((recaudado / meta) * 100) : 0;

    document.getElementById("amountRaised").innerHTML = `Bs ${recaudado}`;
    document.getElementById("amountGoal").innerHTML = meta;
    document.getElementById(
      "progressPercent"
    ).innerHTML = `${porcentaje}% logrado`;
    document.getElementById("progressBar").style.width = `${porcentaje}%`;

    const mainImg = document.getElementById("mainImage");
    const galleryContainer = document.getElementById("galleryContainer");
    const imgPortada = proyecto.imagen_url || "img/default-project.jpg";
    mainImg.src = imgPortada;

    const fotosExtra = [
      proyecto.imagen2_url,
      proyecto.imagen3_url,
      proyecto.imagen4_url,
    ].filter((url) => url);
    const todasLasFotos = [imgPortada, ...fotosExtra];
    galleryContainer.innerHTML = "";

    todasLasFotos.forEach((fotoUrl) => {
      const btn = document.createElement("button");
      btn.className = "miniatura";
      btn.onclick = () => {
        mainImg.src = fotoUrl;
      };
      btn.innerHTML = `<img src="${fotoUrl}" alt="Miniatura">`;
      galleryContainer.appendChild(btn);
    });

    document.getElementById("loadingMsg").classList.add("hidden");
    document.getElementById("contentWrapper").classList.remove("hidden");

    const btnFavorite = document.getElementById("btnFavorite");

    if (usuario) {
      btnFavorite.classList.remove("hidden");

      verificarEstadoFavorito(usuario.id, projectId, btnFavorite);

      btnFavorite.addEventListener("click", async () => {
        await toggleFavorito(usuario.id, projectId, btnFavorite);
      });
    }

    const btnDonate = document.getElementById("btnDonate");
    if (btnDonate) {
      btnDonate.addEventListener("click", () => {
        if (!usuario) {
          window.location.href = "login.html";
        } else {
          console.log("Botón de donar presionado");
        }
      });
    }
  } catch (error) {
    console.error(error);
    document.getElementById("loadingMsg").innerHTML =
      "Error al cargar el proyecto.";
  }

  const btnDonate = document.getElementById("btnDonate");
  if (btnDonate) {
    btnDonate.addEventListener("click", () => {
      if (!usuario) {
        window.location.href = "login.html";
      } else {
        window.location.href = `cobro-cantidad.html?id=${projectId}`;
      }
    });
  }
  // ...
});

async function verificarEstadoFavorito(usuarioId, proyectoId, btn) {
  try {
    const res = await fetch(`/api/favoritos/check/${usuarioId}/${proyectoId}`);
    const data = await res.json();

    if (data.esFavorito) {
      btn.innerHTML = "Quitar de Favoritos";
      btn.style.backgroundColor = "#e2e6ea"; 
    } else {
      btn.innerHTML = "Guardar en Favoritos";
      btn.style.backgroundColor = "#f8f9fa"; 
    }
  } catch (error) {
    console.error(error);
  }
}

async function toggleFavorito(usuarioId, proyectoId, btn) {
  try {
    const res = await fetch("/api/favoritos/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: usuarioId, proyecto_id: proyectoId }),
    });

    if (res.ok) {
      verificarEstadoFavorito(usuarioId, proyectoId, btn);
    }
  } catch (error) {
    console.error(error);
  }
}
