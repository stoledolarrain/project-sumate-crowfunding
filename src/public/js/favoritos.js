document.addEventListener('DOMContentLoaded', async () => {
    
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(usuarioString);
    document.getElementById('user-name').innerHTML = `Hola, ${usuario.nombre}`;

    const container = document.getElementById('favoritesContainer');

    try {
        const response = await fetch(`/api/favoritos/mis-favoritos/${usuario.id}`);
        const proyectos = await response.json();

        container.innerHTML = '';

        if (proyectos.length === 0) {
            container.innerHTML = '<p class="empty-msg">No has guardado ningún proyecto todavía.</p>';
            return;
        }

        proyectos.forEach(p => {
            const imagen = p.imagen_url || 'img/default-project.jpg';
            const descripcion = p.descripcion ? p.descripcion.substring(0, 80) + '...' : 'Sin descripción';

            const card = `
                <article class="card">
                    <figure class="card-media">
                        <img src="${imagen}" alt="${p.titulo}">
                    </figure>
                    <div class="card-body">
                        <h3 class="card-title">${p.titulo}</h3>
                        <p class="card-text">${descripcion}</p>
                        
                        <a href="projects-details.html?id=${p.id}" class="card-btn">
                            Ver Detalles
                        </a>
                    </div>
                </article>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="loading-msg" style="color:red">Error de conexión con el servidor.</p>';
    }
});