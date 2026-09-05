(() => {
  // Reutiliza el mismo proyecto Firebase que el resto de nrpp.github.io (ver bestchat/chat.js).
  // La apiKey de Firebase no es secreta: la seguridad real la dan las Reglas de la base de datos.
  var firebaseConfig = {
    apiKey: "AIzaSyDve8JRi4IfQ_R3odAfhfalKLy6N_u8Br4",
    authDomain: "chat-261ba.firebaseapp.com",
    databaseURL: "https://chat-261ba-default-rtdb.firebaseio.com",
    projectId: "chat-261ba",
    storageBucket: "chat-261ba.firebasestorage.app",
    messagingSenderId: "532480688448",
    appId: "1:532480688448:web:fa038dd7c8b2118fa7baa5",
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // Todo el juego vive bajo esta rama, separada del resto de proyectos del sitio.
  const BASE_PATH = 'pilla_pilla/rooms';
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin caracteres ambiguos

  const STORAGE_KEY = 'pilla-pilla-session';
  let session = loadSession(); // { code, playerId, name }
  let myId = session?.playerId || null;
  let roomListenerRef = null;
  let lastSeenTagAt = null;

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function saveSession(data) {
    session = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clearSession() {
    session = null;
    myId = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  const screens = {
    home: document.getElementById('screen-home'),
    lobby: document.getElementById('screen-lobby'),
    game: document.getElementById('screen-game'),
    end: document.getElementById('screen-end'),
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ---------- Sonido y vibración ----------
  function alertTag() {
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      /* audio no disponible, no pasa nada */
    }
  }

  function showToast(text) {
    const toast = document.getElementById('tag-toast');
    document.getElementById('tag-toast-text').textContent = text;
    toast.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.add('hidden'), 3500);
  }

  function homeError(msg) {
    document.getElementById('home-error').textContent = msg || '';
  }

  // ---------- Helpers de datos ----------
  function roomRef(code) {
    return db.ref(`${BASE_PATH}/${code}`);
  }

  function playersArray(room) {
    const players = room.players || {};
    return Object.keys(players).map((id) => ({ id, ...players[id] }));
  }

  async function generateUniqueCode() {
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
      const snap = await roomRef(code).once('value');
      if (!snap.exists()) return code;
    }
    throw new Error('No se pudo generar un código de sala, inténtalo de nuevo');
  }

  function setupPresence(code, playerId) {
    // Si el jugador cierra la pestaña o pierde la conexión, el resto se entera solo.
    roomRef(code).child(`players/${playerId}/connected`).onDisconnect().set(false);
  }

  // ---------- Crear / unirse ----------
  document.getElementById('btn-create').addEventListener('click', async () => {
    const name = document.getElementById('create-name').value.trim();
    const numTaggers = parseInt(document.getElementById('create-taggers').value, 10);
    if (!name) return homeError('Escribe tu nombre');
    homeError('');
    try {
      const playerId = uuid();
      const code = await generateUniqueCode();
      await roomRef(code).set({
        status: 'lobby',
        numTaggers,
        hostId: playerId,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        players: {
          [playerId]: {
            name,
            role: 'runner',
            taggedAt: null,
            connected: true,
            joinedAt: firebase.database.ServerValue.TIMESTAMP,
          },
        },
      });
      setupPresence(code, playerId);
      myId = playerId;
      saveSession({ code, playerId, name });
      subscribeRoom(code);
    } catch (err) {
      console.error(err);
      homeError('No se pudo crear la sala. Revisa tu conexión e inténtalo de nuevo.');
    }
  });

  document.getElementById('btn-join').addEventListener('click', async () => {
    const code = document.getElementById('join-code').value.trim().toUpperCase();
    const name = document.getElementById('join-name').value.trim();
    if (!code || !name) return homeError('Rellena el código y tu nombre');
    homeError('');
    try {
      const snap = await roomRef(code).once('value');
      if (!snap.exists()) return homeError('Sala no encontrada');
      const room = snap.val();
      if (room.status !== 'lobby') return homeError('La partida ya ha empezado');

      const playerId = uuid();
      await roomRef(code).child(`players/${playerId}`).set({
        name,
        role: 'runner',
        taggedAt: null,
        connected: true,
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
      });
      setupPresence(code, playerId);
      myId = playerId;
      saveSession({ code, playerId, name });
      subscribeRoom(code);
    } catch (err) {
      console.error(err);
      homeError('No se pudo unir a la sala. Revisa tu conexión e inténtalo de nuevo.');
    }
  });

  // ---------- Lobby ----------
  document.getElementById('btn-start').addEventListener('click', () => {
    const numTaggers = parseInt(document.getElementById('lobby-taggers').value, 10);
    startGame(numTaggers);
  });

  document.getElementById('btn-leave-lobby').addEventListener('click', leaveRoom);
  document.getElementById('btn-leave-end').addEventListener('click', leaveRoom);

  async function leaveRoom() {
    if (session) {
      const { code, playerId } = session;
      try {
        const snap = await roomRef(code).once('value');
        const room = snap.val();
        if (room && room.status === 'lobby') {
          await roomRef(code).child(`players/${playerId}`).remove();
          const remaining = await roomRef(code).child('players').once('value');
          if (!remaining.exists()) await roomRef(code).remove();
        } else if (room) {
          await roomRef(code).child(`players/${playerId}/connected`).set(false);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (roomListenerRef) {
      roomListenerRef.off('value');
      roomListenerRef = null;
    }
    clearSession();
    showScreen('home');
  }

  // ---------- Juego ----------
  async function startGame(numTaggers) {
    const { code } = session;
    const snap = await roomRef(code).once('value');
    const room = snap.val();
    if (!room || room.hostId !== myId || room.status === 'playing') return;

    const ids = Object.keys(room.players || {});
    if (ids.length < 2) return;
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const taggerCount = Math.min(Math.max(numTaggers || room.numTaggers, 1), Math.max(ids.length - 1, 1));

    const updates = { status: 'playing', numTaggers: taggerCount, startedAt: firebase.database.ServerValue.TIMESTAMP };
    ids.forEach((id, idx) => {
      updates[`players/${id}/role`] = idx < taggerCount ? 'tagger' : 'runner';
      updates[`players/${id}/taggedAt`] = null;
    });
    await roomRef(code).update(updates);
  }

  document.getElementById('btn-end-game').addEventListener('click', async () => {
    const { code } = session;
    const snap = await roomRef(code).once('value');
    const room = snap.val();
    if (!room || room.hostId !== myId || room.status !== 'playing') return;
    await roomRef(code).update({ status: 'ended', endedAt: firebase.database.ServerValue.TIMESTAMP });
  });

  document.getElementById('btn-play-again').addEventListener('click', async () => {
    const { code } = session;
    const snap = await roomRef(code).once('value');
    const room = snap.val();
    if (!room || room.hostId !== myId) return;
    const updates = { status: 'lobby' };
    Object.keys(room.players || {}).forEach((id) => {
      updates[`players/${id}/role`] = 'runner';
      updates[`players/${id}/taggedAt`] = null;
    });
    await roomRef(code).update(updates);
  });

  async function tagPlayer(code, targetId, targetName) {
    const roleRef = roomRef(code).child(`players/${targetId}/role`);
    const result = await roleRef.transaction((current) => (current === 'runner' ? 'tagger' : current));
    if (!result.committed || result.snapshot.val() !== 'tagger') return; // ya lo había pillado otro

    const me = (session && session.name) || 'Alguien';
    await roomRef(code).update({
      [`players/${targetId}/taggedAt`]: firebase.database.ServerValue.TIMESTAMP,
      lastTag: {
        taggerId: myId,
        taggerName: me,
        targetId,
        targetName,
        at: firebase.database.ServerValue.TIMESTAMP,
      },
    });

    // Comprobamos si ya no queda nadie por pillar.
    const snap = await roomRef(code).once('value');
    const room = snap.val();
    const runnersLeft = playersArray(room).filter((p) => p.role === 'runner').length;
    if (runnersLeft === 0 && room.status === 'playing') {
      await roomRef(code).update({ status: 'ended', endedAt: firebase.database.ServerValue.TIMESTAMP });
    }
  }

  // Reclama el rol de anfitrión si el anterior ya no está en la sala (determinista: el id más bajo gana).
  function maybeReclaimHost(code, room) {
    const players = room.players || {};
    if (room.hostId && players[room.hostId]) return;
    const ids = Object.keys(players).sort();
    if (ids.length === 0) return;
    if (ids[0] !== myId) return; // solo actúa el candidato "elegido", evita carreras entre clientes
    roomRef(code).transaction((currentRoom) => {
      if (!currentRoom) return currentRoom;
      const currentPlayers = currentRoom.players || {};
      if (currentRoom.hostId && currentPlayers[currentRoom.hostId]) return currentRoom;
      const sortedIds = Object.keys(currentPlayers).sort();
      if (sortedIds.length === 0) return currentRoom;
      currentRoom.hostId = sortedIds[0];
      return currentRoom;
    });
  }

  // ---------- Render ----------
  function renderPlayerList(el, players, hostId, { showTagButton = false, code } = {}) {
    el.innerHTML = '';
    players.forEach((p) => {
      const li = document.createElement('li');

      const nameWrap = document.createElement('span');
      nameWrap.className = 'name';
      nameWrap.textContent = p.name + (p.id === myId ? ' (tú)' : '');

      if (p.id === hostId) {
        const b = document.createElement('span');
        b.className = 'badge host';
        b.textContent = 'Anfitrión';
        nameWrap.appendChild(b);
      }

      li.appendChild(nameWrap);

      const right = document.createElement('span');
      right.style.display = 'flex';
      right.style.gap = '6px';
      right.style.alignItems = 'center';

      if (p.role) {
        const roleBadge = document.createElement('span');
        roleBadge.className = 'badge ' + (p.role === 'tagger' ? 'tagger' : 'runner');
        roleBadge.textContent = p.role === 'tagger' ? '😈 Pilla' : '🏃 Corre';
        right.appendChild(roleBadge);
      }

      if (p.connected === false) {
        const off = document.createElement('span');
        off.className = 'badge offline';
        off.textContent = 'Desconectado';
        right.appendChild(off);
      }

      if (showTagButton) {
        const btn = document.createElement('button');
        btn.className = 'btn tag';
        btn.textContent = '¡Pillado!';
        btn.addEventListener('click', () => tagPlayer(code, p.id, p.name));
        right.appendChild(btn);
      }

      li.appendChild(right);
      el.appendChild(li);
    });
  }

  function renderLobby(code, room) {
    const players = playersArray(room);
    document.getElementById('lobby-code').textContent = code;
    document.getElementById('lobby-count').textContent = players.length;
    renderPlayerList(document.getElementById('lobby-players'), players, room.hostId);

    const isHost = room.hostId === myId;
    document.getElementById('host-controls').classList.toggle('hidden', !isHost);
    document.getElementById('lobby-hint').classList.toggle('hidden', isHost);
    document.getElementById('lobby-taggers').value = String(room.numTaggers);
  }

  function renderGame(code, room) {
    const players = playersArray(room);
    const me = players.find((p) => p.id === myId);
    const banner = document.getElementById('role-banner');
    const roleText = document.getElementById('role-text');

    if (me?.role === 'tagger') {
      banner.className = 'role-banner is-tagger';
      roleText.textContent = '😈 ¡La ligas! Ve a pillar a alguien';
    } else {
      banner.className = 'role-banner is-runner';
      roleText.textContent = '🏃 ¡Corre! Que no te pillen';
    }

    renderPlayerList(document.getElementById('game-players'), players, room.hostId);

    const runners = players.filter((p) => p.role === 'runner' && p.id !== myId);
    const tagControls = document.getElementById('tag-controls');
    if (me?.role === 'tagger' && runners.length > 0) {
      tagControls.classList.remove('hidden');
      renderPlayerList(document.getElementById('tag-targets'), runners, room.hostId, { showTagButton: true, code });
    } else {
      tagControls.classList.add('hidden');
    }

    const isHost = room.hostId === myId;
    document.getElementById('game-host-controls').classList.toggle('hidden', !isHost);
  }

  function renderEnd(room) {
    const players = playersArray(room);
    const ranking = players
      .slice()
      .sort((a, b) => {
        const at = a.taggedAt ?? Infinity;
        const bt = b.taggedAt ?? Infinity;
        return bt - at;
      });

    const isHost = room.hostId === myId;
    document.getElementById('end-host-controls').classList.toggle('hidden', !isHost);

    const el = document.getElementById('end-ranking');
    el.innerHTML = '';
    ranking.forEach((p, idx) => {
      const li = document.createElement('li');
      const medal = idx === 0 ? '🏆 ' : '';
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = `${medal}${p.name}${p.id === myId ? ' (tú)' : ''}`;
      li.appendChild(name);

      const status = document.createElement('span');
      status.className = 'badge ' + (p.taggedAt ? 'tagger' : 'runner');
      status.textContent = p.taggedAt ? 'Pillado' : 'Nunca pillado';
      li.appendChild(status);

      el.appendChild(li);
    });
  }

  function routeByStatus(code, room) {
    if (room.status === 'lobby') {
      renderLobby(code, room);
      showScreen('lobby');
    } else if (room.status === 'playing') {
      renderGame(code, room);
      showScreen('game');
    } else if (room.status === 'ended') {
      renderGame(code, room);
      renderEnd(room);
      showScreen('end');
    }
  }

  function subscribeRoom(code) {
    if (roomListenerRef) roomListenerRef.off('value');
    roomListenerRef = roomRef(code);
    roomListenerRef.on('value', (snap) => {
      const room = snap.val();
      if (!room) {
        clearSession();
        showScreen('home');
        homeError('La sala ha dejado de existir.');
        return;
      }

      if (room.lastTag && room.lastTag.at !== lastSeenTagAt) {
        const isFirstSync = lastSeenTagAt === null;
        lastSeenTagAt = room.lastTag.at;
        if (!isFirstSync) {
          alertTag();
          if (room.lastTag.targetId === myId) {
            showToast(`💥 ¡${room.lastTag.taggerName} te ha pillado! Ahora tú también pillas.`);
          } else {
            showToast(`⚡ ¡${room.lastTag.taggerName} ha pillado a ${room.lastTag.targetName}!`);
          }
        }
      }

      maybeReclaimHost(code, room);
      routeByStatus(code, room);
    });
  }

  // ---------- Arranque ----------
  if (session?.code && session?.playerId) {
    roomRef(session.code)
      .child(`players/${session.playerId}`)
      .once('value')
      .then((snap) => {
        if (!snap.exists()) {
          clearSession();
          showScreen('home');
          return;
        }
        myId = session.playerId;
        roomRef(session.code).child(`players/${session.playerId}/connected`).set(true);
        setupPresence(session.code, session.playerId);
        subscribeRoom(session.code);
      })
      .catch(() => {
        clearSession();
        showScreen('home');
      });
  }
})();
