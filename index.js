const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const progress = $("#progress");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const cd = $(".cd");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem("PLAYER_STORAGE_KEY")) || {},

  songs: [
    {
      name: "Chân Ái",
      singer: "OrangexKhói",
      path: "./music/1.mp3",
      image: "./img/1.jpg",
    },
    {
      name: "3 1 0 7",
      singer: "3 1 0 7",
      path: "./music/2.mp3",
      image: "./img/2.png",
    },
    {
      name: "Ai Mang Cô Đơn Đi",
      singer: "K-CIM",
      path: "./music/3.mp3",
      image: "./img/3.png",
    },
    {
      name: "Anh Nhà Ở Đâu Thế?",
      singer: "Amee",
      path: "./music/4.mp3",
      image: "./img/4.png",
    },
    {
      name: "Anh Không Tha Thứ",
      singer: "Đình Dũng",
      path: "./music/5.mp3",
      image: "./img/5.png",
    },
    {
      name: "Anh Sẽ Tốt Mà",
      singer: "Thuỳ Chi",
      path: "./music/6.mp3",
      image: "./img/6.png",
    },
    {
      name: "At My Worst",
      singer: "Pink Sweat$",
      path: "./music/7.mp3",
      image: "./img/7.png",
    },
    {
      name: "Kings & Queens",
      singer: "Ava Max",
      path: "./music/8.mp3",
      image: "./img/8.png",
    },
    {
      name: "My Head & My Heart",
      singer: "Ava Max",
      path: "./music/9.mp3",
      image: "./img/9.png",
    },
    {
      name: "Salt",
      singer: "Ava Max",
      path: "./music/10.mp3",
      image: "./img/10.png",
    },
  ],
  setConfig: function (key, val) {
    this.config[key] = val;
    localStorage.setItem("PLAYER_STORAGE_KEY", JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `
        <div class="song" data-index=${index}>
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-heart"></i>  
              </div>
        </div>
      `;
    });

    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay và dừng
    const cdThumbAnimate = cdThumb.animate(
      {
        transform: "rotate(360deg)",
      },
      {
        duration: 10000, //10s
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    // Xử lý khi click play button
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Lắng nghe tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();

      _this.scrollActiveSong();
      _this.activeSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();

      _this.scrollActiveSong();
      _this.activeSong();
    };

    // Xử lý bật tắt randomSong
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xu ly lap lai 1 song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
      randomBtn.classList.remove("active", _this.isRandom);
    };

    // Xử lý bật tắt randomSong
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
      repeatBtn.classList.remove("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lawsng nghe hanh vi click vao playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const songOption = e.target.closest(".option");

      if (songNode || songOption) {
        // Xu ly khi click vao song
        if (songNode) {
          _this.currentIndex = songNode.dataset.index;
          _this.loadCurrentSong();
          audio.play();
          _this.activeSong();
        }
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  scrollActiveSong: function () {
    setTimeout(() => {
      if (this.currentIndex < 3) {
        $('.song.active').scrollIntoView({
          behavior: "smooth",
          block: "end"
        })
      } else {
        $('.song.active').scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        })
      }
    }, 300)
  },

  activeSong: function () {
    var loopSongs = $$(".song");
    for (song of loopSongs) {
      song.classList.remove("active");
    }
    const activeSong = loopSongs[this.currentIndex];
    activeSong.classList.add("active");
  },

  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadStatus: function () {
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },

  start: function () {
    // Gan cau hinh tu config vao ung dung
    this.loadConfig();

    //Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe  / sử lý các sự kiện(Dom events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên và UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    this.activeSong();

    // Hien thi trang thai ban dau cua button repeat va random
    this.loadStatus();
  },
};

app.start();
