
let proyectosGlobal = [];

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioString = localStorage.getItem("usuario");

  const btnCrear = document.getElementById("btnCrearProyecto");
  const btnAdmin = document.getElementById("btnAdminPanel");
  const btnMisProyectos = document.getElementById("btnMisProyectos");
  const btnFavoritos = document.getElementById("btnFavoritos");

  const navAuth = document.getElementById("nav-auth");

  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);

    if (btnCrear) btnCrear.style.display = "inline-block";
    if (btnMisProyectos) btnMisProyectos.style.display = "inline-block";
    if (btnFavoritos) btnFavoritos.style.display = "inline-block";

    if (usuario.rol === "admin" && btnAdmin) {
      btnAdmin.style.display = "inline-block";
    }

    navAuth.innerHTML = `
            <span style="color: #333; margin-right: 5px;">Hola, ${usuario.nombre}</span>
            <a href="#" id="btnSalir" style="color: red; font-size: 12px;">(Salir)</a>
        `;

    document.getElementById("btnSalir").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }

  const container = document.getElementById("projectsContainer");
  const filtroCategoria = document.getElementById("categoriaFilter");

  try {
    const response = await fetch("/api/projects");
    proyectosGlobal = await response.json();

    renderizarProyectos(proyectosGlobal);
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<p style="color: red; text-align: center; width: 100%;">Error al cargar proyectos.</p>';
  }

  filtroCategoria.addEventListener("change", (e) => {
    const categoriaSeleccionada = e.target.value;

    if (categoriaSeleccionada === "todas") {
      renderizarProyectos(proyectosGlobal);
    } else {
      const filtrados = proyectosGlobal.filter(
        (p) => p.categoria_id == categoriaSeleccionada
      );
      renderizarProyectos(filtrados);
    }
  });

  function renderizarProyectos(listaDeProyectos) {
    container.innerHTML = "";

    if (listaDeProyectos.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; width: 100%; grid-column: 1 / -1; margin-top: 20px; font-style: italic; color: #666;">No hay proyectos en esta categoría.</p>';
      return;
    }

    listaDeProyectos.forEach((proyecto) => {
      const imagen = proyecto.imagen_url || "img/default-project.jpg";

      const porcentaje =
        proyecto.meta_financiera > 0
          ? Math.round(
              (proyecto.monto_recaudado / proyecto.meta_financiera) * 100
            )
          : 0;

      const card = `
                <article class="card">
                    <figure class="card-media">
                        <img src="${imagen}" alt="${proyecto.titulo}" />
                    </figure>
                    <div class="card-body">
                        <h3 class="card-title">${proyecto.titulo}</h3>
                        <p class="card-text">
                            ${
                              proyecto.descripcion
                                ? proyecto.descripcion.substring(0, 80) + "..."
                                : "Sin descripción"
                            }
                        </p>
                        
                        <div style="background: #eee; height: 8px; border-radius: 4px; margin-bottom: 5px; overflow: hidden;">
                            <div style="background: #f47f11; height: 100%; width: ${porcentaje}%;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #666;">
                            <span>Meta: Bs ${proyecto.meta_financiera}</span>
                            <span>${porcentaje}%</span>
                        </div>

                        <a href="projects-details.html?id=${proyecto.id}">
                            <button class="card-btn">Ver Detalles / Donar</button>
                        </a>
                    </div>
                </article>
            `;
      container.innerHTML += card;
    });
  }
});
