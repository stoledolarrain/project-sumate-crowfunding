
document.addEventListener('DOMContentLoaded', () => {
    
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
        window.location.href = 'login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        alert("Error: No se especificó un proyecto.");
        window.location.href = 'projects-lists.html';
        return;
    }

    document.getElementById('btnCancelar').href = `projects-details.html?id=${projectId}`;

    const form = document.getElementById('formPago');
    const inputMonto = document.getElementById('monto');
    const errorMonto = document.getElementById('errorMonto');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        errorMonto.innerText = '';
        inputMonto.style.border = '1px solid #ddd';

        const montoValor = inputMonto.value.trim();

        if (montoValor === '') {
            errorMonto.innerText = 'Por favor ingrese un monto.';
            inputMonto.style.border = '1px solid red';
            return; 
        }

        if (parseFloat(montoValor) <= 0) {
            errorMonto.innerText = 'El monto debe ser mayor a 0.';
            inputMonto.style.border = '1px solid red';
            return;
        }

        window.location.href = `cobro.html?id=${projectId}&monto=${montoValor}`;
    });
});