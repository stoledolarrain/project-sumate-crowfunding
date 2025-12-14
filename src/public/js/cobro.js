
document.addEventListener('DOMContentLoaded', async () => {
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const monto = params.get('monto');
    
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString || !projectId || !monto) {
        window.location.href = 'projects-lists.html';
        return;
    }
    const usuario = JSON.parse(usuarioString);

    const qrImage = document.getElementById('qrImage');
    const montoDisplay = document.getElementById('montoDisplay');
    const btnConfirmar = document.getElementById('btnConfirmarPago');
    
    montoDisplay.innerText = `Bs ${parseFloat(monto).toFixed(2)}`;
    document.getElementById('btnVolver').href = `cobro-cantidad.html?id=${projectId}`;

    try {
        const res = await fetch('/api/pagos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuario.id,
                proyecto_id: projectId,
                monto: monto
            })
        });

        const data = await res.json();

        if (data.success) {
            qrImage.src = data.qr_url;
            
            iniciarSondeo(data.payment_id);
        } else {
            alert("Error al generar pago: " + (data.error || "Desconocido"));
        }

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar con el servidor de pagos.");
    }

    function iniciarSondeo(paymentId) {
        const intervalo = setInterval(async () => {
            try {
                const res = await fetch(`/api/pagos/estado/${paymentId}`);
                const estadoData = await res.json();

                if (estadoData.estado === 'confirmado') {
                    clearInterval(intervalo);
                    
                    qrImage.parentElement.innerHTML = `
                        <div style="color: green; font-size: 60px;">✅</div>
                        <h3 style="color: green;">¡Pago Exitoso!</h3>
                    `;
                    
                    setTimeout(() => {
                        window.location.href = `projects-details.html?id=${projectId}`;
                    }, 3000);
                }
            } catch (e) {
                console.error("Error verificando estado:", e);
            }
        }, 3000);
    }
    if(btnConfirmar) {
        btnConfirmar.style.display = 'none';
    }
});