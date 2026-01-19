document.addEventListener("DOMContentLoaded", function () {
  const gridVideos = document.getElementById("gridVideos");

  const videos = [
    "assets/video/Redes_Sociales/¿A quién más le pasa esto _Es que cuando abro un Bon o Bon ¡todos quieren! Así que silencio   el que come callado come dos veces.mp4",
    "assets/video/Redes_Sociales/AUDAX E IVECO - V3 - UPPER.mp4",
    "assets/video/Redes_Sociales/BonoBon.mp4",
    "assets/video/Redes_Sociales/Churu cierre.mp4",
    "assets/video/Redes_Sociales/Cuando Selz llega a la junta, todo es mejor   _.mp4",
    "assets/video/Redes_Sociales/Descubre Fan, donde tu historia de hogar comienza con una sorpresa- ¡Fai te regala 18 millones de pie!   _Convierte cada rincón en un tesoro de recuerdos, desata tu creatividad y deja que tu primer hogar sea de .mp4",
    "assets/video/Redes_Sociales/Eucerin1.mp4",
    "assets/video/Redes_Sociales/KAMPAI (1).mp4",
    "assets/video/Redes_Sociales/Kampai.mp4",
    "assets/video/Redes_Sociales/La habitación es un lugar de reflexión, estudio y tranquilidad. _Integra detalles que transmiten armonía y juega con la luz para generar más amplitud en el cuarto.  _Sobre todo para los pequeños de la casa, es i.mp4",
    "assets/video/Redes_Sociales/Maratón 1.mp4",
    "assets/video/Redes_Sociales/Montana_3.mov",
    "assets/video/Redes_Sociales/No te desenfoques y tu sueño se hará realidad  _ (1).mp4",
    "assets/video/Redes_Sociales/novios.mp4",
    "assets/video/Redes_Sociales/Suerox.mp4",
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
