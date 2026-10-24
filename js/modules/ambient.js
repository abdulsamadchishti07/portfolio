/**
 * Ambient Lo-Fi Terminal Radio Module
 * Abdul Samad Chishti Portfolio
 *
 * Dedicated, opt-in chill Lo-Fi / Synth ambient player.
 * Symmetrically balances the [Pause motion] button on the bottom-right.
 *
 * Features:
 * - Real curated chill Lo-Fi tracks from assets/audio/ + Procedural Web Audio Ambient Synth
 * - Symmetrical hero positioning (exact match to #motion) + smooth fixed docking when scrolled past hero
 * - Dark obsidian popover card directly above trigger pill
 * - Compact scrollable track list with keyboard radiogroup navigation (Arrow keys, Space/Enter)
 * - Animated mini & 5-column live equalizer frequency visualizers
 * - Volume slider with percentage, click-to-mute toggle, and localStorage persistence
 * - Zero autoplay (strictly opt-in by user choice)
 * - Full WCAG accessibility: aria-haspopup, aria-expanded, aria-checked, Esc dismissal, outside-click close, focus management
 */

const TRACKS = [
  {
    id: "affection",
    number: "01",
    title: "Affection",
    genre: "Jinsang · Lo-Fi Chill",
    src: "assets/audio/jinsang - affection.mp3",
    type: "audio"
  },
  {
    id: "hideaway",
    number: "02",
    title: "Hideaway",
    genre: "Chillhop · Warm Rhodes",
    src: "assets/audio/Hideaway.mp3",
    type: "audio"
  },
  {
    id: "monday-loop",
    number: "03",
    title: "Monday Loop",
    genre: "Tomppabeats · Chillhop Vinyl",
    src: "assets/audio/Tomppabeats - Monday Loop Extended.mp3",
    type: "audio"
  },
  {
    id: "bliss",
    number: "04",
    title: "Bliss",
    genre: "Lo-Fi Hip Hop Beat · Relax",
    src: "assets/audio/bliss - lofi hip hop beat (FREE FOR PROFIT USE).mp3",
    type: "audio"
  },
  {
    id: "aruarian-dance",
    number: "05",
    title: "Aruarian Dance",
    genre: "Nujabes · Iconic Lo-Fi Classic",
    src: "assets/audio/aruarian dance.mp3",
    type: "audio"
  },
  {
    id: "terminal-flow",
    number: "06",
    title: "Terminal Flow",
    genre: "Live Procedural Synth · Infinite Loop",
    src: "synth",
    type: "synth"
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
  const volumeToggle = document.getElementById("ambient-vol-toggle");
  const trackButtons = Array.from(document.querySelectorAll(".ambient-track-item"));
  const heroSection = document.getElementById("about");

  if (!widget || !pillBtn || !popover) {
    return;
  }

  // HTML5 Audio instance for MP3 tracks
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
  let previousVolume = 60;

  // Web Audio Procedural Synth Engine for "Terminal Flow"
  let audioCtx = null;
  let synthMasterGain = null;
  let synthIntervalId = null;
  let activeSynthOscs = [];
  let isSynthPlaying = false;

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
    // localStorage may be disabled or restricted in private browsing
  }

  previousVolume = savedVolume > 0 ? savedVolume : 60;
  applyVolume(savedVolume, false);

  function applyVolume(vol, persist = true) {
    const clamped = Math.max(0, Math.min(100, Math.round(vol)));
    audio.volume = clamped / 100;

    if (synthMasterGain && audioCtx) {
      synthMasterGain.gain.setTargetAtTime(clamped / 100 * 0.28, audioCtx.currentTime, 0.05);
    }

    if (volumeSlider) {
      volumeSlider.value = clamped;
      volumeSlider.setAttribute("aria-valuenow", String(clamped));
      volumeSlider.setAttribute("aria-valuetext", `${clamped}%`);
    }
    if (volumeVal) {
      volumeVal.textContent = `${clamped}%`;
    }
    updateVolumeIcon(clamped);

    if (persist) {
      try {
        localStorage.setItem("ambient_volume", String(clamped));
      } catch {
        // ignore storage errors
      }
    }
  }

  function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    if (vol === 0) {
      volumeIcon.textContent = "🔇";
      if (volumeToggle) volumeToggle.setAttribute("aria-label", "Unmute ambient audio");
    } else if (vol < 45) {
      volumeIcon.textContent = "🔉";
      if (volumeToggle) volumeToggle.setAttribute("aria-label", "Mute ambient audio");
    } else {
      volumeIcon.textContent = "🔊";
      if (volumeToggle) volumeToggle.setAttribute("aria-label", "Mute ambient audio");
    }
  }

  // Volume Mute / Unmute Toggle Button
  if (volumeToggle) {
    volumeToggle.addEventListener("click", () => {
      const current = parseInt(volumeSlider ? volumeSlider.value : (audio.volume * 100), 10);
      if (current > 0) {
        previousVolume = current;
        applyVolume(0);
      } else {
        applyVolume(previousVolume > 0 ? previousVolume : 60);
      }
    });
  }

  // Symmetrical Hero Docking
  // Positioned symmetrically opposite #motion inside .hero-film,
  // docks smoothly to fixed bottom-left once user scrolls past hero.
  function updateDocking() {
    if (!heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    if (heroRect.bottom <= window.innerHeight * 0.75) {
      widget.classList.add("is-docked");
    } else {
      widget.classList.remove("is-docked");
    }
  }

  window.addEventListener("scroll", updateDocking, { passive: true });
  window.addEventListener("resize", updateDocking, { passive: true });
  updateDocking();

  // Web Audio Ambient Synthesizer Implementation
  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();

      synthMasterGain = audioCtx.createGain();
      const currentVol = parseInt(volumeSlider ? volumeSlider.value : "60", 10);
      synthMasterGain.gain.setValueAtTime(currentVol / 100 * 0.28, audioCtx.currentTime);
      synthMasterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSynthChord(frequencies, duration = 3.6) {
    if (!audioCtx || !synthMasterGain) return;
    const now = audioCtx.currentTime;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(780, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(380, now + duration);
    filter.Q.setValueAtTime(1.8, now);
    filter.connect(synthMasterGain);

    const chordGain = audioCtx.createGain();
    chordGain.gain.setValueAtTime(0.001, now);
    chordGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    chordGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    chordGain.connect(filter);

    frequencies.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = i % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);
      // Detune slightly for lush analog chorus texture
      osc.detune.setValueAtTime((i - 1.5) * 6, now);
      osc.connect(chordGain);
      osc.start(now);
      osc.stop(now + duration + 0.1);
      activeSynthOscs.push(osc);
    });

    // Cleanup finished oscillators
    setTimeout(() => {
      activeSynthOscs = activeSynthOscs.filter(o => {
        try { return o.playbackState !== 3; } catch { return false; }
      });
    }, (duration + 0.5) * 1000);
  }

  function startSynthEngine() {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    isSynthPlaying = true;

    // Chilled Lo-Fi Chord Progressions (Hz): Dm9 -> G13 -> Cmaj9 -> Am9
    const chordProgression = [
      [146.83, 220.00, 261.63, 329.63], // Dm9 (D3, A3, C4, E4)
      [98.00, 174.61, 246.94, 329.63],  // G13 (G2, F3, B3, E4)
      [130.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, G3, B3, D4)
      [110.00, 164.81, 196.00, 261.63]  // Am9 (A2, E3, G3, C4)
    ];

    let chordStep = 0;
    function nextChord() {
      if (!isSynthPlaying) return;
      playSynthChord(chordProgression[chordStep], 3.8);
      chordStep = (chordStep + 1) % chordProgression.length;
    }

    nextChord();
    if (synthIntervalId) clearInterval(synthIntervalId);
    synthIntervalId = setInterval(nextChord, 3600);
  }

  function stopSynthEngine() {
    isSynthPlaying = false;
    if (synthIntervalId) {
      clearInterval(synthIntervalId);
      synthIntervalId = null;
    }
    activeSynthOscs.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    });
    activeSynthOscs = [];
  }

  // Update UI State for Selected Track
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
      btn.setAttribute("tabindex", active ? "0" : "-1");
    });
  }

  // Playback State Sync (Updates buttons, labels, and equalizer animations)
  function setPlaybackActiveState(active) {
    isPlaying = active;
    widget.classList.toggle("is-playing", active);

    if (playToggle) {
      playToggle.setAttribute("aria-label", active ? "Pause Lo-Fi audio" : "Play Lo-Fi audio");
      playToggle.innerHTML = active
        ? '<span class="play-icon" aria-hidden="true">❚❚</span>'
        : '<span class="play-icon" aria-hidden="true">▶</span>';
    }

    const currentTrack = TRACKS[currentTrackIdx];
    const trackName = currentTrack ? currentTrack.title : "Lo-Fi Radio";

    if (nowStatus) {
      nowStatus.textContent = active ? "Playing · Lo-Fi Radio" : "Paused";
    }

    pillBtn.setAttribute(
      "aria-label",
      active ? `Lo-Fi Terminal · Playing: ${trackName}` : "Open Lo-Fi Ambient Radio"
    );
  }

  function loadTrack(index, autoplay = false) {
    currentTrackIdx = index;
    const track = TRACKS[index];
    if (!track) return;

    setTrackUI(index);

    if (track.type === "synth") {
      audio.pause();
      if (autoplay) {
        startSynthEngine();
        setPlaybackActiveState(true);
      }
    } else {
      stopSynthEngine();
      audio.src = encodeURI(track.src);
      if (autoplay) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Lo-Fi audio playback was interrupted or blocked by browser:", err);
            setPlaybackActiveState(false);
            if (nowStatus) nowStatus.textContent = "Click play to start";
          });
        }
      }
    }
  }

  // HTML5 Audio Event Listeners
  audio.addEventListener("play", () => {
    setPlaybackActiveState(true);
  });

  audio.addEventListener("pause", () => {
    if (!isSynthPlaying) {
      setPlaybackActiveState(false);
    }
  });

  audio.addEventListener("ended", () => {
    // When a track finishes, smoothly advance to the next track
    const nextIdx = (currentTrackIdx + 1) % TRACKS.length;
    loadTrack(nextIdx, true);
  });

  audio.addEventListener("error", (e) => {
    console.warn("Audio loading error on:", audio.src, e);
    // If local file failed, switch gracefully to procedural synth
    if (TRACKS[currentTrackIdx] && TRACKS[currentTrackIdx].type === "audio") {
      if (nowStatus) nowStatus.textContent = "Switching to synth...";
      setTimeout(() => {
        loadTrack(5, isPlaying); // Track 06: Terminal Flow Synth
      }, 500);
    }
  });

  // Play / Pause Toggle Button
  if (playToggle) {
    playToggle.addEventListener("click", () => {
      const track = TRACKS[currentTrackIdx];
      if (!track) return;

      if (track.type === "synth") {
        if (isSynthPlaying) {
          stopSynthEngine();
          setPlaybackActiveState(false);
        } else {
          startSynthEngine();
          setPlaybackActiveState(true);
        }
        return;
      }

      if (!audio.src || audio.src === "" || audio.src === window.location.href) {
        loadTrack(currentTrackIdx, true);
        return;
      }

      if (audio.paused) {
        const p = audio.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn("Unable to play audio:", err);
          });
        }
      } else {
        audio.pause();
      }
    });
  }

  // Track List Item Clicks & Radiogroup Keyboard Navigation
  trackButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const track = TRACKS[index];
      if (!track) return;

      const isCurrent = index === currentTrackIdx;
      const currentlyActive = track.type === "synth" ? isSynthPlaying : !audio.paused;

      if (isCurrent && currentlyActive) {
        // Clicking currently active track toggles pause
        if (track.type === "synth") {
          stopSynthEngine();
          setPlaybackActiveState(false);
        } else {
          audio.pause();
        }
      } else {
        // Switch track and start playing
        loadTrack(index, true);
      }
    });

    // WAI-ARIA Radiogroup keyboard arrow navigation
    btn.addEventListener("keydown", (e) => {
      let targetIndex = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        targetIndex = (index + 1) % trackButtons.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        targetIndex = (index - 1 + trackButtons.length) % trackButtons.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        targetIndex = trackButtons.length - 1;
      }

      if (targetIndex !== null && trackButtons[targetIndex]) {
        trackButtons[targetIndex].focus();
        loadTrack(targetIndex, isPlaying);
      }
    });
  });

  // Volume Slider Input
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      applyVolume(val, true);
    });
  }

  // Popover Open / Close Management
  function openPopover() {
    popover.hidden = false;
    requestAnimationFrame(() => {
      widget.classList.add("is-open");
      pillBtn.setAttribute("aria-expanded", "true");
      popover.setAttribute("aria-hidden", "false");

      // Set focus to the active track item for smooth keyboard flow
      const activeBtn = trackButtons[currentTrackIdx] || trackButtons[0];
      if (activeBtn) {
        activeBtn.focus();
      }
    });
  }

  function closePopover() {
    widget.classList.remove("is-open");
    pillBtn.setAttribute("aria-expanded", "false");
    popover.setAttribute("aria-hidden", "true");
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

  // Prevent clicks inside popover from closing it
  popover.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Initial State: paused, strictly opt-in, track 0 UI ready
  setTrackUI(0);
}
