const audio = new Audio();

const elements = {
  fileInput: document.getElementById("fileInput"),
  playlist: document.getElementById("playlist"),
  playBtn: document.getElementById("play"),
  nextBtn: document.getElementById("next"),
  prevBtn: document.getElementById("prev"),
  title: document.getElementById("title"),
  current: document.getElementById("current"),
  duration: document.getElementById("duration"),
  progress: document.getElementById("progress"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
};

const player = {
  playlist: [],
  index: 0,
  playing: false,
  dragIndex: null,

  init() {
    this.events();
  },

  events() {
    elements.fileInput.addEventListener("change", (e) => this.loadFiles(e));

    elements.playBtn.onclick = () => this.togglePlay();
    elements.nextBtn.onclick = () => this.next();
    elements.prevBtn.onclick = () => this.prev();

    elements.progress.addEventListener("input", () => this.seek());

    elements.fullscreenBtn.onclick = () => this.fullscreen();

    audio.addEventListener("timeupdate", () => this.updateProgress());

    audio.addEventListener("loadedmetadata", () => {
      elements.duration.textContent = this.format(audio.duration);
    });

    audio.addEventListener("ended", () => this.next());
  },

  loadFiles(e) {
    const files = [...e.target.files];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);

      this.playlist.push({
        title: file.name,
        src: url,
      });
    });

    this.render();

    if (this.playlist.length) {
      this.index = 0;
      this.load(0);
      this.play();
    }
  },

  render() {
    elements.playlist.innerHTML = "";

    this.playlist.forEach((song, i) => {
      const li = document.createElement("li");

      li.draggable = true;

      li.innerHTML = `
${song.title}
<span class="delete">✖</span>
`;

      if (i === this.index) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        this.index = i;
        this.load(i);
        this.play();
      });

      const deleteBtn = li.querySelector(".delete");

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        URL.revokeObjectURL(this.playlist[i].src);

        this.playlist.splice(i, 1);

        if (this.index >= this.playlist.length) {
          this.index = this.playlist.length - 1;
        }

        this.render();
      });

      li.addEventListener("dragstart", () => {
        this.dragIndex = i;
      });

      li.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      li.addEventListener("drop", () => {
        const item = this.playlist.splice(this.dragIndex, 1)[0];

        this.playlist.splice(i, 0, item);

        this.render();
      });

      elements.playlist.appendChild(li);
    });
  },

  load(i) {
    audio.src = this.playlist[i].src;
    elements.title.textContent = this.playlist[i].title;
    elements.progress.value = 0;
    elements.current.textContent = "0:00";

    this.render();
  },

  play() {
    audio.play();
    this.playing = true;
    elements.playBtn.textContent = "⏸";
  },

  pause() {
    audio.pause();
    this.playing = false;
    elements.playBtn.textContent = "▶";
  },

  togglePlay() {
    this.playing ? this.pause() : this.play();
  },

  next() {
    this.index = (this.index + 1) % this.playlist.length;
    this.load(this.index);
    this.play();
  },

  prev() {
    this.index = (this.index - 1 + this.playlist.length) % this.playlist.length;
    this.load(this.index);
    this.play();
  },

  seek() {
    audio.currentTime = (elements.progress.value / 100) * audio.duration;
  },

  updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    elements.progress.value = percent;

    elements.current.textContent = this.format(audio.currentTime);
  },

  format(t) {
    if (!t) return "0:00";

    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");

    return `${m}:${s}`;
  },

  fullscreen() {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  },
};

player.init();

function fixHeight() {
  document.body.style.height = window.innerHeight + "px";
}

window.addEventListener("resize", fixHeight);
window.addEventListener("orientationchange", fixHeight);

fixHeight();
