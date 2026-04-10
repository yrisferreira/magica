(function () {
  "use strict";

  const COMPLIMENTS = [
    "You are gorgeous. ✨",
    "You are so attractive.",
    "I bet you have a heart-melting smile.",
    "You have a glow that shows, even from afar.",
    "You are adorable without even trying.",
    "Unfair combo: good-looking and interesting.",
    "You look like someone who makes hearts beat faster.",
    "You are charming just by being here.",
    "I love your vibe — great energy.",
    "You are almost too cute for this world.",
    "You have a way of holding attention.",
    "You are irresistible — you know that?",
    "Handsome from head to toe (yes, I am flirting).",
    "Your smile, even in photos, must be dangerous.",
    "You are the kind of person who sticks in the mind.",
    "Hot and sweet at the same time — a rare mix.",
    "There is magic in the way you look — or maybe I just like you a lot.",
    "You are beautiful outside; it is easy to imagine you are just as amazing inside.",
    "Every message from you feels like a smile — I love that.",
    "You are the crush that makes the phone light up a little brighter.",
  ];

  const CARD_COUNT = 9;

  const introPanel = document.getElementById("intro-panel");
  const startBtn = document.getElementById("start-btn");
  const magicPanel = document.getElementById("magic-panel");
  const magicVeil = document.getElementById("magic-veil");
  const fanWrap = document.getElementById("fan-wrap");
  const fan = document.getElementById("fan");
  const phaseText = document.getElementById("phase-text");
  const choiceResult = document.getElementById("choice-result");
  const complimentsLog = document.getElementById("compliments-log");
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

  function drawComplimentsForDeck(count) {
    const out = [];
    while (out.length < count) {
      for (const line of shuffle([...COMPLIMENTS])) {
        if (out.length >= count) break;
        out.push(line);
      }
    }
    return out.slice(0, count);
  }

  function createPickCard(index, complimentText) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pick-card";
    btn.setAttribute("aria-label", `Card ${index + 1} — tap to reveal a compliment`);
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
    btn.querySelector(".card-compliment-text").textContent = complimentText;
    return btn;
  }

  function buildFan() {
    fan.innerHTML = "";
    const lines = drawComplimentsForDeck(CARD_COUNT);
    for (let i = 0; i < CARD_COUNT; i++) {
      fan.appendChild(createPickCard(i, lines[i]));
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
    }
  }

  soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    soundToggle.setAttribute("aria-pressed", soundOn ? "true" : "false");
    soundToggle.querySelector(".sound-on").hidden = !soundOn;
    soundToggle.querySelector(".sound-off").hidden = soundOn;
  });

  let started = false;

  function onPickCard(btn) {
    if (btn.classList.contains("is-revealed")) return;

    unlockAudio();
    playMagicChime("reveal");

    btn.classList.add("is-revealed");
    btn.setAttribute("aria-label", "Compliment revealed on this card");

    const inner = btn.querySelector(".card-flip-inner");
    requestAnimationFrame(() => {
      inner.classList.add("is-flipped");
    });

    const text = btn.querySelector(".card-compliment-text").textContent.trim();
    const li = document.createElement("li");
    li.textContent = text;
    complimentsLog.appendChild(li);

    choiceResult.removeAttribute("hidden");
    li.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  startBtn.addEventListener("click", async () => {
    if (started) return;
    started = true;
    startBtn.disabled = true;

    complimentsLog.innerHTML = "";
    choiceResult.setAttribute("hidden", "");

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
      "All the cards are in view — flip as many as you like. Each one holds a compliment for you. ✨";
    phaseText.classList.add("phase-text--show");
  });
})();
