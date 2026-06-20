(function () {
  const STORAGE_KEY = "mahi_music_enabled";
  const DEFAULT_VOLUME = 0.3;
  const FADE_STEP_MS = 70;
  const FADE_SECONDS = 900;

  const pageKeyFromPath = () => {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    if (path.includes("/things-i-never-said/")) return "confessions";
    if (path.includes("/our-timeline/")) return "timeline";
    if (path.includes("/memory-vault/")) return "memoryVault";
    if (path.includes("/open-when/")) return "openWhen";
    if (path.includes("/mahi-ai/")) return "mahiAi";
    if (path.includes("/future-mahi/")) return "futureMahi";
    if (path.includes("/tulips-for-mahi/")) return "tulips";
    if (path.includes("/love-heart/")) return "loveHeart";
    return "birthday";
  };

  const rootPath = pageKeyFromPath() === "birthday" ? "" : "../";
  const tracks = {
    birthday: {
      src: `${rootPath}Tu Hi Das De.mp3`,
      existingAudioId: "bgmusic"
    },
    confessions: { src: `${rootPath}music/That-girl.mp3` },
    timeline: { src: `${rootPath}music/Haareya.mp3` },
    memoryVault: { src: `${rootPath}music/Parshawan.mp3` },
    openWhen: { src: `${rootPath}music/Kina-Chir.mp3` },
    mahiAi: { src: `${rootPath}music/Waalian.mp3` },
    futureMahi: { src: `${rootPath}music/Noormahal.mp3` },
    tulips: { src: `${rootPath}music/Laal-bindi.mp3` },
    loveHeart: { src: `${rootPath}music/Laal-bindi.mp3` }
  };

  const state = {
    audio: null,
    button: null,
    enabled: localStorage.getItem(STORAGE_KEY) !== "false",
    fadeTimer: null
  };

  const injectStyles = () => {
    if (document.getElementById("mahiMusicStyles")) return;
    const style = document.createElement("style");
    style.id = "mahiMusicStyles";
    style.textContent = `
      .mahi-music-toggle {
        position: fixed;
        right: max(14px, env(safe-area-inset-right));
        bottom: max(14px, env(safe-area-inset-bottom));
        z-index: 9999;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(255, 218, 228, 0.46);
        border-radius: 50%;
        color: #fff4f7;
        background: rgba(218, 105, 141, 0.72);
        box-shadow: 0 0 22px rgba(255, 127, 166, 0.34), 0 12px 26px rgba(70, 25, 44, 0.24);
        backdrop-filter: blur(8px);
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        display: grid;
        place-items: center;
        transition: transform .22s ease, box-shadow .22s ease, background .22s ease;
      }

      .mahi-music-toggle:hover {
        transform: translateY(-2px) scale(1.04);
        background: rgba(226, 124, 156, 0.84);
        box-shadow: 0 0 30px rgba(255, 127, 166, 0.48), 0 16px 30px rgba(70, 25, 44, 0.28);
      }

      .mahi-music-toggle:focus-visible {
        outline: 2px solid rgba(255, 232, 238, 0.82);
        outline-offset: 3px;
      }
    `;
    document.head.appendChild(style);
  };

  const updateButton = () => {
    if (!state.button) return;
    state.button.innerHTML = state.enabled ? "&#128266;" : "&#128263;";
    state.button.setAttribute("aria-label", state.enabled ? "Turn music off" : "Turn music on");
    state.button.setAttribute("aria-pressed", String(state.enabled));
  };

  const fadeTo = (targetVolume, onDone) => {
    if (!state.audio) return;
    clearInterval(state.fadeTimer);
    const startVolume = state.audio.volume;
    const steps = Math.max(1, Math.round(FADE_SECONDS / FADE_STEP_MS));
    let currentStep = 0;

    state.fadeTimer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      state.audio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (currentStep >= steps) {
        clearInterval(state.fadeTimer);
        state.audio.volume = targetVolume;
        if (onDone) onDone();
      }
    }, FADE_STEP_MS);
  };

  const play = () => {
    if (!state.audio || !state.enabled) return;
    state.audio.volume = 0;
    const playPromise = state.audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise
        .then(() => fadeTo(DEFAULT_VOLUME))
        .catch(() => {
          state.audio.volume = DEFAULT_VOLUME;
        });
      return;
    }
    fadeTo(DEFAULT_VOLUME);
  };

  const stop = () => {
    if (!state.audio) return;
    fadeTo(0, () => {
      state.audio.pause();
    });
  };

  const unlockAutoplay = () => {
    if (state.enabled) play();
    window.removeEventListener("pointerdown", unlockAutoplay);
    window.removeEventListener("keydown", unlockAutoplay);
  };

  const shouldFadeLink = (event, link) => {
    if (!link || !state.enabled || !state.audio || state.audio.paused) return false;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target || link.hasAttribute("download")) return false;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;
    return true;
  };

  const setupLinkFade = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest && event.target.closest("a[href]");
      if (!shouldFadeLink(event, link)) return;
      event.preventDefault();
      stop();
      setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  };

  const createButton = () => {
    const button = document.createElement("button");
    button.className = "mahi-music-toggle";
    button.type = "button";
    button.addEventListener("click", () => {
      state.enabled = !state.enabled;
      localStorage.setItem(STORAGE_KEY, String(state.enabled));
      updateButton();
      if (state.enabled) {
        play();
      } else {
        stop();
      }
      window.dispatchEvent(new CustomEvent("mahi-music-toggle", { detail: { enabled: state.enabled } }));
    });
    document.body.appendChild(button);
    state.button = button;
    updateButton();
  };

  const createAudio = (track) => {
    if (track.existingAudioId) {
      const existingAudio = document.getElementById(track.existingAudioId);
      if (existingAudio) return existingAudio;
    }

    const audio = document.createElement("audio");
    audio.src = track.src;
    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("data-mahi-page-music", "true");
    document.body.appendChild(audio);
    return audio;
  };

  const init = () => {
    const key = pageKeyFromPath();
    const track = tracks[key];
    if (!track) return;

    injectStyles();
    state.audio = createAudio(track);
    state.audio.loop = true;
    state.audio.volume = DEFAULT_VOLUME;
    createButton();
    setupLinkFade();

    if (state.enabled) play();
    window.addEventListener("pointerdown", unlockAutoplay, { once: true });
    window.addEventListener("keydown", unlockAutoplay, { once: true });
    window.addEventListener("pagehide", stop);

    window.MahiMusic = {
      isEnabled: () => state.enabled,
      play,
      stop,
      audio: state.audio
    };
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
