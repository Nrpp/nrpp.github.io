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
                    <p><strong>París, 1838</strong>. Estáis atrapados en la mansión del gran Frédéric Chopin. 
                    Para escapar, debéis resolver 6 misterios sobre su vida y música.</p>
                    <p><em>"La música es más que matemáticas"</em> - F. Chopin</p>
                    <button onclick="game.nextRoom()">¡Comenzar la aventura! 🎹</button>
                `
            },
            {
                title: "📄 Sala de Partituras",
                content: `
                    <div class="puzzle">
                        <p>Encuentra el código en las fechas de Chopin:</p>
                        <p><strong>Nació:</strong> 1810 | <strong>Murió:</strong> 1849</p>
                        <p>¿Cuál es la diferencia? <input type="text" id="room1code" placeholder="____"></p>
                        <small>Pista: 1849 - 1810</small>
                    </div>
                    <button onclick="game.checkCode(1, '39')">Verificar código</button>
                `
            },
            {
                title: "🇵🇱 Habitación Polaca",
                content: `
                    <div class="puzzle">
                        <p>Chopin era polaco. ¿En qué ciudad nació?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(2, 'Varsovia')">Varsovia</button>
                            <button onclick="game.selectAnswer(2, 'Cracovia')">Cracovia</button>
                            <button onclick="game.selectAnswer(2, 'Gdansk')">Gdańsk</button>
                        </div>
                    </div>
                `
            },
            {
                title: "🎼 Salón de Conciertos",
                content: `
                    <div class="puzzle">
                        <p>¿Cuál es la obra más famosa de Chopin?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(3, 'nocturno')">Nocturno Op.9</button>
                            <button onclick="game.selectAnswer(3, 'valsa')">Vals Op.64</button>
                            <button onclick="game.selectAnswer(3, 'mazurca')">Mazurca Op.17</button>
                        </div>
                    </div>
                    <div class="video-container">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/dy2glNcrkiw" 
                            title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `
            },
            {
                title: "🎨 Estudio del Compositor",
                content: `
                    <div class="puzzle">
                        <p>¿Qué instrumento tocaba Chopin casi exclusivamente?</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(4, 'piano')">Piano</button>
                            <button onclick="game.selectAnswer(4, 'violín')">Violín</button>
                            <button onclick="game.selectAnswer(4, 'flauta')">Flauta</button>
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
                            <button onclick="window.print()" style="font-size: 24px; padding: 20px 40px;">📜 Imprimir Certificado</button>
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
        if (input.value === correctCode) {
            document.querySelector('.puzzle').innerHTML += '<p class="success">¡Correcto! 🎉</p>';
            setTimeout(() => this.nextRoom(), 1500);
        } else {
            document.querySelector('.puzzle').innerHTML += '<p style="color: #ff6b6b;">¡Incorrecto! Inténtalo de nuevo.</p>';
        }
    }

    selectAnswer(roomNum, answer) {
        if (answer === 'Varsovia' || answer === 'nocturno' || answer === 'piano') {
            document.querySelector('.puzzle').innerHTML += '<p class="success">¡Excelente! Sigamos →</p>';
            setTimeout(() => this.nextRoom(), 1500);
        } else {
            document.querySelector('.puzzle').innerHTML += '<p style="color: #ff6b6b;">¡No! Sigue intentando.</p>';
        }
    }

    updateProgress() {
        const progress = (this.currentRoom / (this.totalRooms - 1)) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressText').textContent = `${this.currentRoom + 1}/6 habitaciones`;
    }
}

// Inicializar juego
const game = new ChopinEscapeRoom();
