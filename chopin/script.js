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
    }

    setupAudio() {
        const music = document.getElementById('backgroundMusic');
        music.volume = 0.2;
    }

    createRooms() {
        return [
            {
                title: "🏰 Bienvenidos a la Mansión de Chopin",
                content: `
                    <p style="font-size: 1.3em; line-height: 1.6;">
                        <strong>París, 1838</strong><br>
                        Estáis atrapados en la mansión del gran <strong>Frédéric Chopin</strong>. 
                        Para escapar, debéis resolver 6 misterios sobre su vida y música.
                    </p>
                    <p style="font-style: italic; font-size: 1.2em; color: #d4af37; margin: 30px 0;">
                        <em>"La música es más que matemáticas"</em><br>
                        <strong>- F. Chopin</strong>
                    </p>
                    <button onclick="game.nextRoom()" style="font-size: 22px; padding: 25px 50px;">
                        ¡Comenzar la aventura! 🎹✨
                    </button>
                `
            },
            {
                title: "📄 Sala de Partituras",
                content: `
                    <div class="puzzle">
                        <p style="font-size: 1.3em;">Encuentra el código en las fechas de Chopin:</p>
                        <p style="font-size: 1.5em; color: #d4af37;">
                            <strong>Nació:</strong> 1810 | <strong>Murió:</strong> 1849
                        </p>
                        <p>¿Cuál es la diferencia? 
                            <input type="text" id="room1code" placeholder="____" maxlength="2">
                        </p>
                        <small style="color: #ccc;">Pista: 1849 - 1810 = ?</small>
                    </div>
                    <button onclick="game.checkCode(1, '39')">🔍 Verificar código</button>
                `
            },
            {
                title: "🇵🇱 Habitación Polaca",
                content: `
                    <div class="puzzle">
                        <p style="font-size: 1.3em;">Chopin era polaco. ¿En qué ciudad nació?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(2, 'Varsovia')" style="background: linear-gradient(45deg, #90EE90, #32CD32)">Varsovia 🇵🇱</button>
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
                        <p style="font-size: 1.3em;">¿Cuál es la obra más famosa de Chopin?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(3, 'nocturno')" style="background: linear-gradient(45deg, #90EE90, #32CD32)">Nocturno Op.9 🎵</button>
                            <button onclick="game.selectAnswer(3, 'valsa')">Vals Op.64</button>
                            <button onclick="game.selectAnswer(3, 'mazurca')">Mazurca Op.17</button>
                        </div>
                    </div>
                    <div class="video-container">
                        <iframe width="560" height="315" 
                                src="https://www.youtube-nocookie.com/embed/IVpuTD-2SEo?si=IlO8z6WjZNN-oRwU&amp;controls=0" 
                                title="Nocturno de Chopin" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>
                        </iframe>
                    </div>
                `
            },
            {
                title: "🎨 Estudio del Compositor",
                content: `
                    <div class="puzzle">
                        <p style="font-size: 1.3em;">¿Qué instrumento tocaba Chopin casi exclusivamente?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button onclick="game.selectAnswer(4, 'piano')" style="background: linear-gradient(45deg, #90EE90, #32CD32)">Piano 🎹</button>
                            <button onclick="game.selectAnswer(4, 'violín')">Violín</button>
                            <button onclick="game.selectAnswer(4, 'flauta')">Flauta</button>
                        </div>
                    </div>
                `
            },
            {
                title: "🎉 ¡LIBRES! Certificado de Maestros Chopin",
                content: `
                    <div style="font-size: 1.6em; color: #90EE90; text-shadow: 0 0 30px rgba(144, 238, 144, 0.7);">
                        <h2 style="font-size: 3em; margin-bottom: 20px;">🏆 ENHORABUENA 🏆</h2>
                        <p style="font-size: 1.4em;">¡Habéis escapado de la mansión de Chopin resolviendo todos los misterios!</p>
                        
                        <div style="margin: 40px 0;">
                            <h3 style="color: #d4af37; font-size: 2em;">📜 Certificado de Experto</h3>
                            <p><strong>Nombre:</strong> [Tu nombre]</p>
                            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                            <p><strong>Logros:</strong></p>
                        </div>
                        
                        <ul style="text-align: left; display: inline-block; font-size: 1.3em;">
                            <li>✅ Fechas de vida: 1810-1849</li>
                            <li>✅ Nació en Varsovia (Polonia)</li>
                            <li>✅ Especialista en piano</li>
                            <li>✅ Conoce sus obras más famosas</li>
                            <li>✅ ¡Maestro de la música romántica! 🎹</li>
                        </ul>
                        
                        <div style="margin-top: 40px;">
                            <button onclick="window.print()" style="font-size: 28px; padding: 25px 60px; background: linear-gradient(45deg, #90EE90, #32CD32);">
                                🏅 Imprimir Certificado
                            </button>
                            <br><br>
                            <button onclick="location.reload()" style="font-size: 18px; padding: 15px 30px;">
                                🔄 Jugar de nuevo
                            </button>
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
        if (input.value.trim() === correctCode) {
            input.style.borderColor = '#90EE90';
            document.querySelector('.puzzle').innerHTML += 
                '<p class="success">¡Correcto! 🎉 Avanzando...</p>';
            setTimeout(() => this.nextRoom(), 2000);
        } else {
            input.style.borderColor = '#ff6b6b';
            input.value = '';
            document.querySelector('.puzzle').innerHTML += 
                '<p style="color: #ff6b6b; font-size: 1.2em;">❌ Incorrecto. Inténtalo de nuevo.</p>';
        }
    }

    selectAnswer(roomNum, answer) {
        if (answer === 'Varsovia' || answer === 'nocturno' || answer === 'piano') {
            document.querySelector('.puzzle').innerHTML += 
                '<p class="success">¡Excelente! 🎊 Sigamos →</p>';
            setTimeout(() => this.nextRoom(), 2000);
        } else {
            document.querySelector('.puzzle').innerHTML += 
                '<p style="color: #ff6b6b; font-size: 1.2em;">❌ No es correcto. ¡Sigue intentando!</p>';
        }
    }

    updateProgress() {
        const progress = (this.currentRoom / (this.totalRooms - 1)) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressText').textContent = 
            `${this.currentRoom + 1}/6 habitaciones completadas`;
    }
}

// Inicializar juego
const game = new ChopinEscapeRoom();
