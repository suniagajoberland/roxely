// Inicializar AOS
AOS.init({ duration: 1000, once: true });

// Inicializar Swiper
new Swiper(".mySwiper", {
  grabCursor: true,
  loop: true,
  centeredSlides: true,
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: { el: ".swiper-pagination", clickable: true },
});

// DRAG & DROP PARA MARQUEES
const marquees = document.querySelectorAll(".marquesina-wrapper");

marquees.forEach((marquee) => {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let animationId = null;

  const track = marquee.querySelector(".marquesina-track");

  const startDrag = (e) => {
    isDragging = true;
    marquee.classList.add("dragging");
    cancelAnimationFrame(animationId);

    startX = e.pageX || e.touches[0].pageX - marquee.offsetLeft;
    scrollLeft = track.scrollLeft;
    marquee.style.cursor = "grabbing";
  };

  const drag = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX || e.touches[0].pageX - marquee.offsetLeft;
    const walk = (x - startX) * 2;
    track.scrollLeft = scrollLeft - walk;
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    marquee.classList.remove("dragging");
    marquee.style.cursor = "grab";

    // Reiniciar animación después de 1 segundo
    setTimeout(() => {
      if (!marquee.matches(":hover")) {
        marquee.querySelector(".marquesina-track").style.animationPlayState =
          "running";
      }
    }, 1000);
  };

  marquee.addEventListener("mousedown", startDrag);
  marquee.addEventListener("mousemove", drag);
  marquee.addEventListener("mouseup", endDrag);
  marquee.addEventListener("mouseleave", endDrag);

  // Soporte táctil para móviles
  marquee.addEventListener("touchstart", startDrag);
  marquee.addEventListener("touchmove", drag);
  marquee.addEventListener("touchend", endDrag);

  // Prevenir selección de texto
  marquee.addEventListener("selectstart", (e) => e.preventDefault());
});
