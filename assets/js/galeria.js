document.addEventListener("DOMContentLoaded", function () {
  const gridVideos = document.getElementById("gridVideos");

  const videos = [
    "/assets/video/Redes_Sociales/Alto Japón 1.mp4",
    "/assets/video/Redes_Sociales/Alto Japón 2.mp4",
    "/assets/video/Redes_Sociales/Alto Japon 3.mp4",
    "/assets/video/Redes_Sociales/Atelier Milano .mp4",
    "/assets/video/Redes_Sociales/Bon O Bon 4.mp4",
    "/assets/video/Redes_Sociales/Churu despedida.mp4",
    "/assets/video/Redes_Sociales",
    // "assets/video/Redes_Sociales/",
  ].filter(Boolean);

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
    const overlay = item.querySelector(".play-overlay");

    // ✅ MOSTRAR FRAME DEL SEGUNDO 1
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 1; // Frame del segundo 1 (más representativo)
    });

    // CLICK PARA REPRODUCIR/PAUSAR
    item.addEventListener("click", () => {
      if (video.paused) {
        // Reproducir desde inicio
        item.classList.add("video-playing");
        video.currentTime = 0;
        video.play();
      } else {
        // Pausar y volver a frame representativo
        item.classList.remove("video-playing");
        video.pause();
        video.currentTime = 1;
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
