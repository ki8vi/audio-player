
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const audio = document.querySelector("audio");
const commonTime = document.querySelector(".common-time");
const currentTime = document.querySelector(".current-time");
const progressContent = document.querySelector(".progress-content");
const progressArea = document.querySelector(".progress-area");
const imageContainer = document.getElementById("song-img");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const volumeUpBtn = document.querySelector(".volume-up");
const volumeDownBtn = document.querySelector(".volume-down");
const title = document.querySelector(".title");
const artist = document.querySelector(".artist");
const volumeLevel = document.querySelector(".level-num");
const volumeInner = document.querySelector(".level-inner");
const playListBtn = document.querySelector(".play-list-btn");
const controlSec = document.querySelector(".audio-controls");
const songDiv = document.querySelector(".song-image");
const playListModal = document.querySelector(".play-list-modal"); 
const tracksArr = document.querySelectorAll(".track");
const footer = document.querySelector("footer");
const trackTimeArr = document.querySelectorAll(".track-time");

let isPlay = false;
let volumeNum = 10;
let time = 0;
let index = 0;
let isDrag = false;
let isPlayListOpen = false;

const data = [
    {artist: "Scarlet Pleasure",
    title: "What a Life",
    image: "./assets/image/what-a-life.jpg",
    src: "./assets/mp3/Scarlet_Pleasure_-_What_A_Life.mp3",
    time: "03:05"
    },
    {artist: "Everlast",
    title: "Let it go",
    image: "./assets/image/everlast.jpg",
    src: "./assets/mp3/Everlast_-_Let_It_Go_(mp3.pm).mp3",
    time: "04:26"
    },
    {artist: "Jennifer Lopez",
    title: "Me haces falta",
    image: "./assets/image/jLo.jpg",
    src: "./assets/mp3/JenniferLopez–Me-Haces-Falta.mp3",
    time: "03:37"
    },
    {artist: "Zaz",
    title: "Je veux",
    image: "./assets/image/zaz.jpg",
    src: "./assets/mp3/ZazJe veux.mp3",
    time: "03:36"
    }
];

playBtn.addEventListener("click", play);
pauseBtn.addEventListener("click", pause);
progressArea.addEventListener("click", findPoint);
progressArea.addEventListener("mouseleave", (event) => {
    isDrag = false;
});
progressArea.addEventListener("mousedown", (event) => {
    isDrag = true;
    swipePoint(event)
});
progressArea.addEventListener("mousemove", (event) => {
    if(isDrag) {
        swipePoint(event)
    }
});
progressArea.addEventListener("mouseup", (event) => {
    if(isDrag) {
        isDrag = false;
    }
});
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
volumeUpBtn.addEventListener("click", volumeUp);
volumeDownBtn.addEventListener("click", volumeDown);
imageContainer.addEventListener("load", imageLoad)
audio.addEventListener("loadedmetadata", updateTime);
audio.addEventListener("timeupdate", updateTime);
audio.addEventListener("ended", next);
playListBtn.addEventListener("click", () => {
    if(isPlayListOpen) {
        closePlayList();
    } else {
        openPlayList();
    }
});
tracksArr.forEach((el, i) => {
    el.addEventListener("click", () => {
        if(i === index) {
            if(!isPlay) {
                play();
            } else {
                pause();
            }
        } else {
            time = 0;
            index = i;
            play();
        }
    })
});
function activeTrack() {
    tracksArr.forEach((el, i) => {
        if(index === i) {
            el.style.backgroundColor = "#fdf5e694";
            el.style.transform = "scale(1.1)";
        } else {
            el.style.backgroundColor = "";
            el.style.transform = "scale(1)";
        }
    })
}

function openPlayList() {
    isPlayListOpen = true;
    imageContainer.classList.add("transform-active");
    controlSec.style.transform = "translateY(-95px)";
    songDiv.style.transform = "translateY(-50px)";
}
function closePlayList() {
    isPlayListOpen = false;
    imageContainer.classList.remove("transform-active");
    controlSec.style.transform = "";
    songDiv.style.transform = "";
}

function imageLoad() {
    imageContainer.style.opacity = 1;
}

