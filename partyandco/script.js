// ===================== DEFAULT INSTRUCTIONS =====================
const DEFAULT_INSTRUCTIONS = [
    {
        icon: "🎲",
        title: "Teams & Board",
        text: "Play in teams of at least 2 players. Take turns rolling a dice and moving along the board. Each square is shaped like one of the 4 categories."
    },
    {
        icon: "🎨",
        title: "Paint",
        text: "Draw the word on paper — no writing allowed, only drawings! Your teammates must guess the word before time runs out."
    },
    {
        icon: "🎭",
        title: "Mimic",
        text: "Act out the word using only gestures and body language. No talking, no mouthing words, no sounds!"
    },
    {
        icon: "🧠",
        title: "Describe",
        text: "Describe the word to your teammates without saying it. No gestures — words only!"
    },
    {
        icon: "❓",
        title: "Question",
        text: "Your whole team answers a multiple-choice music question together. Choose wisely!"
    },
    {
        icon: "⏱️",
        title: "Time Limit",
        text: "Every category has a 1-minute time limit. The timer starts as soon as the card is revealed. If time runs out, you don't score."
    },
    {
        icon: "🍀",
        title: "Lucky Roll",
        text: "If your team answers correctly, you earn a Lucky Roll — an extra dice throw to advance further! You can use a Lucky Roll up to 3 times per game. But be careful: if you use your 3rd Lucky Roll and get a question wrong, you must move back the number shown on the dice."
    }
];

// ===================== INSTRUCTIONS STATE =====================
function getInstructions() {
    // instructions.js (published via admin panel) takes priority
    if (typeof instructions !== "undefined" && Array.isArray(instructions) && instructions.length > 0) {
        return instructions;
    }
    return DEFAULT_INSTRUCTIONS;
}

