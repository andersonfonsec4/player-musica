<<<<<<< HEAD
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

      li.innerHTML = `${song.title}<span class="delete">✖</span>`;

      if (i === this.index) li.classList.add("active");

      li.addEventListener("click", () => {
        this.index = i;
        this.load(i);
        this.play();
      });

      li.querySelector(".delete").addEventListener("click", (e) => {
        e.stopPropagation();

        URL.revokeObjectURL(this.playlist[i].src);

        this.playlist.splice(i, 1);

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
=======
const audio = new Audio()

const playlistUI = document.getElementById("playlist")
const title = document.getElementById("title")
const current = document.getElementById("current")
const duration = document.getElementById("duration")

const progress = document.getElementById("progress")
const progressContainer = document.querySelector(".progress-container")

const playBtn = document.getElementById("play")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")

const fileInput = document.getElementById("fileInput")
const fullscreenBtn = document.getElementById("fullscreenBtn")

let playlist = []
let index = 0


/* ---------------- PLAYLIST ---------------- */

function savePlaylist(){

localStorage.setItem("wavetune_playlist",
JSON.stringify(playlist.map(s => ({title:s.title})))
)

}

function renderPlaylist(){

playlistUI.innerHTML=""

playlist.forEach((song,i)=>{

const li=document.createElement("li")

li.textContent=song.title

li.draggable=true

if(i===index){
li.classList.add("active")
}


/* tocar musica */

li.onclick=()=>{

index=i
loadMusic(index)
playMusic()

}


/* excluir musica */

li.ondblclick=()=>{

if(confirm("Excluir música da playlist?")){

playlist.splice(i,1)

if(index>=playlist.length){
index=playlist.length-1
}

renderPlaylist()
savePlaylist()

}

}


/* drag start */

li.addEventListener("dragstart",()=>{

li.classList.add("dragging")

})


/* drag end */

li.addEventListener("dragend",()=>{

li.classList.remove("dragging")

})


playlistUI.appendChild(li)

})

}


/* drag reorder */

playlistUI.addEventListener("dragover",(e)=>{

e.preventDefault()

const dragging=document.querySelector(".dragging")

const afterElement=getDragAfterElement(playlistUI,e.clientY)

if(afterElement==null){

playlistUI.appendChild(dragging)

}else{

playlistUI.insertBefore(dragging,afterElement)

}

})


function getDragAfterElement(container,y){

const elements=[...container.querySelectorAll("li:not(.dragging)")]

return elements.reduce((closest,child)=>{

const box=child.getBoundingClientRect()

const offset=y-box.top-box.height/2

if(offset<0 && offset>closest.offset){

return{offset:offset,element:child}

}else{

return closest

}

},{offset:Number.NEGATIVE_INFINITY}).element

}


/* ---------------- AUDIO ---------------- */

function loadMusic(i){

if(!playlist[i]) return

audio.src=playlist[i].src
title.textContent=playlist[i].title

renderPlaylist()

}


function playMusic(){

audio.play()
playBtn.textContent="⏸"

}


function pauseMusic(){

audio.pause()
playBtn.textContent="▶"

}


playBtn.onclick=()=>{

if(audio.paused){
playMusic()
}else{
pauseMusic()
}

}


/* NEXT */

nextBtn.onclick=()=>{

index++

if(index>=playlist.length) index=0

loadMusic(index)
playMusic()

}


/* PREV */

prevBtn.onclick=()=>{

index--

if(index<0) index=playlist.length-1

loadMusic(index)
playMusic()

}


/* ---------------- FILE INPUT ---------------- */

fileInput.addEventListener("change",(e)=>{

const files=[...e.target.files]

files.forEach(file=>{

playlist.push({

title:file.name,
src:URL.createObjectURL(file)

})

})

renderPlaylist()
savePlaylist()

if(playlist.length && !audio.src){

loadMusic(0)
playMusic()

}

})


/* ---------------- TIME ---------------- */

audio.addEventListener("timeupdate",()=>{

const percent=(audio.currentTime/audio.duration)*100

progress.style.width=percent+"%"

current.textContent=formatTime(audio.currentTime)
duration.textContent=formatTime(audio.duration)

})


function formatTime(time){

if(isNaN(time)) return "0:00"

const min=Math.floor(time/60)
const sec=Math.floor(time%60)

return `${min}:${sec<10?"0":""}${sec}`

}


/* SEEK */

progressContainer.onclick=(e)=>{

const width=progressContainer.clientWidth
const click=e.offsetX

audio.currentTime=(click/width)*audio.duration

}


/* AUTO NEXT */

audio.addEventListener("ended",()=>{

index++

if(index>=playlist.length) index=0

loadMusic(index)
playMusic()

})


/* ---------------- FULLSCREEN ---------------- */

fullscreenBtn.onclick=()=>{

if(!document.fullscreenElement){

document.documentElement.requestFullscreen()

}else{

document.exitFullscreen()

}

}
if ("serviceWorker" in navigator) {

navigator.serviceWorker.register("sw.js")

}
>>>>>>> 708a93a8cac53781fd5b083496c818b04f116ccf
