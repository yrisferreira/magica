(function () {
  "use strict";

  /**
   * Elogios vagos e leves — para quem ainda não se conheceu pessoalmente
   * (tu / masculino), sem assumir memórias partilhadas.
   */
  const ELOGIOS = [
    "És lindo. ✨",
    "És tão gostoso.",
    "Aposto que tens um sorriso de derreter o coração.",
    "Tens um brilho que se nota mesmo à distância.",
    "És fofo sem nem tentar.",
    "Que combinação injusta: bonito e interessante.",
    "Tens cara de quem faz corações bater mais forte.",
    "És charmoso só de existir.",
    "Adoro a tua vibe — boa energia.",
    "És cute demais para este mundo.",
    "Tens um jeito que prende a atenção.",
    "És irresistível, sabias?",
    "Bonito da cabeça aos pés (sim, estou a flertar).",
    "O teu sorriso, mesmo em foto, deve ser perigoso.",
    "És daquele tipo de pessoa que se fica na cabeça.",
    "Gostoso e fofo ao mesmo tempo — combo raro.",
    "Tens magia na expressão — ou sou eu que gosto muito de ti.",
    "És lindo por fora; por dentro já dá para imaginar que és igualmente incrível.",
    "Cada mensagem tua tem cara de sorriso — adoro isso.",
    "És aquele crush que faz o telemóvel piscar com mais vontade.",
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
      for (const line of shuffle([...ELOGIOS])) {
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
    btn.setAttribute("aria-label", `Carta ${index + 1} — toca para revelar um elogio`);
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
    btn.setAttribute("aria-label", "Elogio revelado nesta carta");

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
      "Todas as cartas estão à vista — vira quantas quiseres. Cada uma guarda um elogio para ti. ✨";
    phaseText.classList.add("phase-text--show");
  });
})();
