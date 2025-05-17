document.addEventListener("DOMContentLoaded", function() {
    const rulesBox = document.querySelector('.rules-box');
    
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'rules-scroll-container';
    
    rulesBox.innerHTML = `
        <img src="assets/rulesbox.png" class="rulespng" draggable="false">
    `;
    rulesBox.appendChild(scrollContainer);
    
    const style = document.createElement('style');
    style.textContent = `
        .rules-box {
            position: absolute;
            width: 25.729vw;
            height: 23.796vh;
            overflow: hidden; /* Dışarı taşmayı engelle */
        }
        
        .rulespng {
            position: absolute;
            pointer-events: none; /* Resmin scrollu engellemesini önle */
            z-index: 1;
        }
        
        .rules-scroll-container {
            position: absolute;
            width: calc(100% - 1.458vw); /* Scroll çubuğu için boşluk */
            height: calc(100% - 2vh);
            top: 1vh;
            left: 0.729vw;
            overflow-y: auto;
            z-index: 2;
            padding-right: 0.5vw; /* Scroll çubuğu için boşluk */
        }
        
        /* Scroll çubuğu stilleri */
        .rules-scroll-container::-webkit-scrollbar {
            width: 0.3vw;
        }
        
        .rules-scroll-container::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 0.5vw;
        }
        
        .rule-item {
            margin-bottom: 6vh;
            position: relative;
        }
        
        .rule-title {
            font-size: 1.481vh;
            font-family: Akrobat Black;
            color: white;
            margin-bottom: 1.5vh;
        }
        
        .rule-desc {
            font-size: 0.625vw;
            font-family: Akrobat SemiBold;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    rulesConfig.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-item';
        ruleElement.innerHTML = `
            <p class="rule-title">${rule.title}</p>
            <p class="rule-desc">${rule.description}</p>
        `;
        scrollContainer.appendChild(ruleElement);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    serverUpdates.forEach(update => {
        if(document.querySelector(`.${update.titleClass}`)) {
            document.querySelector(`.${update.titleClass}`).textContent = update.title;
            document.querySelector(`.${update.descClass}`).textContent = update.description;
        }
        
        if(document.querySelector(`.${update.timeClass}`)) {
            document.querySelector(`.${update.timeClass}`).textContent = update.time;
            document.querySelector(`.${update.dateClass}`).textContent = update.date;
        }
    });
});document.addEventListener('DOMContentLoaded', function() {
    const mainMediaContainer = document.getElementById('main-media-container');
    const mainImage = document.getElementById('main-gallery-img');
    const mainVideo = document.getElementById('main-gallery-video');
    const thumbContainers = document.querySelectorAll('.thumb-container');
    const prevButton = document.querySelector('.previous');
    const nextButton = document.querySelector('.after');
    const items = galleryConfig.items;
    let currentIndex = 0;

    function getVideoIdFromUrl(url) {
        const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:.+)?/;
        const match = url.match(videoIdRegex);
        return match ? match[1] : null;
    }

    function updateGallery() {
        const currentItem = items[currentIndex];

        mainImage.classList.add('hidden');
        mainVideo.classList.add('hidden');
        mainVideo.innerHTML = '';

        if (currentItem.type === 'image') {
            mainImage.src = currentItem.src;
            mainImage.alt = currentItem.alt;
            mainImage.classList.remove('hidden');
        } else if (currentItem.type === 'video') {
            const videoId = getVideoIdFromUrl(currentItem.url);
            if (videoId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
                iframe.allowFullscreen = true;
                mainVideo.appendChild(iframe);
                mainVideo.classList.remove('hidden');
            } else {
                console.error("Geçersiz YouTube URL'si:", currentItem.url);
            }
        }

        thumbContainers.forEach((container, index) => {
            const item = items[index];
            if (item) {
                container.style.backgroundImage = `url('${item.type === 'image' ? item.src : `https://img.youtube.com/vi/${getVideoIdFromUrl(item.url)}/mqdefault.jpg`}')`;
                container.dataset.index = index;
                container.dataset.type = item.type;
            } else {
                container.style.backgroundImage = '';
                container.dataset.index = -1;
                container.dataset.type = '';
            }
        });
    }

    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateGallery();
    });

    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % items.length;
        updateGallery();
    });

    thumbContainers.forEach(container => {
        container.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (index !== -1) {
                currentIndex = index;
                updateGallery();
            }
        });
    });

    updateGallery();
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.gallery-desc1').textContent = serverConfig.gallery.description1;
    document.querySelector('.gallery-desc2').textContent = serverConfig.gallery.description2;
    document.querySelector('.instagram').closest('a').href = serverConfig.socialMedia.instagram;
    document.querySelector('.youtube').closest('a').href = serverConfig.socialMedia.youtube;
    document.querySelector('.discord').closest('a').href = serverConfig.socialMedia.discord;
});

document.addEventListener("DOMContentLoaded", () => {
    const audio = new Audio();
    const musicPlayer = {
        songs: musicConfig.songs,
        currentSong: 0,
        isPlaying: true,
        volume: musicConfig.initialVolume || 0.7,
        lastVolume: musicConfig.initialVolume || 0.7,

        elements: {
            songPhoto: document.querySelector('.song-photo'),
            songName: document.querySelector('.song-name'),
            artist: document.querySelector('.artist'),
            playPauseBtn: document.querySelector('.play-pause'),
            prevBtn: document.querySelector('.prev'),
            nextBtn: document.querySelector('.next'),
            progress: document.querySelector('.progress'),
            currentTime: document.querySelector('.current-time'),
            duration: document.querySelector('.duration'),
            volumeSlider: document.querySelector('.volume-slider'),
            volumeIcon: document.querySelector('.volume-icon')
        },

        init() {
            this.loadSong(this.currentSong);
            this.setupEventListeners();
            this.setInitialVolume();
        },

        loadSong(index) {
            const song = this.songs[index];
            audio.src = song.file;
            this.elements.songPhoto.src = song.cover;
            this.elements.songName.textContent = song.title;
            this.elements.artist.textContent = song.artist;

            audio.addEventListener('loadedmetadata', () => {
                this.elements.duration.textContent = this.formatTime(audio.duration);
            });

            if (this.isPlaying) {
                audio.play().catch(e => {
                    console.error("Oynatma hatası:", e);
                    this.isPlaying = false;
                    this.updatePlayPauseIcon();
                });
            }
        },

        playPause() {
            this.isPlaying = !this.isPlaying;
            this.updatePlayPauseIcon();
            this.isPlaying ? audio.play() : audio.pause();
        },

        updatePlayPauseIcon() {
            this.elements.playPauseBtn.src = this.isPlaying ? 
                'assets/pause.png' : 'assets/play.png';
        },

        prevSong() {
            this.currentSong = (this.currentSong - 1 + this.songs.length) % this.songs.length;
            this.loadSong(this.currentSong);
            if (this.isPlaying) audio.play();
        },

        nextSong() {
            this.currentSong = (this.currentSong + 1) % this.songs.length;
            this.loadSong(this.currentSong);
            if (this.isPlaying) audio.play();
        },

        updateProgress() {
            const { currentTime, duration, progress } = this.elements;
            currentTime.textContent = this.formatTime(audio.currentTime);
            progress.style.width = `${(audio.currentTime / audio.duration) * 100 || 0}%`;
        },

        setProgress(e) {
            const width = e.target.clientWidth;
            const clickX = e.offsetX;
            audio.currentTime = (clickX / width) * audio.duration;
        },

        setInitialVolume() {
            audio.volume = this.volume;
            this.elements.volumeSlider.value = this.volume;
            this.updateVolumeIcon(this.volume);
        },

        setVolume() {
            const volume = parseFloat(this.elements.volumeSlider.value);
            audio.volume = volume;
            this.updateVolumeIcon(volume);
            if (volume > 0) this.lastVolume = volume;
        },

        toggleMute() {
            if (audio.volume > 0) {
                this.lastVolume = audio.volume;
                audio.volume = 0;
                this.elements.volumeSlider.value = 0;
                this.updateVolumeIcon(0);
            } else {
                const restoreVolume = this.lastVolume || 0.7;
                audio.volume = restoreVolume;
                this.elements.volumeSlider.value = restoreVolume;
                this.updateVolumeIcon(restoreVolume);
            }
        },

        updateVolumeIcon(volume) {
            this.elements.volumeIcon.src = volume > 0 ? 
                'assets/volume.png' : 'assets/volume_mute.png';
        },

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        },

        setupEventListeners() {
            this.elements.playPauseBtn.addEventListener('click', () => this.playPause());
            this.elements.prevBtn.addEventListener('click', () => this.prevSong());
            this.elements.nextBtn.addEventListener('click', () => this.nextSong());

            document.querySelector('.progress-bar').addEventListener('click', (e) => this.setProgress(e));
            this.elements.volumeSlider.addEventListener('input', () => this.setVolume());
            this.elements.volumeIcon.addEventListener('click', () => this.toggleMute());

            audio.addEventListener('timeupdate', () => this.updateProgress());
            audio.addEventListener('ended', () => this.nextSong());
        }
    };

    musicPlayer.init();
});
document.addEventListener("DOMContentLoaded", function() {
    const noViewToggle = document.getElementById('noViewToggle');
    const body = document.body;
    let elementsVisible = true;

    const elementsToToggle = [
        document.querySelector('.solbar-png'),
        document.querySelector('.sagbar-png'),
        document.querySelector('.music-player'),
        document.querySelector('.volume-container')
    ];

    noViewToggle.addEventListener('click', function() {
        elementsVisible = !elementsVisible;
        
        if (elementsVisible) {
            noViewToggle.classList.remove('active');
            noViewToggle.querySelector('.no-view-text').textContent = 'NO VIEW';
            elementsToToggle.forEach(el => {
                el.classList.remove('hidden-elements');
            });
        } else {
            noViewToggle.classList.add('active');
            noViewToggle.querySelector('.no-view-text').textContent = 'SHOW VIEW';
            elementsToToggle.forEach(el => {
                el.classList.add('hidden-elements');
            });
        }
        
        localStorage.setItem('uiVisible', elementsVisible);
    });
    const savedState = localStorage.getItem('uiVisible');
    if (savedState === 'false') {
        noViewToggle.click();
    }
});
function extractYouTubeID(url) {
  const re = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/;
  const m = url.match(re);
  if (!m) {
    console.error("Geçersiz YouTube URL’si:", url);
    return null;
  }
  return m[1];
}

document.addEventListener("DOMContentLoaded", () => {
  const vidId = extractYouTubeID(config.youtubeLink);
  if (!vidId) return;

  const iframe = document.createElement("iframe");
  iframe.src = [
    `https://www.youtube.com/embed/${vidId}`,
    `?autoplay=1`,
    `&mute=1`,
    `&loop=1`,
    `&playlist=${vidId}`,
    `&controls=0`,
    `&modestbranding=1`,
    `&iv_load_policy=3`
  ].join("");
  iframe.allow = "autoplay; loop; encrypted-media";

  document.getElementById("video-container").appendChild(iframe);
});
            window.addEventListener('message', e => {
            if (e.data.eventName === 'loadProgress') {
                document.getElementById('percentage').innerHTML = `${parseInt(e.data.loadFraction * 90)}%`;
            } else if (e.data.eventName == 'onDataFileEntry') {
                document.getElementById('currFile').innerHTML = e.data.name;
            }
        if (e.data.eventName === 'loadProgress') {
        let fraction = e.data.loadFraction;
        if (fraction < 0) fraction = 0;
        if (fraction > 1) fraction = 1;

        const percentage = Math.floor(fraction * 100);
        document.getElementById('percentage').textContent = `${percentage}%`;

        const circle = document.querySelector('.progress-fill');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference - fraction * circumference;
    } else if (e.data.eventName == 'onDataFileEntry') {
        document.getElementById('currFile').textContent = e.data.name;
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("server-logo");
  const name = document.getElementById("server-name");

  logo.src = servernameConfig.logoUrl;
  logo.alt = `${servernameConfig.name} Logo`;

  name.textContent = servernameConfig.name;
});
