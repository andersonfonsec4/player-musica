/* =========================
   ELEMENTOS
========================= */

const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const upload = document.getElementById("upload");

const playlistUI = document.getElementById("playlist");

const visualizer = document.getElementById("visualizer");

const ctx = visualizer.getContext("2d");

visualizer.width = 460;
visualizer.height = 160;

/* =========================
   VARIÁVEIS
========================= */

let playlist = [];
let index = 0;
let isPlaying = false;

let audioContext;
let analyser;
let source;
let dataArray;

/* =========================
   FORMATO TEMPO
========================= */

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);

  return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

/* =========================
   CARREGAR MÚSICA
========================= */

function loadMusic(i) {
  const track = playlist[i];

  audio.src = track.url;

  title.textContent = track.title;
  artist.textContent = track.artist;

  document
    .querySelectorAll(".playlist li")
    .forEach((li) => li.classList.remove("active"));
  document.querySelectorAll(".playlist li")[i]?.classList.add("active");
}

/* =========================
   PLAY
========================= */

function playMusic() {
  audio.play();

  playBtn.textContent = "⏸";

  isPlaying = true;
}

/* =========================
   PAUSE
========================= */

function pauseMusic() {
  audio.pause();

  playBtn.textContent = "▶";

  isPlaying = false;
}

/* =========================
   CONTROLES
========================= */

playBtn.onclick = () => {
  if (isPlaying) pauseMusic();
  else playMusic();
};

nextBtn.onclick = () => {
  index++;

  if (index >= playlist.length) index = 0;

  loadMusic(index);
  playMusic();
};

prevBtn.onclick = () => {
  index--;

  if (index < 0) index = playlist.length - 1;

  loadMusic(index);
  playMusic();
};

/* =========================
   TEMPO
========================= */

audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;

  progress.style.width = progressPercent + "%";

  current.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

/* =========================
   CLIQUE PROGRESSO
========================= */

progressContainer.onclick = (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;

  audio.currentTime = (clickX / width) * audio.duration;
};

/* =========================
   AUTO NEXT
========================= */

audio.onended = () => {
  nextBtn.click();
};

/* =========================
   PLAYLIST UI
========================= */

function renderPlaylist() {
  playlistUI.innerHTML = "";

  playlist.forEach((song, i) => {
    const li = document.createElement("li");

    li.draggable = true;

    li.innerHTML = `
<div class="song-cover">~</div>
<span>${song.title}</span>
`;

    li.onclick = () => {
      index = i;

      loadMusic(index);
      playMusic();
    };

    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    playlistUI.appendChild(li);
  });
}

/* =========================
   DRAG PLAYLIST
========================= */

playlistUI.addEventListener("dragover", (e) => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");

  const after = [...playlistUI.querySelectorAll("li:not(.dragging)")];

  const next = after.find((li) => {
    return e.clientY <= li.offsetTop + li.offsetHeight / 2;
  });

  playlistUI.insertBefore(dragging, next);
});

/* =========================
   UPLOAD MÚSICAS
========================= */

upload.onchange = (e) => {
  const files = [...e.target.files];

  files.forEach((file) => {
    const url = URL.createObjectURL(file);

    const song = {
      url,
      title: file.name,
      artist: "Desconhecido",
    };

    playlist.push(song);
  });

  renderPlaylist();

  if (playlist.length && !isPlaying) {
    loadMusic(0);
    playMusic();
  }
};

/* =========================
   FULLSCREEN
========================= */

document.getElementById("fullscreen").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

/* =========================
   VISUALIZER
========================= */

function initAudio() {
  audioContext = new AudioContext();

  analyser = audioContext.createAnalyser();

  source = audioContext.createMediaElementSource(audio);

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;

  dataArray = new Uint8Array(bufferLength);

  draw();
}

audio.onplay = () => {
  if (!audioContext) {
    initAudio();
  }
};

/* =========================
   DESENHAR ONDAS
========================= */

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, visualizer.width, visualizer.height);

  let barWidth = 4;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    let barHeight = dataArray[i] / 2;

    ctx.fillStyle = "#0078D4";

    ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

/* =========================
   PARTICULAS
========================= */

const particleCanvas = document.getElementById("particles");
const pctx = particleCanvas.getContext("2d");

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    r: Math.random() * 2,
  });
}

function drawParticles() {
  pctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  pctx.fillStyle = "#0078D4";

  particles.forEach((p) => {
    pctx.beginPath();

    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

    pctx.fill();

    p.y -= 0.2;

    if (p.y < 0) {
      p.y = particleCanvas.height;
    }
  });

  requestAnimationFrame(drawParticles);
}

drawParticles();
