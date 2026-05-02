// ===================== STATE =====================
let usadas = {
    dibujar: [],
    mimica: [],
    definicion: [],
    test: []
};

let feedbackTimer = null;

// ===================== HELPERS =====================
function obtenerPreguntaAleatoria(tipo) {
    const pool = preguntas[tipo];
    const disponibles = pool
        .map((p, i) => i)
        .filter(i => !usadas[tipo].includes(i));

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
}

// ===================== RENDER QUESTION =====================
function mostrarPregunta(tipo) {
    clearTimeout(feedbackTimer);
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
        dibujar: "🎨 PAINT",
        mimica: "🎭 MIMIC",
        definicion: "🧠 DESCRIBE",
        test: "❓ QUESTION"
    };

    if (tipo !== "test") {
        container.innerHTML = `
            <div class="card">
                <div class="card-type">${labelMap[tipo]}</div>
                <p class="question-text">${p}</p>
            </div>`;
    } else {
        const letters = ["A", "B", "C", "D"];
        const optionsHTML = p.opciones.map((op, i) => `
            <button
                class="answer-btn"
                data-letter="${letters[i]}"
                onclick="checkRespuesta(this, ${i}, ${p.correcta - 1})"
            >${op}</button>
        `).join("");

        container.innerHTML = `
            <div class="card">
                <div class="card-type">${labelMap[tipo]}</div>
                <h2>${p.pregunta}</h2>
                ${optionsHTML}
            </div>`;
    }
}

// ===================== CHECK ANSWER =====================
// NOTE: In preguntas.js, "correcta" uses 1-based index.
// We pass (p.correcta - 1) so everything is 0-based here.
function checkRespuesta(btn, seleccion, correcta) {
    const card = btn.closest(".card");

    // Disable all buttons
    const allBtns = card.querySelectorAll(".answer-btn");
    allBtns.forEach((b, i) => {
        b.disabled = true;
        if (i === correcta) b.classList.add("correct");
        else if (b === btn && seleccion !== correcta) b.classList.add("wrong");
    });

    const isCorrect = seleccion === correcta;
    let seconds = 5;

    const feedback = document.createElement("div");
    feedback.className = `feedback ${isCorrect ? "success" : "error"}`;
    feedback.innerHTML = `
        ${isCorrect ? "✅ Correct!" : "❌ Wrong!"}
        <div class="countdown">Disappearing in <span id="countNum">${seconds}</span>s...</div>
    `;
    card.appendChild(feedback);

    // Countdown + auto-remove
    const interval = setInterval(() => {
        seconds--;
        const el = document.getElementById("countNum");
        if (el) el.textContent = seconds;
        if (seconds <= 0) clearInterval(interval);
    }, 1000);

    feedbackTimer = setTimeout(() => {
        clearInterval(interval);
        const container = document.getElementById("preguntaContainer");
        container.innerHTML = "";
    }, 5000);
}

// ===================== LOAD CUSTOM QUESTIONS =====================
// If the admin panel saved custom questions to localStorage, merge them
(function loadCustomQuestions() {
    try {
        const saved = localStorage.getItem("beatbattle_questions");
        if (saved) {
            const custom = JSON.parse(saved);
            Object.keys(custom).forEach(tipo => {
                if (preguntas[tipo] && custom[tipo].length > 0) {
                    preguntas[tipo] = [...preguntas[tipo], ...custom[tipo]];
                }
            });
        }
    } catch (e) {
        console.warn("Could not load custom questions:", e);
    }
})();
