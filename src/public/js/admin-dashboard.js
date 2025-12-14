document.addEventListener('DOMContentLoaded', async () => {
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) { window.location.href = 'login.html'; return; }
    const usuario = JSON.parse(usuarioString);
    if (usuario.rol !== 'admin') { window.location.href = 'index.html'; return; }

    document.getElementById('admin-name').textContent = `Hola, ${usuario.nombre}`;
    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault(); localStorage.removeItem('usuario'); window.location.href = 'login.html';
    });

    cargarTablaProyectos();
});

window.mostrarSeccion = (seccion) => {
    document.getElementById('section-proyectos').style.display = 'none';
    document.getElementById('section-admins').style.display = 'none';
    
    document.getElementById(`section-${seccion}`).style.display = 'block';
    
    if (seccion === 'admins') cargarTablaAdmins();
    if (seccion === 'proyectos') cargarTablaProyectos();
};

async function cargarTablaProyectos() {
    const tableBody = document.getElementById('adminTableBody');
    try {
        const response = await fetch('/api/projects/admin/todos');
        const proyectos = await response.json();
        tableBody.innerHTML = '';

        if (proyectos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay proyectos.</td></tr>'; return;
        }

        proyectos.forEach(p => {
            let badgeClass = 'bg-borrador';
            if (p.estado_aprobacion === 'en_revision') badgeClass = 'bg-revision';
            if (p.estado_aprobacion === 'publicado') badgeClass = 'bg-publicado';
            if (p.estado_aprobacion === 'observado') badgeClass = 'bg-observado';
            if (p.estado_aprobacion === 'rechazado') badgeClass = 'bg-rechazado';

            let botones = '';
            if (p.estado_aprobacion !== 'publicado' && p.estado_aprobacion !== 'rechazado') {
                botones = `
                    <button class="action-btn btn-approve" onclick="ejecutarCambio(${p.id}, 'publicado')">Aprobar</button>
                    <button class="action-btn btn-observe" onclick="observarProyecto(${p.id})">Observar</button>
                    <button class="action-btn btn-reject" onclick="ejecutarCambio(${p.id}, 'rechazado')">Rechazar</button>
                `;
            } else { botones = '<span style="color:#888; font-size:12px;">Gestión finalizada</span>'; }

            const row = `
                <tr>
                    <td>#${p.id}</td>
                    <td><a href="projects-details.html?id=${p.id}" target="_blank" style="color:#d24907; font-weight:bold;">${p.titulo}</a></td>
                    <td>${p.autor_nombre}</td>
                    <td><span class="badge ${badgeClass}">${p.estado_aprobacion}</span></td>
                    <td>${botones}</td>
                </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) { console.error(error); }
}

window.ejecutarCambio = async (id, nuevoEstado, observacion = null) => {
    try {
        const bodyData = { nuevoEstado };
        if (observacion) bodyData.observacion = observacion;
        const res = await fetch(`/api/projects/admin/estado/${id}`, {
            method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(bodyData)
        });
        if (res.ok) cargarTablaProyectos();
    } catch (e) { console.error(e); }
};

window.observarProyecto = (id) => {
    const motivo = prompt("Motivo de observación:");
    if (motivo) ejecutarCambio(id, 'observado', motivo);
};

async function cargarTablaAdmins() {
    const tableBody = document.getElementById('adminsTableBody');
    try {
        const response = await fetch('/api/admin/usuarios');
        const admins = await response.json();
        tableBody.innerHTML = '';

        admins.forEach(a => {
            const fecha = new Date(a.fecha_registro).toLocaleDateString();
            const row = `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.nombre_completo}</td>
                    <td>${a.email}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="action-btn btn-observe" onclick="prepararEdicion('${a.id}', '${a.nombre_completo}', '${a.email}')">Editar</button>
                        <button class="action-btn btn-reject" onclick="eliminarAdmin(${a.id})">Borrar</button>
                    </td>
                </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) { console.error(error); }
}

const formAdmin = document.getElementById('formAdmin');
const formContainer = document.getElementById('formAdminContainer');

window.mostrarFormAdmin = () => {
    formContainer.style.display = 'block';
    formAdmin.reset();
    document.getElementById('adminId').value = '';
    document.getElementById('formAdminTitle').textContent = 'Nuevo Administrador';
    document.getElementById('adminPass').placeholder = "Contraseña";
    document.getElementById('adminPass').required = true;
};

window.ocultarFormAdmin = () => {
    formContainer.style.display = 'none';
};

window.prepararEdicion = (id, nombre, email) => {
    formContainer.style.display = 'block';
    document.getElementById('formAdminTitle').textContent = 'Editar Administrador';
    document.getElementById('adminId').value = id;
    document.getElementById('adminNombre').value = nombre;
    document.getElementById('adminEmail').value = email;
    document.getElementById('adminPass').placeholder = "(Dejar vacío para mantener)";
    document.getElementById('adminPass').required = false; 
};

formAdmin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const nombre = document.getElementById('adminNombre').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPass').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/usuarios/${id}` : '/api/admin/usuarios';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        if (res.ok) {
            ocultarFormAdmin();
            cargarTablaAdmins();
        } else {
            console.error("Error al guardar admin");
        }
    } catch (error) { console.error(error); }
});

window.eliminarAdmin = async (id) => {
    try {
        const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
        if (res.ok) cargarTablaAdmins();
    } catch (e) { console.error(e); }
};