(function () {
  "use strict";

  const PHRASE_WORDS = ["Let", "me", "see", "you", "naked."];

  const CARD_COUNT = PHRASE_WORDS.length;

  const introPanel = document.getElementById("intro-panel");
  const startBtn = document.getElementById("start-btn");
  const magicPanel = document.getElementById("magic-panel");
  const magicVeil = document.getElementById("magic-veil");
  const fanWrap = document.getElementById("fan-wrap");
  const fan = document.getElementById("fan");
  const phaseText = document.getElementById("phase-text");
  const choiceResult = document.getElementById("choice-result");
  const sentenceAssembly = document.getElementById("sentence-assembly");
  const soundToggle = document.getElementById("sound-toggle");
  const starsEl = document.getElementById("stars");
  const twinklesEl = document.getElementById("twinkles");

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shuffledPhraseDeck() {
    const entries = PHRASE_WORDS.map((word, sentenceIndex) => ({ word, sentenceIndex }));
    return shuffle(entries);
  }

  function initSentenceSlots() {
    sentenceAssembly.innerHTML = PHRASE_WORDS.map(
      (_, i) =>
        `<span class="word-slot" data-slot="${i}" aria-label="Word ${i + 1} not revealed">·</span>`
    ).join(" ");
  }

  function createPickCard(index, word, sentenceIndex) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick-card";
    btn.dataset.sentenceIndex = String(sentenceIndex);
    btn.setAttribute("aria-label", `Card ${index + 1} — tap to reveal a word`);
    btn.innerHTML = `
      <span class="pick-card-inner">
        <span class="fan-card-flip">
          <span class="card-flip-inner">
            <span class="card card--back"></span>
            <span class="card card--face card--compliment">
              <span class="card-face-mark" aria-hidden="true">✨</span>
              <p class="card-compliment-text"></p>
            </span>
          </span>
        </span>
      </span>
    `;
    btn.querySelector(".card-compliment-text").textContent = word;
    return btn;
  }

  function buildFan() {
    fan.innerHTML = "";
    const deck = shuffledPhraseDeck();
    for (let i = 0; i < deck.length; i++) {
      const { word, sentenceIndex } = deck[i];
      fan.appendChild(createPickCard(i, word, sentenceIndex));
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function fillStars() {
    const n = Math.min(70, Math.floor((window.innerWidth / 28) * 10));
    starsEl.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const s = document.createElement("div");
      s.className = "star-dot";
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.setProperty("--t", `${2 + Math.random() * 4}s`);
      s.style.setProperty("--d", `${Math.random() * 4}s`);
      starsEl.appendChild(s);
    }
  }

  function fillTwinkles() {
    const n = 14;
    twinklesEl.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const t = document.createElement("div");
      t.className = "twinkle-spark";
      t.style.left = `${Math.random() * 100}%`;
      t.style.bottom = `${-20 - Math.random() * 40}%`;
      t.style.setProperty("--dd", `${Math.random() * 10}s`);
      twinklesEl.appendChild(t);
    }
  }

  fillStars();
  fillTwinkles();
  window.addEventListener("resize", fillStars);

  let audioCtx = null;
  let soundOn = true;

  function initAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  async function unlockAudio() {
    const ctx = initAudio();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
  }

  function playTone(freq, duration, volume, startWhen) {
    if (!soundOn || !audioCtx) return;
    const when = startWhen ?? audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(volume, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0008, when + duration);
    o.start(when);
    o.stop(when + duration + 0.06);
  }

  function playMagicChime(kind) {
    if (!soundOn || !audioCtx) return;
    const t = audioCtx.currentTime;
    if (kind === "start") {
      playTone(523.25, 0.32, 0.055, t);
      playTone(659.25, 0.32, 0.05, t + 0.1);
      playTone(783.99, 0.4, 0.045, t + 0.22);
    } else if (kind === "reveal") {
      playTone(392, 0.45, 0.05, t);
      playTone(523.25, 0.45, 0.048, t + 0.08);
      playTone(659.25, 0.5, 0.042, t + 0.16);
      playTone(880, 0.55, 0.038, t + 0.24);
    } else if (kind === "vanish") {
      playTone(783.99, 0.2, 0.048, t);
      playTone(987.77, 0.22, 0.04, t + 0.06);
      playTone(1174.66, 0.28, 0.034, t + 0.13);
    }
  }

  soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    soundToggle.setAttribute("aria-pressed", soundOn ? "true" : "false");
    soundToggle.querySelector(".sound-on").hidden = !soundOn;
    soundToggle.querySelector(".sound-off").hidden = soundOn;
  });

  let started = false;

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scheduleCardVanish(btn) {
    const inner = btn.querySelector(".card-flip-inner");

    function finishVanish() {
      if (!btn.classList.contains("is-gone")) btn.classList.add("is-gone");
    }

    function beginVanish() {
      if (btn.classList.contains("is-vanishing") || btn.classList.contains("is-gone")) return;
      playMagicChime("vanish");
      btn.classList.add("is-vanishing");

      if (prefersReducedMotion()) {
        window.setTimeout(finishVanish, 100);
        return;
      }

      btn.addEventListener(
        "animationend",
        (e) => {
          if (e.animationName === "card-vanish-magic") finishVanish();
        },
        { once: true }
      );
      window.setTimeout(finishVanish, 2000);
    }

    if (prefersReducedMotion()) {
      window.setTimeout(beginVanish, 100);
      return;
    }

    let flipHandled = false;
    function afterFlip() {
      if (flipHandled) return;
      flipHandled = true;
      inner.removeEventListener("transitionend", onFlipDone);
      beginVanish();
    }

    function onFlipDone(e) {
      if (e.target !== inner || e.propertyName !== "transform") return;
      afterFlip();
    }

    inner.addEventListener("transitionend", onFlipDone);
    window.setTimeout(() => {
      afterFlip();
    }, 1100);
  }

  function onPickCard(btn) {
    if (
      btn.classList.contains("is-revealed") ||
      btn.classList.contains("is-vanishing") ||
      btn.classList.contains("is-gone")
    ) {
      return;
    }

    unlockAudio();
    playMagicChime("reveal");

    btn.classList.add("is-revealed");
    btn.setAttribute("aria-label", "Word revealed on this card");

    const inner = btn.querySelector(".card-flip-inner");
    requestAnimationFrame(() => {
      inner.classList.add("is-flipped");
    });

    scheduleCardVanish(btn);

    const text = btn.querySelector(".card-compliment-text").textContent.trim();
    const slotIdx = parseInt(btn.dataset.sentenceIndex, 10);
    const slot = sentenceAssembly.querySelector(`[data-slot="${slotIdx}"]`);
    if (slot) {
      slot.textContent = text;
      slot.classList.add("is-revealed");
      slot.setAttribute("aria-label", `Word ${slotIdx + 1}: ${text}`);
    }

    choiceResult.removeAttribute("hidden");
    slot?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  startBtn.addEventListener("click", async () => {
    if (started) return;
    started = true;
    startBtn.disabled = true;

    choiceResult.setAttribute("hidden", "");
    initSentenceSlots();

    await unlockAudio();
    playMagicChime("start");

    buildFan();
    fan.querySelectorAll(".pick-card").forEach((btn) => {
      btn.addEventListener("click", () => onPickCard(btn));
    });

    introPanel.classList.add("is-out");
    await wait(680);
    introPanel.setAttribute("hidden", "");
    introPanel.setAttribute("aria-hidden", "true");

    magicPanel.removeAttribute("hidden");

    magicVeil.classList.add("is-lit");
    fanWrap.classList.add("pop-in");

    await wait(420);
    phaseText.textContent =
      "All the cards are in view — flip them to spell out the message. ✨";
    phaseText.classList.add("phase-text--show");
  });
})();