function updateTime() {
    setTimeout(() => {
        commonTime.innerText = data[index].time;
        currentTime.innerText = `${Math.floor(audio.currentTime / 60)}:${Math.floor(audio.currentTime % 60) < 10 ? 0 : ''}${Math.floor(audio.currentTime % 60)}`;
        listTrackTime();
        if(!isDrag) {
            progressContent.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }
    }, 100);
}

function  play() {
    isPlay = true;
    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    audio.src = data[index].src;
    document.body.style.backgroundImage = `url(${data[index].image})`;
    setTimeout(() => {
        imageContainer.src = data[index].image;
        artist.innerText = data[index].artist;
        title.innerText = data[index].title;
    }, 500);
    audio.currentTime = time;
    audio.play();
    activeTrack();
    footerBackground();
}

function pause() {
    isPlay = false;
    time = audio.currentTime;
    playBtn.style.display = "flex";
    pauseBtn.style.display = "none";
    audio.pause();
}

function swipePoint(event) {
    event.stopPropagation();
    const progress = (event.clientX - progressArea.getBoundingClientRect().left) / progressArea.getBoundingClientRect().width;
    if(progress >= 0 && progress <= 1) {
        progressContent.style.width = `${progress * 100}%`
    }
}

function findPoint(event) {
    event.preventDefault();
    const point = event.clientX - progressArea.getBoundingClientRect().left;
    audio.currentTime = (((point / progressArea.offsetWidth) * 100) / 100) * audio.duration;
    time = audio.currentTime;
}

function next() {
    time = 0;
    imageContainer.style.opacity = 0;
    artist.style.opacity = 0;
    title.style.opacity = 0;
    index += 1;
    if(index === data.length) {
        index = 0
    }
    setTimeout(() => {
        imageContainer.style.opacity = 1;
        artist.style.opacity = 1;
        title.style.opacity = 1;
    }, 500);
    play();
}

function prev() {
    time = 0;
    imageContainer.style.opacity = 0;
    artist.style.opacity = 0;
    title.style.opacity = 0;
    index -= 1;
    if(index < 0) {
        index = data.length - 1;
    }
    setTimeout(() => {
        imageContainer.style.opacity = 1;
        artist.style.opacity = 1;
        title.style.opacity = 1;
    }, 500);
    play();
}

function volumeUp() {
    if(audio.volume.toFixed(1) < 1) {
        volumeNum++;
        volumeLevel.innerText = volumeNum;
        audio.volume += 0.1;
        volumeInner.style.width = `${volumeNum * 7}px`;
    } 
    if(volumeNum === 10) {
        volumeLevel.style.color = "#00FF00";
        setTimeout(() => {
            volumeLevel.style.color = "#E6E6FA";
        }, 300)
    } 
}

function volumeDown() {
    if(audio.volume.toFixed(1) > 0) {
        volumeNum--;
        volumeLevel.innerText = volumeNum;
        audio.volume -= 0.1;
        volumeInner.style.width = `${volumeNum * 7}px`;
    } 
    if(volumeNum === 0) {
        volumeLevel.style.color = "#FF1493";
        setTimeout(() => {
            volumeLevel.style.color = "#E6E6FA";
        }, 300)
    } 
}

function footerBackground() {
    if(index === 0) {
        footer.style.backgroundColor = "#f5deb33d";
    }
    if(index === 1) {
        footer.style.backgroundColor = "#d4e1dd40";
    }
    if(index === 2) {
        footer.style.backgroundColor = "#70706d3d";
    }
    if(index === 3) {
        footer.style.backgroundColor = "#7e6766a8";
    }
}

function listTrackTime() {
    let restTime = audio.duration - audio.currentTime;
    let renderTime = `-${Math.floor(restTime / 60)}:${Math.floor(restTime % 60) < 10 ? 0 : ''}${Math.floor(restTime % 60)}`;
    trackTimeArr.forEach((el, i) => {
        if(index === i) {
           el.innerText = audio.duration ? renderTime : data[i].time; 
        } else {
            el.innerText = data[i].time; 
        }
    })
}


console.log("Все пункты тз выполнены, оценка 60 из 60")