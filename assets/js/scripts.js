/**
 * INICIALIZACIÓN DE LIBRERÍAS Y COMPONENTES
 * Proyecto: Portafolio de Video
 */

const prepararMarquesinas = () => {
  const tracks = [...document.querySelectorAll(".marquesina-track")];
  if (tracks.length < 2) return;

  const vistos = new Set();
  const items = tracks
    .flatMap((track) => [...track.children])
    .filter((item) => {
      const src = item.querySelector("img")?.getAttribute("src");
      if (!src || vistos.has(src)) return false;
      vistos.add(src);
      return true;
    });

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  const corte = Math.ceil(items.length / 2);

  tracks.forEach((track, fila) => {
    const grupo = document.createElement("div");
    grupo.className = "marquesina-grupo";
    items.slice(fila === 0 ? 0 : corte, fila === 0 ? corte : items.length).forEach((item) => {
      grupo.appendChild(item);
    });

    const clon = grupo.cloneNode(true);
    clon.setAttribute("aria-hidden", "true");
    clon.querySelectorAll("img").forEach((img) => {
      img.alt = "";
    });

    track.style.animationDuration = `${(grupo.children.length * 340) / 120}s`;
    track.replaceChildren(grupo, clon);
  });
};

prepararMarquesinas();

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

    // 3. VIDEO DEL HEADER (AUTOPLAY GARANTIZADO EN MÓVIL Y DESKTOP)
    const videoHero = document.querySelector(".video-fondo");

    if (videoHero) {
        // Asegura el autoplay silenciado (algunos navegadores lo bloquean al cargar)
        const reproducirHero = () => {
            videoHero.muted = true;
            const intento = videoHero.play();
            if (intento && typeof intento.catch === "function") {
                intento.catch(() => {});
            }
        };

        reproducirHero();

        // Reintenta cuando el video ya puede reproducirse
        videoHero.addEventListener("canplay", reproducirHero, { once: true });

        // Desbloqueo en el primer gesto del usuario (iOS/Android)
        const desbloquearHero = () => {
            reproducirHero();
            document.removeEventListener("touchstart", desbloquearHero);
            document.removeEventListener("click", desbloquearHero);
        };
        document.addEventListener("touchstart", desbloquearHero, { passive: true });
        document.addEventListener("click", desbloquearHero);

        // Pausa cuando el hero sale de pantalla (mejora rendimiento y fluidez)
        if ("IntersectionObserver" in window) {
            const observadorHero = new IntersectionObserver(
                (entradas) => {
                    entradas.forEach((entrada) => {
                        if (entrada.isIntersecting) {
                            reproducirHero();
                        } else {
                            videoHero.pause();
                        }
                    });
                },
                { threshold: 0.1 }
            );
            observadorHero.observe(videoHero);
        }

        // Ahorra recursos cuando la pestaña no está visible
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                videoHero.pause();
            } else {
                reproducirHero();
            }
        });
    }

    // 4. VIDEOS INTERACTIVOS (HOVER EN ESCRITORIO / AUTOPLAY SILENCIADO EN MÓVIL)
    const videosContenido = [
        ...document.querySelectorAll("main video:not(.video-fondo)"),
    ];
    const esMovil = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    let videoConSonido = null;

    const obtenerContenedor = (video) =>
        video.closest(".video-card-sm, .columna-video-corp");

    const detenerVideo = (video) => {
        video.pause();
        video.muted = true;
        video.dataset.activo = "false";
        const contenedor = obtenerContenedor(video);
        if (contenedor) contenedor.classList.remove("video-playing");
        if (videoConSonido === video) videoConSonido = null;
    };

    const reproducirVideo = (video, conSonido = false) => {
        if (conSonido && videoConSonido && videoConSonido !== video) {
            detenerVideo(videoConSonido);
        }
        video.muted = !conSonido;
        const intento = video.play();
        if (intento && typeof intento.catch === "function") {
            intento.catch(() => {});
        }
        if (conSonido) {
            video.dataset.activo = "true";
            videoConSonido = video;
        }
        const contenedor = obtenerContenedor(video);
        if (contenedor) contenedor.classList.add("video-playing");
    };

    const estaVisible = (video) => {
        const rect = video.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    videosContenido.forEach((video) => {
        video.dataset.activo = "false";
        video.muted = true;

        if (esMovil) {
            if ("IntersectionObserver" in window) {
                const observadorVideo = new IntersectionObserver(
                    (entradas) => {
                        entradas.forEach((entrada) => {
                            if (entrada.isIntersecting) {
                                reproducirVideo(video);
                            } else {
                                detenerVideo(video);
                            }
                        });
                    },
                    { threshold: 0.35 }
                );
                observadorVideo.observe(video);
            }

            video.addEventListener("click", () => {
                if (video.muted) reproducirVideo(video, true);
                else detenerVideo(video);
            });
        } else {
            const contenedor = obtenerContenedor(video) || video;

            contenedor.addEventListener("mouseenter", () => {
                if (video.dataset.activo !== "true") reproducirVideo(video);
            });

            contenedor.addEventListener("mouseleave", () => {
                if (video.dataset.activo !== "true") video.pause();
            });

            video.addEventListener("click", () => {
                if (video.dataset.activo === "true" && !video.paused) {
                    detenerVideo(video);
                } else {
                    reproducirVideo(video, true);
                }
            });
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            videosContenido.forEach((video) => video.pause());
        } else if (esMovil) {
            videosContenido.forEach((video) => {
                if (estaVisible(video)) reproducirVideo(video);
            });
        }
    });

    // 5. OPTIMIZACIÓN DE MARQUESINAS (CSS Nativo)
    // Hemos eliminado el código JS de Drag & Drop para las marquesinas.
    // Esto permite que el scroll vertical en móviles sea 100% fluido
    // y evita que el cursor cambie a "manito" de arrastre.
    
    console.log("Sitio cargado: Marquesinas configuradas con CSS nativo para mayor fluidez.");
});