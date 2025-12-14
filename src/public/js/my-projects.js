document.addEventListener('DOMContentLoaded', async () => {
    
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(usuarioString);
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.innerHTML = `Hola, ${usuario.nombre}`;
    }

    const tableBody = document.getElementById('myProjectsBody');

    try {
        const response = await fetch(`/api/projects/usuario/${usuario.id}`);
        const proyectos = await response.json();

        tableBody.innerHTML = '';

        if (proyectos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No has creado proyectos aún.</td></tr>';
            return;
        }

        proyectos.forEach(p => {
            let botonesCampaña = '';
            
            if (p.estado_aprobacion === 'publicado') {
                
                if (p.estado_campana === 'no_iniciada' || p.estado_campana === 'en_pausa') {
                    botonesCampaña += `
                        <button class="action-btn btn-play" onclick="cambiarCampana(${p.id}, 'en_progreso')" title="Iniciar Campaña">
                            ▶ Iniciar
                        </button>`;
                }
                
                if (p.estado_campana === 'en_progreso') {
                    botonesCampaña += `
                        <button class="action-btn btn-pause" onclick="cambiarCampana(${p.id}, 'en_pausa')" title="Pausar Campaña">
                            ⏸ Pausar
                        </button>`;
                }
            } else {
                botonesCampaña = `<span style="font-size:11px; color:#888; margin-right:5px;">Espera aprobación</span>`;
            }

            let botonEditar = '';
            if (p.estado_aprobacion === 'borrador' || p.estado_aprobacion === 'observado') {
                botonEditar = `<a href="edit-project.html?id=${p.id}" class="action-btn btn-edit" title="Editar">✏</a>`;
            }

            const botonEliminar = `<button class="action-btn btn-delete" onclick="eliminarProyecto(${p.id})" title="Eliminar">🗑</button>`;

            let mensajeObservacion = '';
            if (p.estado_aprobacion === 'observado' && p.observaciones_admin) {
                mensajeObservacion = `
                    <div style="color: #e74c3c; font-size: 12px; margin-top: 5px; font-weight: bold;">
                        Observación: "${p.observaciones_admin}"
                    </div>`;
            }

            const row = `
                <tr>
                    <td>
                        <strong>${p.titulo}</strong>
                        ${mensajeObservacion} </td>
                    <td><span class="badge bg-${p.estado_aprobacion}">${p.estado_aprobacion}</span></td>
                    <td>${p.estado_campana.replace('_', ' ')}</td>
                    <td>Bs ${p.monto_recaudado}</td>
                    <td>
                        ${botonesCampaña}
                        ${botonEditar}
                        ${botonEliminar}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="5" style="color:red; text-align:center;">Error de conexión</td></tr>';
    }
});


window.cambiarCampana = async (id, nuevoEstado) => {
    try {
        const res = await fetch(`/api/projects/campana/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (res.ok) {
            location.reload(); 
        }
    } catch (error) { console.error(error); }
};

window.eliminarProyecto = async (id) => {
    try {
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) location.reload();
    } catch (error) { console.error(error); }
};