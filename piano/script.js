const NOTE_FREQUENCIES = {
    "C": 261.63,
    "Db": 277.18,
    "D": 293.66,
    "Eb": 311.13,
    "E": 329.63,
    "F": 349.23,
    "Gb": 369.99,
    "G": 392.00,
    "Ab": 415.30,
    "A": 440.00,
    "Bb": 466.16,
    "B": 493.88,
};

const KEY_MAP = {
    'a':'C',
    's':'D',
    'd':'E',
    'f':'F',
    'g':'G',
    'h':'A',
    'j':'B',
    'w':'Db',
    'e':'Eb',
    't':'Gb',
    'y':'Ab',
    'u':'Bb',

}

let audioCtx = null;
const activeOscillators = {};

function initAudio(){
    if (!audioCtx){
        audioCtx = new (window.AudioContext || window.webkitAudioContext);
    }
}

function playNote(keyElement){
    initAudio();

    const note = keyElement.dataset.note;
    const frequency = NOTE_FREQUENCIES[note];

    if (!frequency || activeOscillators[note]) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.02);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();

    activeOscillators[note] = {osc,gainNode};
    keyElement.classList.add('active');
}

function stopNote(keyElement){
    const note = keyElement.dataset.note;
    const activeNode = activeOscillators[note];

    if (activeNode){
        const {osc, gainNode} = activeNode;

        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

        osc.stop(audioCtx.currentTime + 0.1);

        delete activeOscillators[note];
        keyElement.classList.remove('active');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const keys = document.querySelectorAll(".key");

    keys.forEach(key =>{
        key.addEventListener("mousedown", () => playNote(key));
        key.addEventListener("mouseup", () => stopNote(key));
        key.addEventListener("mouseleave", () => stopNote(key));

        key.addEventListener("touchstart", (e) =>{
            e.preventDefault();
            playNote(key);
        });
        key.addEventListener("touchend", () => stopNote(key));
    });

    document.getElementById("btnSong").addEventListener("click", playSong);
});

window.addEventListener("keydown", (e)=>{
    if (e.repeat) return;

    const note = KEY_MAP[e.key.toLowerCase()];
    if (note){
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) playNote(keyElement);
    }
});

window.addEventListener("keyup", (e) =>{
    const note = KEY_MAP[e.key.toLowerCase()];
    if (note){
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) stopNote(keyElement);
    }
});

function playSong(){
    const song = [
        {note: "C", dur: 300},
        {note: "C", dur: 300},
        {note: "D", dur: 500},
        {note: "C", dur: 500},
        {note: "F", dur: 500},
        {note: "E", dur: 800},
    ];

    let timeOffset = 0;

    song.forEach(step => {
        setTimeout(() => {
            const keyElement = document.querySelector(`[data-note="${step.note}"]`);
            if (keyElement){
                playNote(keyElement);
                setTimeout(() => stopNote(keyElement), step.dur);
            }
        }, timeOffset);
        timeOffset += step.dur + 100;
    });
}