//SCRIPT CORPORATIVO - 3 COLUMNAS
document.addEventListener("DOMContentLoaded", function () {
  const gridVideos = document.getElementById("gridVideos");

  // Videos corporativos (puedes cambiar rutas)
  const videosCorporativos = [
    "/assets/video/corportaivo/Minina.mp4",
    "/assets/video/corportaivo/Trident 1.mp4",
    "/assets/video/corportaivo/Truck Fest.mp4",
    "/assets/video/corportaivo/Andes Maq Evento .mp4",
    "/assets/video/corportaivo/EPYSA.mp4",
    "/assets/video/corportaivo/Galaxi .mp4",
    // "assets/video/corportaivo",
  ].filter(Boolean);

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
    const overlay = item.querySelector(".play-overlay");

    // Mostrar frame del segundo 1
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = 1;
    });

    // Click reproducir/pausar
    item.addEventListener("click", () => {
      if (video.paused) {
        item.classList.add("video-playing");
        video.currentTime = 0;
        video.play();
      } else {
        item.classList.remove("video-playing");
        video.pause();
        video.currentTime = 1;
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
