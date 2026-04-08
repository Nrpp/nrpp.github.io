let usadas = {
    dibujar: [],
    mimica: [],
    definicion: [],
    test: []
};

function obtenerPreguntaAleatoria(tipo) {
    let disponibles = preguntas[tipo].filter((_, i) => !usadas[tipo].includes(i));

    if (disponibles.length === 0) {
        return null;
    }

    let index = Math.floor(Math.random() * disponibles.length);
    let pregunta = disponibles[index];

    let realIndex = preguntas[tipo].indexOf(pregunta);
    usadas[tipo].push(realIndex);

    return pregunta;
}

function mostrarPregunta(tipo) {
    const container = document.getElementById("preguntaContainer");
    let p = obtenerPreguntaAleatoria(tipo);

    if (!p) {
        container.innerHTML = "<p>❌ No quedan preguntas en esta categoría</p>";
        return;
    }

    if (tipo !== "test") {
        container.innerHTML = `
            <div class="card">
                <h2>${tipo.toUpperCase()}</h2>
                <p>${p}</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card">
                <h2>${p.pregunta}</h2>
                ${p.opciones.map((op, i) => `
                    <button onclick="checkRespuesta(${i}, ${p.correcta})">${op}</button>
                `).join("")}
            </div>
        `;
    }
}

function checkRespuesta(seleccion, correcta) {
    const container = document.getElementById("preguntaContainer");

    if (seleccion === correcta) {
        container.innerHTML += "<p class='success-msg'>✅ Correcto</p>";
    } else {
        container.innerHTML += "<p class='error-msg'>❌ Incorrecto</p>";
    }
}
