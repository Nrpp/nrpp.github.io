class ChopinEscapeRoom {
    constructor() {
        this.currentRoom = 0;
        this.totalRooms = 6;
        this.rooms = this.createRooms();
        this.init();
    }

    init() {
        this.loadRoom(0);
        this.setupAudio();
        this.updateProgress();
        document.querySelector('.chopin-image').addEventListener('mouseenter', () => {
            document.getElementById('backgroundMusic').play();
        });
    }

    setupAudio() {
        const music = document.getElementById('backgroundMusic');
        music.volume = 0.3;
    }

    createRooms() {
        return [
            {
                title: "🏰 Bienvenidos a la Mansión de Chopin",
                content: `
                    <p><strong>París, 1838</strong>. Estáis atrapados en la mansión del gran Frédéric Chopin.</p>
                    <p><em>"La música es más que matemáticas"</em> - F. Chopin</p>
                    <button class="answer-btn" onclick="game.nextRoom()">¡Comenzar la aventura! 🎹</button>
                `
            },
            {
                title: "📄 Sala de Partituras",
                content: `
                    <div class="puzzle">
                        <p>Encuentra el código en las fechas de Chopin:</p>
                        <p><strong>Nació:</strong> 1810 | <strong>Murió:</strong> 1849</p>
                        <input type="text" id="room1code" class="code-input" placeholder="____">
                        <small>Pista: 1849 - 1810</small>
                        <button class="answer-btn" onclick="game.checkCode(1, '39')">Verificar código</button>
                    </div>
                `
            },
            {
                title: "🇵🇱 Habitación Polaca",
                content: `
                    <div class="puzzle">
                        <p>Chopin era polaco. ¿En qué ciudad nació?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button class="answer-btn" onclick="game.selectAnswer(2, 'Varsovia')">Varsovia</button>
                            <button class="answer-btn" onclick="game.selectAnswer(2, 'Cracovia')">Cracovia</button>
                            <button class="answer-btn" onclick="game.selectAnswer(2, 'Gdansk')">Gdańsk</button>
                        </div>
                    </div>
                `
            },
            {
                title: "🎼 Salón de Conciertos",
                content: `
                    <div class="puzzle">
                        <p>¿Cuál es la obra más famosa de Chopin?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button class="answer-btn" onclick="game.selectAnswer(3, 'nocturno')">Nocturno Op.9</button>
                            <button class="answer-btn" onclick="game.selectAnswer(3, 'valsa')">Vals Op.64</button>
                            <button class="answer-btn" onclick="game.selectAnswer(3, 'mazurca')">Mazurca Op.17</button>
                        </div>
                    </div>
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/dy2glNcrkiw" title="Chopin Nocturno" allowfullscreen></iframe>
                    </div>
                `
            },
            {
                title: "🎨 Estudio del Compositor",
                content: `
                    <div class="puzzle">
                        <p>¿Qué instrumento tocaba Chopin casi exclusivamente?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button class="answer-btn" onclick="game.selectAnswer(4, 'piano')">Piano</button>
                            <button class="answer-btn" onclick="game.selectAnswer(4, 'violín')">Violín</button>
                            <button class="answer-btn" onclick="game.selectAnswer(4, 'flauta')">Flauta</button>
                        </div>
                    </div>
                `
            },
            {
                title: "🎉 ¡LIBRES! Certificado de Maestros Chopin",
                content: `
                    <div style="font-size: 1.5em; color: #90EE90;">
                        <h2>¡ENHORABUENA!</h2>
                        <p>Habéis escapado de la mansión de Chopin resolviendo todos los misterios.</p>
                        <p><strong>Habéis aprendido:</strong></p>
                        <ul style="text-align: left; display: inline-block;">
                            <li>Fechas de vida: 1810-1849</li>
                            <li>Nació en Varsovia (Polonia)</li>
                            <li>Especialista en piano</li>
                            <li>Compositor romántico polaco</li>
                        </ul>
                        <div style="margin-top: 30px;">
                            <button class="answer-btn" onclick="window.print()">📜 Imprimir Certificado</button>
                        </div>
                    </div>
                `
            }
        ];
    }

    loadRoom(index) {
        const container = document.getElementById('gameContainer');
        const room = this.rooms[index];
        container.innerHTML = `
            <div class="room">
                <h1>${room.title}</h1>
                ${room.content}
            </div>
        `;
        this.currentRoom = index;
        this.updateProgress();
    }

    nextRoom() {
        if (this.currentRoom < this.totalRooms - 1) {
            this.loadRoom(this.currentRoom + 1);
        }
    }

    checkCode(roomNum, correctCode) {
        const input = document.getElementById(`room${roomNum}code`);
        const puzzleDiv = input.parentElement;
        if (input.value === correctCode) {
            puzzleDiv.innerHTML += '<p class="success-msg">¡Correcto! 🎉</p>';
            setTimeout(() => this.nextRoom(), 1500);
        } else {
            puzzleDiv.innerHTML += '<p class="error-msg">¡Incorrecto! Inténtalo de nuevo.</p>';
        }
    }

    selectAnswer(roomNum, answer) {
        const puzzleDiv = document.querySelector('.puzzle');
        if (answer === 'Varsovia' || answer === 'nocturno' || answer === 'piano') {
            puzzleDiv.innerHTML += '<p class="success-msg">¡Excelente! Sigamos →</p>';
            setTimeout(() => this.nextRoom(), 1500);
        } else {
            puzzleDiv.innerHTML += '<p class="error-msg">¡No! Sigue intentando.</p>';
        }
    }

    updateProgress() {
        const progress = (this.currentRoom / (this.totalRooms - 1)) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressText').textContent = `${this.currentRoom + 1}/6 habitaciones`;
    }
}

const game = new ChopinEscapeRoom();
