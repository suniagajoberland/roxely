document.addEventListener("DOMContentLoaded", function () {
  const gridVideos = document.getElementById("gridVideos");

  const videos = [
    "assets/video/Redes_Sociales/Alto Japón 1.mp4",
    "assets/video/Redes_Sociales/Alto Japón 2.mp4",
    "assets/video/Redes_Sociales/Alto Japon 3.mp4",
    "assets/video/Redes_Sociales/Atelier Milano .mp4",
    "assets/video/Redes_Sociales/Bon O Bon 4.mp4",
    "assets/video/Redes_Sociales/Churu despedida.mp4",
    "assets/video/Redes_Sociales/Copas Bon O Bon.mp4",
    "assets/video/Redes_Sociales/Fai 1.mp4",
    "assets/video/Redes_Sociales/Fai 2.mp4",
    "assets/video/Redes_Sociales/Selz .mp4",
    "assets/video/Redes_Sociales/selz 2.mp4",
    "assets/video/Redes_Sociales/Suerox .mp4",
    "assets/video/Redes_Sociales/Triden 3.mp4",
    "assets/video/Redes_Sociales/Trident RRSS.mp4",
    "assets/video/Redes_Sociales/Yincana Bon.mp4",
    // "assets/video/Redes_Sociales/",
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
            <!-- ✅ FRAME DEL SEGUNDO 1 del video real -->
            <video preload="metadata" loop playsinline>
              <source src="${src}" type="video/mp4">
            </video>
          `;

    const video = item.querySelector("video");

    // ✅ MOSTRAR FRAME DEL SEGUNDO 1
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 1; // Frame del segundo 1 (más representativo)
    });

    // CLICK: reproducir el seleccionado y pausar el anterior
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

  // CARGAR TODOS AUTOMÁTICO
  function cargarTodosVideos() {
    if (!gridVideos) return;
    gridVideos.innerHTML = "";

    videos.forEach((src, index) => {
      setTimeout(() => crearVideoItem(src), index * 100);
    });
  }

  setTimeout(cargarTodosVideos, 500);
});
