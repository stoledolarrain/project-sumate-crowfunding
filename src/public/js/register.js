const form = document.getElementById('registerForm');
const inputName = document.getElementById('name');
const errorName = document.getElementById('errorName');
const inputEmail = document.getElementById('email');
const errorEmail = document.getElementById('errorEmail');
const inputPassword = document.getElementById('password');
const errorPassword = document.getElementById('errorPassword');
const mensajeGlobal = document.getElementById('mensajeGlobal');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorName.innerHTML = '';
    errorEmail.innerHTML = '';
    errorPassword.innerHTML = '';
    mensajeGlobal.innerHTML = '';
    let hayErrores = false;

    if (inputName.value.trim() === '') {
        errorName.innerHTML = 'El nombre es obligatorio';
        hayErrores = true;
    }

    if (inputEmail.value.trim() === '') {
        errorEmail.innerHTML = 'El correo es obligatorio';
        hayErrores = true;
    }

    if (inputPassword.value.length < 6) {
        errorPassword.innerHTML = 'La contraseña debe tener al menos 6 caracteres';
        hayErrores = true;
    }

    if (hayErrores) {
        return;
    }

    try {
        const respuesta = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: inputName.value,
                email: inputEmail.value,
                password: inputPassword.value
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {

            mensajeGlobal.style.color = 'green';
            mensajeGlobal.innerHTML = `
                Registro exitoso. <br>
                <a href="${datos.emailPreview}" target="_blank" style="font-size: 14px; color: blue; text-decoration: underline; font-weight: bold;">
                    CLICK AQUÍ PARA ACTIVAR CUENTA
                </a>
            `;
            
            form.reset();
            
        } else {
            mensajeGlobal.style.color = 'red';
            mensajeGlobal.innerHTML = datos.message || 'Error desconocido';
        }

    } catch (error) {
        console.error(error);
        mensajeGlobal.style.color = 'red';
        mensajeGlobal.innerHTML = 'Error de conexión con el servidor.';
    }
});