// ===================== MODAL =====================
function openInstructions() {
    renderInstructionsModal();
    document.getElementById("instructionsModal").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeInstructions() {
    document.getElementById("instructionsModal").classList.remove("open");
    document.body.style.overflow = "";
    // Mark as seen so it won't auto-open again
    localStorage.setItem("bb_instructions_seen", "1");
}

function renderInstructionsModal() {
    const steps = getInstructions();
    const html = steps.map((s, i) => `
        <div class="instruction-step">
            <div class="step-icon">${s.icon}</div>
            <div class="step-body">
                <div class="step-title">${s.title}</div>
                <div class="step-text">${s.text}</div>
            </div>
        </div>
    `).join("");
    document.getElementById("instructionsContent").innerHTML = html;
}

// Auto-open on first visit
window.addEventListener("DOMContentLoaded", () => {
    const seen = localStorage.getItem("bb_instructions_seen");
    if (!seen) openInstructions();
});

// ===================== GAME STATE =====================
let usadas = { dibujar: [], mimica: [], definicion: [], test: [] };
let feedbackTimer = null;
let timerInterval = null;

// ===================== HELPERS =====================
function obtenerPreguntaAleatoria(tipo) {
    const pool = preguntas[tipo];
    const disponibles = pool.map((_, i) => i).filter(i => !usadas[tipo].includes(i));
    if (disponibles.length === 0) return null;
    const randomPos = Math.floor(Math.random() * disponibles.length);
    const realIndex = disponibles[randomPos];
    usadas[tipo].push(realIndex);
    return pool[realIndex];
}

function resetGame() {
    usadas = { dibujar: [], mimica: [], definicion: [], test: [] };
    document.getElementById("preguntaContainer").innerHTML = "";
    clearTimeout(feedbackTimer);
    stopTimer();
}

// ===================== TIMER =====================
const TIMER_SECONDS = 60;

function startTimer(onExpire) {
    stopTimer();
    let remaining = TIMER_SECONDS;
    updateTimerDisplay(remaining);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(remaining);
        if (remaining <= 0) {
            stopTimer();
            if (onExpire) onExpire();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimerDisplay(seconds) {
    const el = document.getElementById("timerDisplay");
    if (!el) return;
    const pct = seconds / TIMER_SECONDS;
    const color = pct > 0.5 ? "#00ffcb" : pct > 0.25 ? "#ffeaa7" : "#ff7675";
    el.innerHTML = `
        <div class="timer-ring" style="--pct:${pct};--color:${color};">
            <svg viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" class="ring-bg"/>
                <circle cx="28" cy="28" r="24" class="ring-fill"
                    style="stroke:${color};stroke-dashoffset:${150.8 * (1 - pct)}"/>
            </svg>
            <span class="timer-num" style="color:${color}">${seconds}</span>
        </div>
    `;
}

function onTimerExpire() {
    stopTimer();
    const card = document.querySelector(".card");
    if (!card) return;

    // Disable answer buttons if test
    card.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);

    // Show time-up message
    const msg = document.createElement("div");
    msg.className = "feedback error";
    msg.innerHTML = `⏰ Time's up! <div class="countdown">Disappearing in <span id="countNum">5</span>s...</div>`;
    card.appendChild(msg);

    let s = 5;
    const iv = setInterval(() => {
        s--;
        const el = document.getElementById("countNum");
        if (el) el.textContent = s;
        if (s <= 0) clearInterval(iv);
    }, 1000);

    feedbackTimer = setTimeout(() => {
        clearInterval(iv);
        document.getElementById("preguntaContainer").innerHTML = "";
    }, 5000);
}

// ===================== RENDER QUESTION =====================
function mostrarPregunta(tipo) {
    clearTimeout(feedbackTimer);
    stopTimer();
    const container = document.getElementById("preguntaContainer");
    const p = obtenerPreguntaAleatoria(tipo);

    if (!p) {
        container.innerHTML = `
            <div class="card">
                <p class="empty-state">❌ No more questions in this category.<br>Reset the game to play again!</p>
            </div>`;
        return;
    }

    const labelMap = {
        dibujar:    "🎨 PAINT",
        mimica:     "🎭 MIMIC",
        definicion: "🧠 DESCRIBE",
        test:       "❓ QUESTION"
    };

    const timerHTML = `<div id="timerDisplay" class="timer-wrap"></div>`;

    if (tipo !== "test") {
        container.innerHTML = `
            <div class="card">
                <div class="card-type">${labelMap[tipo]}</div>
                ${timerHTML}
                <p class="question-text">${p}</p>
            </div>`;
    } else {
        const letters = ["A", "B", "C", "D"];
        const optionsHTML = p.opciones.map((op, i) => `
            <button class="answer-btn" data-letter="${letters[i]}"
                onclick="checkRespuesta(this, ${i}, ${p.correcta - 1})">${op}</button>
        `).join("");

        container.innerHTML = `
            <div class="card">
                <div class="card-type">${labelMap[tipo]}</div>
                ${timerHTML}
                <h2>${p.pregunta}</h2>
                ${optionsHTML}
            </div>`;
    }

    // Start timer — for test, expire locks options; for others, just shows time up
    startTimer(onTimerExpire);
}

// ===================== CHECK ANSWER =====================
function checkRespuesta(btn, seleccion, correcta) {
    stopTimer();
    const card = btn.closest(".card");

    card.querySelectorAll(".answer-btn").forEach((b, i) => {
        b.disabled = true;
        if (i === correcta) b.classList.add("correct");
        else if (b === btn && seleccion !== correcta) b.classList.add("wrong");
    });

    const isCorrect = seleccion === correcta;
    let seconds = 5;

    const feedback = document.createElement("div");
    feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
    feedback.innerHTML = `
        ${isCorrect ? "✅ Correct! 🍀 Lucky Roll available!" : "❌ Wrong!"}
        <div class="countdown">Disappearing in <span id="countNum">${seconds}</span>s...</div>
    `;
    card.appendChild(feedback);

    const iv = setInterval(() => {
        seconds--;
        const el = document.getElementById("countNum");
        if (el) el.textContent = seconds;
        if (seconds <= 0) clearInterval(iv);
    }, 1000);

    feedbackTimer = setTimeout(() => {
        clearInterval(iv);
        document.getElementById("preguntaContainer").innerHTML = "";
    }, 5000);
}
