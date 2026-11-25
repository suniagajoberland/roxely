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

const configurarDireccionMarquesinas = () => {
  let ultimoScroll = window.scrollY;
  let actualizando = false;

  const obtenerAnimaciones = () =>
    [...document.querySelectorAll(".marquesina-track")].flatMap((track) =>
      typeof track.getAnimations === "function" ? track.getAnimations() : []
    );

  const normalizarCiclo = (animacion) => {
    const duracion = animacion.effect?.getComputedTiming().duration;
    if (!Number.isFinite(duracion) || duracion <= 0) return;

    const tiempo = Number(animacion.currentTime);
    if (!Number.isFinite(tiempo)) return;

    const margen = Math.min(250, duracion / 4);
    const modulo = ((tiempo % duracion) + duracion) % duracion;
    let destino = modulo;

    if (animacion.playbackRate < 0 && modulo < margen) {
      destino = duracion + modulo;
    } else if (animacion.playbackRate > 0 && tiempo > duracion * 2) {
      destino = modulo;
    }

    if (Math.abs(tiempo - destino) > 0.5) {
      animacion.currentTime = destino;
    }
  };

  const mantenerCiclo = () => {
    obtenerAnimaciones().forEach((animacion) => {
      normalizarCiclo(animacion);
      if (animacion.playState !== "running") {
        animacion.play();
      }
    });
    requestAnimationFrame(mantenerCiclo);
  };

  const aplicarDireccion = (haciaAbajo) => {
    const velocidad = haciaAbajo ? 1 : -1;

    obtenerAnimaciones().forEach((animacion) => {
      if (animacion.playbackRate !== velocidad) {
        animacion.playbackRate = velocidad;
      }
      normalizarCiclo(animacion);
      if (animacion.playState !== "running") {
        animacion.play();
      }
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (actualizando) return;
      actualizando = true;

      requestAnimationFrame(() => {
        const actual = window.scrollY;

        if (Math.abs(actual - ultimoScroll) >= 4) {
          aplicarDireccion(actual > ultimoScroll);
          ultimoScroll = actual;
        }

        actualizando = false;
      });
    },
    { passive: true }
  );

  requestAnimationFrame(mantenerCiclo);
};

configurarDireccionMarquesinas();

const configurarNavegacionSinRecarga = () => {
  let mainBase = null;
  let reemplazoEnCurso = false;

  const obtenerContenido = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector("main");
  };

  const irAlInicio = async (event) => {
    const enlace = event.currentTarget;
    const destino = enlace.getAttribute("href") || "index.html#inicio";
    const pagina = destino.split("#")[0] || "index.html";

    if (!mainBase) {
      if (window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/")) {
        mainBase = document.querySelector("main");
      } else {
        return;
      }
    }

    if (!mainBase || reemplazoEnCurso) return;

    event.preventDefault();
    reemplazoEnCurso = true;

    try {
      const respuesta = await fetch(pagina, { cache: "no-store" });
      if (!respuesta.ok) throw new Error("No se pudo cargar el inicio");

      const contenido = obtenerContenido(await respuesta.text());
      if (!contenido) throw new Error("No se encontró el contenido principal");

      const mainActual = document.querySelector("main");
      if (mainActual) mainActual.replaceWith(contenido);
      mainBase = contenido;
      prepararMarquesinas();
      configurarGaleriaVentanas();
      configurarServiciosExpandibles();
      configurarFormularioCotizacion();
      configurarBotonSubir();
      configurarVideosContenido();

      history.pushState({ pagina }, "", destino);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      window.location.assign(destino);
    } finally {
      reemplazoEnCurso = false;
    }
  };

  document.querySelectorAll("[data-inicio]").forEach((enlace) => {
    enlace.addEventListener("click", irAlInicio);
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-inicio], [data-subir]")) return;
    const enlace = event.target.closest('a[href$="#inicio"], a[href="index.html"]');
    if (!enlace) return;
    irAlInicio.call({ currentTarget: enlace }, event);
  });
};

configurarNavegacionSinRecarga();

