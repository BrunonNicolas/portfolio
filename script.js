// ==========================================================================
// CONTROL DE EFECTOS DINÁMICOS PARA EL PORTFOLIO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todas las secciones y las tarjetas de los proyectos
    const elementosAAnimar = document.querySelectorAll('section, article');

    // Configuración del observador de pantalla (Intersection Observer)
    const opciones = {
        root: null, // Usa la pantalla del navegador como referencia
        threshold: 0.15, // Se activa cuando el 15% del elemento ya es visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            // Si el usuario llegó al elemento haciendo scroll
            if (entrada.isIntersecting) {
                // Le añadimos una clase dinámica de CSS para que aparezca con fluidez
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0) scale(1)';
                entrada.target.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Dejamos de observarlo para que la animación solo ocurra la primera vez
                observador.unobserve(entrada.target.style);
            }
        });
    }, opciones);

    // Inicializamos el estado de los elementos antes de que aparezcan
    elementosAAnimar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(30px) scale(0.98)';
        observador.observe(elemento);
    });
});