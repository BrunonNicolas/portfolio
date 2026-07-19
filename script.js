// ==========================================================================
// CONTROL DE EFECTOS DINÁMICOS PARA EL PORTFOLIO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todas las secciones y las tarjetas de los proyectos
    const elementosAAnimar = document.querySelectorAll('section, article');

    // Configuración del observador de pantalla
    const opciones = {
        root: null, 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                // Aplicamos la transición suave
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0) scale(1)';
                entrada.target.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Dejamos de observarlo de forma correcta
                observador.unobserve(entrada.target);
            }
        });
    }, opciones);

    // Estado inicial oculto antes del scroll
    elementosAAnimar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(30px) scale(0.98)';
        observador.observe(elemento);
    });
});