const configurarBotonSubir = () => {
  document.querySelectorAll("[data-subir]").forEach((boton) => {
    if (boton.dataset.subirListo === "true") return;
    boton.dataset.subirListo = "true";
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
};

configurarBotonSubir();

function configurarGaleriaVentanas() {
  const items = document.querySelectorAll("[data-galeria-item]");
  if (!items.length) return;

  let lightbox = document.getElementById("ventanaLightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "ventanaLightbox";
    lightbox.className = "ventana-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Imagen ampliada");
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <div class="ventana-lightbox-fondo" data-lightbox-cerrar></div>
      <div class="ventana-lightbox-contenido" role="document">
        <div class="barra-ventana-galeria">
          <span class="puntos-ventana"><i></i><i></i><i></i></span>
          <span class="titulo-ventana" data-lightbox-titulo></span>
          <button type="button" class="boton-cerrar-lightbox" data-lightbox-cerrar aria-label="Cerrar imagen">
            <i class="fas fa-xmark"></i>
          </button>
        </div>
        <div class="cuerpo-lightbox">
          <img data-lightbox-img src="" alt="" />
        </div>
        <div class="pie-lightbox" data-lightbox-pie></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const imagen = lightbox.querySelector("[data-lightbox-img]");
  const titulo = lightbox.querySelector("[data-lightbox-titulo]");
  const pie = lightbox.querySelector("[data-lightbox-pie]");
  const botonCerrar = lightbox.querySelector(".boton-cerrar-lightbox");
  let origen = null;
  let overflowAnterior = "";

  const abrir = (item) => {
    const img = item.querySelector("img");
    if (!img) return;

    origen = item;
    overflowAnterior = document.body.style.overflow;
    imagen.src = img.src;
    imagen.alt = img.alt;
    titulo.textContent =
      item.querySelector(".titulo-ventana")?.textContent || "uppercreators.com / galería";
    pie.textContent = item.querySelector("figcaption")?.textContent || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    botonCerrar.focus();
  };

  const cerrar = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    imagen.removeAttribute("src");
    document.body.style.overflow = overflowAnterior;
    if (origen) origen.focus();
  };

  lightbox.cerrarVentana = cerrar;

  items.forEach((item) => {
    if (item.dataset.galeriaListo === "true") return;
    item.dataset.galeriaListo = "true";
    item.addEventListener("click", () => abrir(item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir(item);
      }
    });
  });

  lightbox.querySelectorAll("[data-lightbox-cerrar]").forEach((elemento) => {
    if (elemento.dataset.lightboxListo === "true") return;
    elemento.dataset.lightboxListo = "true";
    elemento.addEventListener("click", cerrar);
  });

  if (lightbox.dataset.tecladoListo !== "true") {
    lightbox.dataset.tecladoListo = "true";
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") lightbox.cerrarVentana();
    });
  }
}

configurarGaleriaVentanas();

function configurarServiciosExpandibles() {
  const vistas = [...document.querySelectorAll("[data-servicio]")];
  const botones = [...document.querySelectorAll("[data-servicio-boton]")];
  if (!vistas.length || !botones.length) return;

  const seleccionar = (id) => {
    vistas.forEach((vista) => {
      vista.classList.toggle("activa", vista.dataset.servicio === id);
    });

    botones.forEach((boton) => {
      const activo = boton.dataset.servicioBoton === id;
      boton.classList.toggle("activo", activo);
      boton.setAttribute("aria-pressed", String(activo));
    });
  };

  botones.forEach((boton) => {
    if (boton.dataset.servicioListo === "true") return;
    boton.dataset.servicioListo = "true";
    boton.addEventListener("click", () => seleccionar(boton.dataset.servicioBoton));
  });
}

configurarServiciosExpandibles();

