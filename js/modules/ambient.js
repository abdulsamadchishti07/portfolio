/**
 * Ambient Lo-Fi Terminal Radio Module
 * Abdul Samad Chishti Portfolio
 *
 * Dedicated, opt-in chill Lo-Fi / Synthwave ambient player.
 * Symmetrically balances the [Pause motion] button on the bottom-right.
 * Features:
 * - 3 seamless looping synth/lo-fi tracks (under 1MB each)
 * - Dark obsidian popover card directly above button
 * - Animated mini and full equalizer bars synced to playback
 * - Volume slider with percentage and localStorage persistence
 * - Zero autoplay (strictly opt-in)
 * - Full keyboard accessibility (Tab, Enter/Space, Esc dismissal) & click-outside close
 * - Symmetrical absolute hero positioning + smooth fixed docking when scrolled past hero
 */

const TRACKS = [
  {
    id: "aruarian-dance",
    number: "01",
    title: "Aruarian Dance",
    genre: "Nujabes · Lo-Fi Classic",
    src: "assets/audio/aruarian dance.mp3"
  },
  {
    id: "affection",
    number: "02",
    title: "Affection",
    genre: "Jinsang · Lo-Fi Beats",
    src: "assets/audio/jinsang - affection.mp3"
  },
  {
    id: "monday-loop",
    number: "03",
    title: "Monday Loop",
    genre: "Tomppabeats · Chill Vibes",
    src: "assets/audio/Tomppabeats - Monday Loop Extended.mp3"
  },
  {
    id: "bliss",
    number: "04",
    title: "Bliss",
    genre: "Lo-Fi Hip Hop Beat · Chill",
    src: "assets/audio/bliss - lofi hip hop beat (FREE FOR PROFIT USE).mp3"
  },
  {
    id: "hideaway",
    number: "05",
    title: "Hideaway",
    genre: "Chill Waves · Ambient",
    src: "assets/audio/Hideaway.mp3"
  }
];

