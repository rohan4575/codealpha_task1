const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const shuffleButton = document.getElementById('shuffle');
const replayButton = document.getElementById('replay');
const songProgress = document.getElementById('song-progress');
const volumeControl = document.getElementById('volume');
const currentSongElement = document.getElementById('song-title');
const artistElement = document.getElementById('artist-name');
const currentTimeElement = document.getElementById('current-time');
const remainingTimeElement = document.getElementById('remaining-time');

let isShuffle = false;
let isReplay = false;

// Song Playlist
const playlist = [
    { src: 'h.mp3', title: 'Song One', artist: 'Artist One' },
    { src: 'i.mp3', title: 'Song Two', artist: 'Artist Two' }
];

let currentSongIndex = 0;

const loadSong = (index) => {
    const song = playlist[index];
    audio.src = song.src;
    currentSongElement.textContent = song.title;
    artistElement.textContent = song.artist;
    audio.load();
};

const updateProgress = () => {
    if (!audio.duration || isNaN(audio.duration)) return; // Fix NaN issue

    const currentTime = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    const remainingTime = duration - currentTime;

    // Current Time Formatting
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = currentTime % 60;
    currentTimeElement.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

    // Remaining Time Formatting
    if (!isNaN(remainingTime)) {
        const remainingMinutes = Math.floor(remainingTime / 60);
        const remainingSeconds = remainingTime % 60;
        remainingTimeElement.textContent = `-${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    } else {
        remainingTimeElement.textContent = "-0:00";
    }

    const progress = (audio.currentTime / audio.duration) * 100;
    songProgress.value = progress;
};

const playSong = () => {
    audio.play();
    playPauseButton.innerHTML = '&#x23F8;'; // Pause icon
};

const pauseSong = () => {
    audio.pause();
    playPauseButton.innerHTML = '&#x23EF;'; // Play icon
};

playPauseButton.addEventListener('click', function() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevButton.addEventListener('click', function() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
});

nextButton.addEventListener('click', function() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
});

shuffleButton.addEventListener('click', function() {
    isShuffle = !isShuffle;
    shuffleButton.style.backgroundColor = isShuffle ? '#9932cc' : '#4b0082';
});

replayButton.addEventListener('click', function() {
    isReplay = !isReplay;
    replayButton.style.backgroundColor = isReplay ? '#9932cc' : '#4b0082';
});

audio.addEventListener('timeupdate', updateProgress);

songProgress.addEventListener('input', function() {
    audio.currentTime = (songProgress.value / 100) * audio.duration;
});

volumeControl.addEventListener('input', function() {
    audio.volume = this.value;
});

audio.addEventListener('ended', function() {
    if (isReplay) {
        audio.currentTime = 0;
        playSong();
    } else if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
        loadSong(currentSongIndex);
        playSong();
    } else {
        nextButton.click();
    }
});

// Load first song initially
loadSong(currentSongIndex);