function configurarFormularioCotizacion() {
  const formulario = document.getElementById("formularioCotizacion");
  if (!formulario) return;

  const campos = [...formulario.querySelectorAll("[data-campo]")];
  const estado = formulario.querySelector(".estado-formulario");
  if (!estado) return;

  const reglas = {
    nombre: (valor) => {
      const texto = valor.trim();
      if (texto.length < 2) {
        return "Ingresa tu nombre (mínimo 2 letras).";
      }
      return (
        /^[\p{L}]+(?:[ ][\p{L}]+)*$/u.test(texto) ||
        "El nombre debe contener solo letras."
      );
    },
    correo: (valor) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ||
      "Ingresa un correo válido.",
    empresa: () => true,
    servicio: (valor) => valor !== "" || "Selecciona un servicio.",
    mensaje: (valor) =>
      valor.trim().length >= 10 ||
      "Cuéntanos un poco más (mínimo 10 caracteres).",
  };

  const validarCampo = (campo) => {
    const nombre = campo.dataset.campo;
    const regla = reglas[nombre];
    if (!regla) return true;

    const mensaje = regla(campo.value);
    const valido = mensaje === true;
    const error = formulario.querySelector(`[data-error="${nombre}"]`);

    if (error) error.textContent = valido ? "" : mensaje;
    campo.setAttribute("aria-invalid", String(!valido));
    return valido;
  };

  campos.forEach((campo) => {
    if (campo.dataset.validacionListo === "true") return;
    campo.dataset.validacionListo = "true";
    campo.addEventListener("blur", () => validarCampo(campo));
    campo.addEventListener("input", () => {
      if (campo.dataset.campo === "nombre") {
        campo.value = campo.value.replace(/[^\p{L} ]/gu, "").replace(/ {2,}/g, " ");
      }
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
    campo.addEventListener("change", () => validarCampo(campo));
  });

  if (formulario.dataset.envioListo === "true") return;
  formulario.dataset.envioListo = "true";

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    estado.textContent = "";
    estado.classList.remove("exito");

    let primeroInvalido = null;
    campos.forEach((campo) => {
      const valido = validarCampo(campo);
      if (!valido && !primeroInvalido) primeroInvalido = campo;
    });

    if (primeroInvalido) {
      primeroInvalido.focus();
      return;
    }

    const datos = new FormData(formulario);
    const nombre = String(datos.get("nombre") || "").trim();
    const correo = String(datos.get("correo") || "").trim();
    const empresa = String(datos.get("empresa") || "").trim();
    const servicio = String(datos.get("servicio") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    const asunto = `Cotización de proyecto - ${nombre}`;
    const cuerpo = [
      "Hola Upper Creators:",
      "",
      "Quiero solicitar una cotización para un proyecto.",
      "",
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Empresa: ${empresa || "No indicada"}`,
      `Servicio de interés: ${servicio}`,
      "",
      "Detalles del proyecto:",
      mensaje,
    ].join("\n");

    const mailto = `mailto:Rroman@uppercreators.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    estado.textContent =
      "Datos válidos. Se abrió tu correo para enviar la cotización.";
    estado.classList.add("exito");
    window.location.href = mailto;
  });
}

configurarFormularioCotizacion();

const configurarAcordeonFAQ = () => {
  document.addEventListener(
    "toggle",
    (event) => {
      const faq = event.target;
      if (faq.tagName !== "DETAILS" || !faq.open) return;
      if (!faq.classList.contains("faq-item")) return;

      const lista = faq.closest(".lista-faq");
      if (!lista) return;

      lista.querySelectorAll("details.faq-item[open]").forEach((otro) => {
        if (otro !== faq) otro.open = false;
      });
    },
    true
  );
};

configurarAcordeonFAQ();

function configurarVideosContenido() {
  const videos = [...document.querySelectorAll("main video:not(.video-fondo)")];
  if (!videos.length) return;

  if (window.observadorVideosContenido) window.observadorVideosContenido.disconnect();

  const obtenerContenedor = (video) =>
    video.closest(".video-card-sm, .columna-video-corp");

  const detener = (video) => {
    video.pause();
    video.muted = true;
    video.dataset.activo = "false";
    const contenedor = obtenerContenedor(video);
    if (contenedor) contenedor.classList.remove("video-playing");
  };

  const reproducir = (video) => {
    const intento = video.play();
    if (intento && typeof intento.catch === "function") intento.catch(() => {});
    const contenedor = obtenerContenedor(video);
    if (contenedor) contenedor.classList.add("video-playing");
  };

  videos.forEach((video) => {
    if (video.dataset.videoAutoListo === "true") return;
    video.dataset.videoAutoListo = "true";
    video.dataset.activo = "false";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    video.addEventListener("click", () => {
      if (!video.muted) {
        detener(video);
        return;
      }

      document
        .querySelectorAll('main video[data-activo="true"]')
        .forEach((otro) => {
          if (otro !== video) detener(otro);
        });

      video.muted = false;
      video.dataset.activo = "true";
      reproducir(video);
    });
  });

  if ("IntersectionObserver" in window) {
    window.observadorVideosContenido = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) reproducir(entrada.target);
          else detener(entrada.target);
        });
      },
      { threshold: 0.35 }
    );
    videos.forEach((video) => window.observadorVideosContenido.observe(video));
  } else {
    videos.forEach((video) => reproducir(video));
  }

  if (window.visibilidadVideosListo !== true) {
    window.visibilidadVideosListo = true;
    document.addEventListener("visibilitychange", () => {
      const visibles = [
        ...document.querySelectorAll("main video:not(.video-fondo)"),
      ];

      if (document.hidden) {
        visibles.forEach((video) => video.pause());
      } else {
        visibles.forEach((video) => {
          const rect = video.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) reproducir(video);
        });
      }
    });
  }
}

