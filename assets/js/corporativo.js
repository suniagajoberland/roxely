//SCRIPT CORPORATIVO - 3 COLUMNAS
document.addEventListener("DOMContentLoaded", function () {
  const gridVideos = document.getElementById("gridVideos");

  // Videos corporativos (puedes cambiar rutas)
  const videosCorporativos = [
    "assets/video/corportaivo/Minina.mp4",
    "assets/video/corportaivo/Trident 1.mp4",
    "assets/video/corportaivo/Truck Fest.mp4",
    "assets/video/corportaivo/Andes Maq Evento .mp4",
    "assets/video/corportaivo/EPYSA.mp4",
    "assets/video/corportaivo/Galaxi .mp4",
    // "assets/video/corportaivo",
  ].filter(Boolean);

  // Solo un video puede reproducirse a la vez
  let videoActivo = null;

  function pausarVideoActivo() {
    if (!videoActivo) return;
    videoActivo.pause();
    videoActivo.currentTime = 1;
    const itemAnterior = videoActivo.closest(".video-item");
    if (itemAnterior) itemAnterior.classList.remove("video-playing");
    videoActivo = null;
  }

  function crearVideoItem(src) {
    if (!gridVideos) return;

    const item = document.createElement("div");
    item.className = "video-item";

    item.innerHTML = `
            <div class="play-overlay">
              <div class="play-icon"><i class="fas fa-play"></i></div>
            </div>
            <video preload="metadata" loop playsinline>
              <source src="${src}" type="video/mp4">
            </video>
          `;

    const video = item.querySelector("video");

    // Mostrar frame del segundo 1
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 1;
    });

    // Click: reproducir el seleccionado y pausar el anterior
    item.addEventListener("click", () => {
      if (videoActivo === video && !video.paused) {
        // Volver a hacer click en el mismo video lo pausa
        pausarVideoActivo();
        return;
      }

      pausarVideoActivo();

      videoActivo = video;
      item.classList.add("video-playing");
      video.currentTime = 0;
      const intento = video.play();
      if (intento && typeof intento.catch === "function") {
        intento.catch(() => {});
      }
    });

    gridVideos.appendChild(item);
  }

  // Cargar todos automático - OPTIMO para 3 columnas
  function cargarTodosVideos() {
    if (!gridVideos) return;
    gridVideos.innerHTML = "";

    videosCorporativos.forEach((src, index) => {
      setTimeout(() => crearVideoItem(src), index * 80);
    });
  }

  setTimeout(cargarTodosVideos, 500);
});