export function initAmbientRadio() {
  const widget = document.getElementById("ambient-widget");
  const pillBtn = document.getElementById("ambient-pill-btn");
  const popover = document.getElementById("ambient-popover");
  const closeBtn = document.getElementById("ambient-close-btn");
  const playToggle = document.getElementById("ambient-play-toggle");
  const nowTitle = document.getElementById("ambient-now-title");
  const nowStatus = document.getElementById("ambient-now-status");
  const volumeSlider = document.getElementById("ambient-volume-slider");
  const volumeVal = document.getElementById("ambient-vol-val");
  const volumeIcon = document.getElementById("ambient-vol-icon");
  const trackButtons = document.querySelectorAll(".ambient-track-item");

  if (!widget || !pillBtn || !popover) {
    return;
  }

  // Audio instance
  let audio = document.getElementById("ambient-audio-element");
  if (!audio) {
    audio = new Audio();
    audio.id = "ambient-audio-element";
    audio.loop = true;
    audio.preload = "none";
    document.body.appendChild(audio);
  }

  let currentTrackIdx = 0;
  let isPlaying = false;
  let usingFallback = false;

  // Restore saved volume preference if available
  let savedVolume = 60;
  try {
    const stored = localStorage.getItem("ambient_volume");
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        savedVolume = parsed;
      }
    }
  } catch {
    // localStorage may be disabled or restricted
  }

  if (volumeSlider) {
    volumeSlider.value = savedVolume;
  }
  if (volumeVal) {
    volumeVal.textContent = `${savedVolume}%`;
  }
  audio.volume = savedVolume / 100;
  updateVolumeIcon(savedVolume);

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    if (vol === 0) {
      volumeIcon.textContent = "🔇";
    } else if (vol < 45) {
      volumeIcon.textContent = "🔉";
    } else {
      volumeIcon.textContent = "🔊";
    }
  }

  function setTrackUI(index) {
    const track = TRACKS[index];
    if (!track) return;

    if (nowTitle) {
      nowTitle.textContent = track.title;
    }

    trackButtons.forEach((btn, idx) => {
      const active = idx === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }

  function loadTrack(index, autoplay = false) {
    currentTrackIdx = index;
    const track = TRACKS[index];
    if (!track) return;

    usingFallback = false;
    audio.src = encodeURI(track.src);
    setTrackUI(index);

    if (autoplay) {
      audio.play().catch((err) => {
        console.warn("Lo-Fi audio playback was interrupted or blocked:", err);
      });
    }
  }

  // Audio Playback Events
  audio.addEventListener("play", () => {
    isPlaying = true;
    widget.classList.add("is-playing");
    if (playToggle) {
      playToggle.setAttribute("aria-label", "Pause Lo-Fi audio");
      playToggle.innerHTML = '<span class="play-icon" aria-hidden="true">❚❚</span>';
    }
    if (nowStatus) {
      nowStatus.textContent = "Playing · Lo-Fi Radio";
    }
    pillBtn.setAttribute("aria-label", `Lo-Fi Terminal · Playing: ${TRACKS[currentTrackIdx].title}`);
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    widget.classList.remove("is-playing");
    if (playToggle) {
      playToggle.setAttribute("aria-label", "Play Lo-Fi audio");
      playToggle.innerHTML = '<span class="play-icon" aria-hidden="true">▶</span>';
    }
    if (nowStatus) {
      nowStatus.textContent = "Paused";
    }
    pillBtn.setAttribute("aria-label", "Open Lo-Fi Ambient Radio");
  });

  // Handle format fallback in case of mp3 codec error
  audio.addEventListener("error", () => {
    const track = TRACKS[currentTrackIdx];
    if (!usingFallback && track && track.fallback) {
      usingFallback = true;
      audio.src = track.fallback;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    } else if (nowStatus) {
      nowStatus.textContent = "Audio unavailable";
    }
  });

  // Play / Pause Toggle Button
  if (playToggle) {
    playToggle.addEventListener("click", () => {
      if (!audio.src || audio.src === "" || audio.src === window.location.href) {
        loadTrack(currentTrackIdx, true);
        return;
      }

      if (audio.paused) {
        audio.play().catch((err) => {
          console.warn("Unable to play audio:", err);
        });
      } else {
        audio.pause();
      }
    });
  }

  // Track List Item Clicks
  trackButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-track-index"), 10);
      if (isNaN(idx)) return;

      if (idx === currentTrackIdx && !audio.paused) {
        // Clicking currently playing track pauses it
        audio.pause();
      } else {
        // Switch track and start playing
        loadTrack(idx, true);
      }
    });
  });

  // Volume Slider Input
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      audio.volume = val / 100;
      if (volumeVal) {
        volumeVal.textContent = `${val}%`;
      }
      updateVolumeIcon(val);
      try {
        localStorage.setItem("ambient_volume", val.toString());
      } catch {
        // ignore storage errors
      }
    });
  }

  // Popover Open / Close
  function openPopover() {
    popover.hidden = false;
    // Small timeout to allow CSS display/transition
    requestAnimationFrame(() => {
      widget.classList.add("is-open");
      pillBtn.setAttribute("aria-expanded", "true");
      popover.setAttribute("aria-hidden", "false");
    });
  }

  function closePopover() {
    widget.classList.remove("is-open");
    pillBtn.setAttribute("aria-expanded", "false");
    popover.setAttribute("aria-hidden", "true");
    // Delay hidden attribute slightly for transition
    setTimeout(() => {
      if (!widget.classList.contains("is-open")) {
        popover.hidden = true;
      }
    }, 240);
  }

  pillBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.contains("is-open");
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopover();
      pillBtn.focus();
    });
  }

  // Dismiss on click outside
  document.addEventListener("click", (e) => {
    if (widget.classList.contains("is-open")) {
      if (!widget.contains(e.target)) {
        closePopover();
      }
    }
  });

  // Dismiss on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) {
      closePopover();
      pillBtn.focus();
    }
  });

  // Prevent clicks inside popover from bubbling up to document
  popover.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Initial UI state
  setTrackUI(0);
}