configurarVideosContenido();

const preseleccionarServicio = () => {
  const parametros = new URLSearchParams(window.location.search);
  const servicio = parametros.get("servicio");
  if (!servicio) return;

  const servicios = {
    marketing: "Marketing digital y gestión de redes sociales",
    diseno: "Diseño gráfico e identidad visual",
    produccion: "Producción audiovisual y fotografía",
    comunicacion: "Comunicación y relaciones públicas",
  };
  const selector = document.querySelector("#formularioCotizacion [data-campo='servicio']");

  if (selector && servicios[servicio]) {
    selector.value = servicios[servicio];
  }
};

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

    // 3. VIDEO DESTACADO (AUTOPLAY GARANTIZADO EN MÓVIL Y DESKTOP)
    const videoHero = document.querySelector(".video-fondo");

    if (videoHero) {
        let heroVisible = true;

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
                        heroVisible = entrada.isIntersecting;
                        if (heroVisible) {
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
            if (document.hidden || !heroVisible) {
                videoHero.pause();
            } else {
                reproducirHero();
            }
        });
    }

    configurarVideosContenido();

    // 5. OPTIMIZACIÓN DE MARQUESINAS (CSS Nativo)
    // Hemos eliminado el código JS de Drag & Drop para las marquesinas.
    // Esto permite que el scroll vertical en móviles sea 100% fluido
    // y evita que el cursor cambie a "manito" de arrastre.

    const configurarHeaderGalería = () => {
        const header = document.querySelector(".uc-header");
        if (!header) return;

        const cards = Array.from(header.querySelectorAll(".uc-card"));
        if (!cards.length) return;

        const setActiveCard = (targetCard) => {
            cards.forEach((card) => {
                const activa = card === targetCard;
                card.classList.toggle("is-active", activa);
                if (activa) {
                    card.setAttribute("aria-current", "true");
                } else {
                    card.removeAttribute("aria-current");
                }
            });
        };

        cards.forEach((card) => {
            card.addEventListener("click", (event) => {
                if (event.target.closest("a")) return;
                if (!card.classList.contains("is-active")) {
                    setActiveCard(card);
                }
            });
        });

        header.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            const currentIndex = cards.findIndex((card) => card.classList.contains("is-active"));
            const step = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (currentIndex + step + cards.length) % cards.length;
            setActiveCard(cards[nextIndex]);
        });
    };

    configurarHeaderGalería();

    preseleccionarServicio();

    console.log("Sitio cargado: Marquesinas configuradas con CSS nativo para mayor fluidez.");
});