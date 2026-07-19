// ==========================================================================
// PORTFOLIO INTERACTIVO - BRUNO BIRMAN (2026)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. EFECTO DE ENTRADA CON SCROLL (INTERSECTION OBSERVER) ---
    const elementosAAnimar = document.querySelectorAll('section, article');
    const opciones = {
        root: null, 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0) scale(1)';
                entrada.target.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                observador.unobserve(entrada.target);
            }
        });
    }, opciones);

    elementosAAnimar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(30px) scale(0.98)';
        observador.observe(elemento);
    });


    // --- 2. FILTRO DINÁMICO DE PROYECTOS ---
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const proyectos = document.querySelectorAll('.proyectos-grid article');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Cambiar la clase activa entre los botones
            botonesFiltro.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            const categoriaSeleccionada = boton.getAttribute('data-categoria');

            proyectos.forEach(proyecto => {
                const categoriaProyecto = proyecto.getAttribute('data-categoria');

                if (categoriaSeleccionada === 'todos' || categoriaProyecto === categoriaSeleccionada) {
                    proyecto.classList.remove('oculto');
                    // Reiniciamos una leve animación para que aparezcan suavemente al filtrar
                    proyecto.style.opacity = '1';
                    proyecto.style.transform = 'scale(1)';
                } else {
                    proyecto.classList.add('oculto');
                }
            });
        });
    });


    // --- 3. BOTÓN COPIAR EMAIL AL PORTAPAPELES ---
    const btnCopiar = document.getElementById('btn-copiar');
    const emailTexto = document.getElementById('email-texto').innerText;

    if (btnCopiar) {
        btnCopiar.addEventListener('click', () => {
            // Usamos la API moderna del navegador para copiar texto
            navigator.clipboard.writeText(emailTexto).then(() => {
                // Feedback visual temporal
                btnCopiar.innerText = '¡Copiado!';
                btnCopiar.style.borderColor = '#ff0055';
                btnCopiar.style.color = '#ff0055';
                btnCopiar.style.boxShadow = '0 0 10px #ff0055';

                // Volver al estado original después de 2 segundos
                setTimeout(() => {
                    btnCopiar.innerText = 'Copiar';
                    btnCopiar.style.borderColor = '#00f0ff';
                    btnCopiar.style.color = '#00f0ff';
                    btnCopiar.style.boxShadow = '0 0 5px rgba(0, 240, 255, 0.2)';
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar el mail: ', err);
            });
        });
    }
});