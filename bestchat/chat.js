/* chat.js */

var firebaseConfig = {
  apiKey: "AIzaSyDve8JRi4IfQ_R3odAfhfalKLy6N_u8Br4",
  authDomain: "chat-261ba.firebaseapp.com",
  databaseURL: "https://chat-261ba-default-rtdb.firebaseio.com",
  projectId: "chat-261ba",
  storageBucket: "chat-261ba.firebasestorage.app",
  messagingSenderId: "532480688448",
  appId: "1:532480688448:web:fa038dd7c8b2118fa7baa5"
};

// ─── NVIDIA API ────────────────────────────────────────────────────────────
// ⚠️  Esta key es visible en el código fuente (F12). Lo sabemos y es aceptado.
// Para protegerla en el futuro, usa un Cloudflare Worker como proxy.
var NVIDIA_API_KEY = "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"; // ← pega aquí tu key de build.nvidia.com
var NVIDIA_MODEL   = "meta/llama-3.1-8b-instruct"; // modelo gratuito de NVIDIA NIM
var NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
var AI_NICK        = "🤖 IA";
var AI_TRIGGER     = "@ai"; // escribe @ai al inicio del mensaje para invocar la IA

// ─── Config general ─────────────────────────────────────────────────────────
var AI_ROOM        = "alex"; // sala donde la IA está activa
var MESSAGE_LIMIT  = 200;

function getRoomId() {
  var params = new URLSearchParams(window.location.search);
  return params.get("room") || "sala1";
}
var ROOM_ID = getRoomId();
var AI_ENABLED = (ROOM_ID === AI_ROOM);

function $(id){ return document.getElementById(id); }

function showNotice(msg, timeoutMs) {
  var n = $("notice");
  if (n) {
    n.textContent = msg;
    if (timeoutMs) setTimeout(function(){ if (n.textContent === msg) n.textContent = ""; }, timeoutMs);
  }
}

// ─── Autenticación ──────────────────────────────────────────────────────────
function checkAccess() {
  var nick  = sessionStorage.getItem("chat_nick");
  var uid   = sessionStorage.getItem("chat_uid");
  var email = sessionStorage.getItem("chat_email");
  if (!nick || !uid) {
    window.location.href = "index.html";
    return null;
  }
  var isAdmin = sessionStorage.getItem("is_admin") === "1";
  return { nick: nick, uid: uid, email: email, isAdmin: isAdmin };
}

// ─── Referencia global ──────────────────────────────────────────────────────
var messagesRefGlobal = null;
window.database = null;

// ─── Inicio del chat ────────────────────────────────────────────────────────
function startChat(user) {
  var nick = user.nick;

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  $("nickLabel").innerHTML = "👤 " + nick;
  $("roomLabel").textContent = ROOM_ID + (AI_ENABLED ? " 🤖" : "");

  // Verificar sesión Firebase activa o re-autenticar anónimamente como fallback
  firebase.auth().onAuthStateChanged(function(fbUser) {
    if (!fbUser) {
      // Si no hay sesión activa (p.ej. recarga), redirigir al login
      // En Kindle el sessionStorage persiste mientras el tab viva, así que esto
      // solo pasa si Firebase pierde la sesión por timeout.
      showNotice("Sesión expirada, vuelve a entrar.", 5000);
      setTimeout(function(){ window.location.href = "index.html"; }, 2500);
    }
  });

  var db = firebase.database();
  window.database = db;
  messagesRefGlobal = db.ref("rooms/" + ROOM_ID + "/messages");

  messagesRefGlobal
    .orderByChild("ts")
    .limitToLast(MESSAGE_LIMIT)
    .on("child_added", function(snap) {
      appendMessage(snap.val(), nick);
    });

  $("sendBtn").addEventListener("click", function(){ sendCurrentMessage(messagesRefGlobal, nick); });
  $("msgInput").addEventListener("keypress", function(e){
    if (e.keyCode === 13) sendCurrentMessage(messagesRefGlobal, nick);
  });

  if (AI_ENABLED) {
    showNotice("💡 Sala con IA activa — escribe @ai [pregunta] para consultar a la IA", 7000);
  }
}

// ─── Borrar chat (admin) ─────────────────────────────────────────────────────
window.deleteChat = function() {
  if (!messagesRefGlobal) return;
  messagesRefGlobal.remove()
    .then(function(){ $("messages").innerHTML = ""; showNotice("Chat borrado ✅", 4000); })
    .catch(function(err){ showNotice("Error al borrar: " + err.message, 5000); });
};

// ─── Enviar mensaje ──────────────────────────────────────────────────────────
function sendCurrentMessage(messagesRef, nick) {
  var text = $("msgInput").value.trim();
  if (!text) return;
  if (window.__lastSendTs && Date.now() - window.__lastSendTs < 500) return;
  window.__lastSendTs = Date.now();

  var msg = { nick: nick, text: text, ts: Date.now() };

  messagesRef.push(msg, function(err) {
    if (!err) {
      $("msgInput").value = "";

      // ¿Trigger de IA?
      if (AI_ENABLED && text.toLowerCase().startsWith(AI_TRIGGER)) {
        var question = text.slice(AI_TRIGGER.length).trim();
        if (question) {
          askNvidiaAI(question, messagesRef);
        } else {
          showNotice("Escribe algo después de @ai 😊", 3000);
        }
      }
    }
  });
}

// ─── NVIDIA AI ───────────────────────────────────────────────────────────────
function askNvidiaAI(question, messagesRef) {
  showNotice("🤖 IA pensando…");

  var payload = {
    model: NVIDIA_MODEL,
    messages: [
      {
        role: "system",
        content: "Eres un asistente de chat útil y conciso. Responde siempre en español, de forma clara y breve. Estás integrado en un chat privado."
      },
      {
        role: "user",
        content: question
      }
    ],
    max_tokens: 512,
    temperature: 0.7,
    stream: false
  };

  fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + NVIDIA_API_KEY
    },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  })
  .then(function(data) {
    var reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim()
      : "No pude obtener una respuesta.";

    var aiMsg = { nick: AI_NICK, text: reply, ts: Date.now(), isAI: true };
    messagesRef.push(aiMsg, function(err) {
      if (!err) showNotice("", 0);
    });
  })
  .catch(function(err) {
    showNotice("⚠️ Error de IA: " + err.message, 6000);
    console.error("NVIDIA API error:", err);
  });
}

// ─── Renderizar mensaje ──────────────────────────────────────────────────────
function appendMessage(msg, myNick) {
  var box = $("messages");
  var div = document.createElement("div");

  var isMe = msg.nick === myNick;
  var isAI = msg.isAI === true || msg.nick === AI_NICK;

  div.className = "msg" + (isMe ? " me" : "") + (isAI ? " ai" : "");

  var time = formatTime(new Date(msg.ts || Date.now()));
  var meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = msg.nick + " • " + time;

  var body = document.createElement("div");
  body.textContent = msg.text;

  div.appendChild(meta);
  div.appendChild(body);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function formatTime(d) {
  return d.getHours().toString().padStart(2,"0") + ":" +
         d.getMinutes().toString().padStart(2,"0") + " " +
         d.getDate() + "/" + (d.getMonth()+1);
}

// ─── Arranque ────────────────────────────────────────────────────────────────
var auth = checkAccess();
if (auth) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ startChat(auth); });
  } else {
    startChat(auth);
  }
}
