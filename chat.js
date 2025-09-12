/* chat.js */

// ⚠️ CAMBIA ESTE OBJETO POR TU CONFIG DE FIREBASE
var firebaseConfig = {
  apiKey: "AIzaSyDve8JRi4IfQ_R3odAfhfalKLy6N_u8Br4",
  authDomain: "chat-261ba.firebaseapp.com",
  databaseURL: "https://chat-261ba-default-rtdb.firebaseio.com",
  projectId: "chat-261ba",
  storageBucket: "chat-261ba.firebasestorage.app",
  messagingSenderId: "532480688448",
  appId: "1:532480688448:web:fa038dd7c8b2118fa7baa5"
};

// ⚠️ La misma contraseña que en index.html
var PASSWORD = "mipass123";

function getRoomId() {
  var params = new URLSearchParams(window.location.search);
  return params.get("room") || "sala1";
}
var ROOM_ID = getRoomId();

var MESSAGE_LIMIT = 200;

function $(id){ return document.getElementById(id); }

// --- comprobar acceso ---
function checkAccess(){
  var pass = null, nick = null;
  try {
    pass = sessionStorage.getItem("chat_pass");
    nick = sessionStorage.getItem("chat_nick");
  } catch(e){}

  if (!pass || pass !== PASSWORD) {
    window.location.href = "index.html";
    return null;
  }
  if (!nick) {
    window.location.href = "index.html";
    return null;
  }
  return { nick: nick };
}

// --- iniciar chat ---
function startChat(nick){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  $("nickLabel").innerHTML = "👤 " + nick;
  $("roomLabel").textContent = ROOM_ID;

  firebase.auth().signInAnonymously().catch(function(error){
    alert("Error de autenticación: " + error.message);
  });

  var db = firebase.database();
  var messagesRef = db.ref("rooms/" + ROOM_ID + "/messages");

  // <<<< Si es admin, mostrar botón de borrar chat
  if (nick.toLowerCase() === "admin") {
    var clearBtn = $("clearBtn");
    if (clearBtn) {
      clearBtn.style.display = "inline-block";
      clearBtn.addEventListener("click", function(){
        if (confirm("¿Seguro que quieres borrar todos los mensajes? 🚨")) {
          messagesRef.remove()
            .then(() => alert("Chat borrado ✅"))
            .catch(err => alert("Error: " + err));
        }
      });
    }
  }

  // Escuchar mensajes
  messagesRef
    .orderByChild("ts")
    .limitToLast(MESSAGE_LIMIT)
    .on("child_added", function(snap){
      var msg = snap.val();
      appendMessage(msg, nick);
    });

  $("sendBtn").addEventListener("click", function(){
    sendCurrentMessage(messagesRef, nick);
  });

  $("msgInput").addEventListener("keypress", function(e){
    if (e.keyCode === 13) {
      sendCurrentMessage(messagesRef, nick);
    }
  });

  try { $("msgInput").focus(); } catch(e){}
}

function sendCurrentMessage(messagesRef, nick){
  var text = $("msgInput").value.replace(/^\s+|\s+$/g, '');
  if (!text) return;

  if (window.__lastSendTs && Date.now() - window.__lastSendTs < 500) {
    return;
  }
  window.__lastSendTs = Date.now();

  var msg = {
    nick: nick,
    text: text,
    ts: Date.now()
  };

  messagesRef.push(msg, function(err){
    if (err) {
      alert("No se pudo enviar: " + err.message);
    } else {
      $("msgInput").value = "";
    }
  });
}

function appendMessage(msg, myNick){
  var box = $("messages");
  var div = document.createElement("div");
  div.className = "msg" + (msg.nick === myNick ? " me" : "");
  var time = formatTime(new Date(msg.ts || Date.now()));
  var meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = msg.nick + " • " + time;
  var body = document.createElement("div");
  body.textContent = msg.text;
  div.appendChild(meta);
  div.appendChild(body);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight + 1000;
}

function formatTime(d){
  function pad(n){ return (n<10?"0":"") + n; }
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + " " +
         pad(d.getDate()) + "/" + pad(d.getMonth()+1);
}

// --- bootstrap ---
var auth = checkAccess();
if (auth) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ startChat(auth.nick); });
  } else {
    startChat(auth.nick);
  }
    }
