/* chat.js */

// ⚠️ TU CONFIG DE FIREBASE (Project settings → Web app)
var firebaseConfig = {
  apiKey: "AIzaSyDve8JRi4IfQ_R3odAfhfalKLy6N_u8Br4",
  authDomain: "chat-261ba.firebaseapp.com",
  databaseURL: "https://chat-261ba-default-rtdb.firebaseio.com",
  projectId: "chat-261ba",
  storageBucket: "chat-261ba.firebasestorage.app",
  messagingSenderId: "532480688448",
  appId: "1:532480688448:web:fa038dd7c8b2118fa7baa5"
};

// CONTRASEÑAS (deben coincidir con index.html)
var PASSWORD = "mipass123";
var ADMIN_PASS = "adminpass123";

function getRoomId() {
  var params = new URLSearchParams(window.location.search);
  return params.get("room") || "sala1";
}
var ROOM_ID = getRoomId();

var MESSAGE_LIMIT = 200;
function $(id){ return document.getElementById(id); }

// Mostrar avisos en la página en vez de alert()
function showNotice(msg, timeoutMs) {
  try {
    var n = $("notice");
    if (n) {
      n.textContent = msg;
      if (timeoutMs) setTimeout(function(){
        if (n.textContent === msg) n.textContent = "";
      }, timeoutMs);
    } else {
      console.log("NOTICE:", msg);
    }
  } catch(e) { console.log(msg); }
}

// Comprobar acceso: aceptamos contraseña de sala O contraseña de admin
function checkAccess(){
  var pass = null, nick = null;
  try {
    pass = sessionStorage.getItem("chat_pass");
    nick = sessionStorage.getItem("chat_nick");
  } catch(e){}

  if (!pass) {
    window.location.href = "index.html";
    return null;
  }
  // ahora aceptamos admin también
  if (pass !== PASSWORD && pass !== ADMIN_PASS) {
    window.location.href = "index.html";
    return null;
  }
  if (!nick) {
    window.location.href = "index.html";
    return null;
  }
  return { nick: nick, isAdmin: pass === ADMIN_PASS };
}

var messagesRefGlobal = null;

// Inicia Firebase, auth anónima y listeners
function startChat(nick){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  $("nickLabel").innerHTML = "👤 " + nick;
  $("roomLabel").textContent = ROOM_ID;

  // iniciar auth anónima
  firebase.auth().signInAnonymously().catch(function(error){
    showNotice("Error de autenticación: " + error.message, 5000);
  });

  var db = firebase.database();
  // Exponer db globalmente para el fallback del modal
  window.database = db;

  // referencia a mensajes
  messagesRefGlobal = db.ref("rooms/" + ROOM_ID + "/messages");

  // Mostrar los últimos N mensajes y escuchar nuevos
  messagesRefGlobal
    .orderByChild("ts")
    .limitToLast(MESSAGE_LIMIT)
    .on("child_added", function(snap){
      var msg = snap.val();
      appendMessage(msg, nick);
    });

  // Si se borra un child - recargamos la lista (para mantener UI consistente)
  messagesRefGlobal.on("child_removed", function(){
    $("messages").innerHTML = "";
    // volver a cargar los que quedan (si hay)
    messagesRefGlobal.orderByChild("ts").limitToLast(MESSAGE_LIMIT).once("value", function(snapshot){
      snapshot.forEach(function(childSnap){
        appendMessage(childSnap.val(), nick);
      });
    });
  });

  $("sendBtn").addEventListener("click", function(){
    sendCurrentMessage(messagesRefGlobal, nick);
  });

  $("msgInput").addEventListener("keypress", function(e){
    if (e.keyCode === 13) {
      sendCurrentMessage(messagesRefGlobal, nick);
    }
  });

  try { $("msgInput").focus(); } catch(e){}
}

// Función pública para borrar chat (la invoca el modal)
window.deleteChat = function(){
  if (!messagesRefGlobal) {
    showNotice("No conectado a la base de datos", 4000);
    return;
  }
  messagesRefGlobal.remove()
    .then(function(){
      $("messages").innerHTML = "";
      showNotice("Chat borrado ✅", 4000);
    })
    .catch(function(err){
      showNotice("Error al borrar: " + (err && err.message ? err.message : err), 6000);
    });
};

function sendCurrentMessage(messagesRef, nick){
  var text = $("msgInput").value.replace(/^\s+|\s+$/g, '');
  if (!text) return;

  // Antiflood básico: limitar a 1 mensaje cada 500ms
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
      showNotice("No se pudo enviar: " + err.message, 4000);
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

  // Auto-scroll
  box.scrollTop = box.scrollHeight;
}

function formatTime(d){
  function pad(n){ return (n<10?"0":"") + n; }
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + " " +
         pad(d.getDate()) + "/" + pad(d.getMonth()+1);
}

// ---- bootstrap ----
var auth = checkAccess();
if (auth) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ startChat(auth.nick); });
  } else {
    startChat(auth.nick);
  }
}