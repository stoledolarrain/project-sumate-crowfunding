document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const form = document.getElementById('formCrearProyecto');

    try {
        const res = await fetch(`/api/projects/${projectId}`);
        const proyecto = await res.json();

        document.getElementById('titulo').value = proyecto.titulo;
        document.getElementById('meta').value = proyecto.meta_financiera;
        document.getElementById('fecha_limite').value = proyecto.fecha_limite.split('T')[0];
        document.getElementById('descripcion').value = proyecto.descripcion;
        document.getElementById('categoria_id').value = proyecto.categoria_id;

    } catch (error) {
        console.error(error);
        console.log("Error cargando datos");
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datosActualizados = {
            titulo: document.getElementById('titulo').value,
            meta: document.getElementById('meta').value,
            fecha_limite: document.getElementById('fecha_limite').value,
            descripcion: document.getElementById('descripcion').value,
        };

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            if (res.ok) {
                window.location.href = "my-projects.html";
            }
        } catch (error) {
            console.error(error);
            console.log("Error al guardar");
        }
    });
});