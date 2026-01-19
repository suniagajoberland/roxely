/**
 * INICIALIZACIÓN DE LIBRERÍAS Y COMPONENTES
 * Proyecto: Portafolio de Video
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INICIALIZAR AOS (Animaciones al hacer scroll)
    // duration: tiempo de la animación en ms
    // once: si es true, la animación solo ocurre la primera vez que se ve
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 1000, 
            once: true,
            offset: 100 // Empieza la animación 100px antes de llegar al elemento
        });
    }

    // 2. INICIALIZAR SWIPER (Carruseles)
    // Solo se ejecuta si existe un elemento con la clase .mySwiper
    if (document.querySelector(".mySwiper")) {
        new Swiper(".mySwiper", {
            grabCursor: true, // Mantiene la mano solo en el carrusel específico
            loop: true,
            centeredSlides: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: { 
                el: ".swiper-pagination", 
                clickable: true 
            },
            breakpoints: {
                // Configuración responsiva para Swiper
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // 3. OPTIMIZACIÓN DE MARQUESINAS (CSS Nativo)
    // Hemos eliminado el código JS de Drag & Drop para las marquesinas.
    // Esto permite que el scroll vertical en móviles sea 100% fluido
    // y evita que el cursor cambie a "manito" de arrastre.
    
    console.log("Sitio cargado: Marquesinas configuradas con CSS nativo para mayor fluidez.");
});