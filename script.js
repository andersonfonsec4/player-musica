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