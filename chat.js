/* chat.js */

// ⚠️ CAMBIA ESTE OBJETO POR TU CONFIG DE FIREBASE (Project settings → General → Your apps → Web app)
var firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://TU_PROJECT_ID-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX"
};

// ⚠️ La misma contraseña que en index.html
var PASSWORD = "mipass123";

// Id de sala (puedes tener varias salas si quieres)
var ROOM_ID = "sala1";

// Límite de mensajes que cargamos (historial visible)
var MESSAGE_LIMIT = 200;

function $(id){ return document.getElementById(id); }

// Comprobar acceso por contraseña desde sessionStorage
function checkAccess(){
  var pass = null, nick = null;
  try {
    pass = sessionStorage.getItem("chat_pass");
    nick = sessionStorage.getItem("chat_nick");
  } catch(e){}

  if (!pass || pass !== PASSWORD) {
    // Si no hay pass o no coincide, volvemos a la portada
    window.location.href = "index.html";
    return null;
  }
  if (!nick) {
    window.location.href = "index.html";
    return null;
  }
  return { nick: nick };
}

// Inicia Firebase, auth anónima y listeners
function startChat(nick){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  $("nickLabel").innerHTML = "👤 " + nick;

  // Iniciar sesión anónima (necesario por reglas de escritura)
  firebase.auth().signInAnonymously().catch(function(error){
    alert("Error de autenticación: " + error.message);
  });

  var db = firebase.database();
  var messagesRef = db.ref("rooms/" + ROOM_ID + "/messages");

  // Mostrar los últimos N mensajes y escuchar nuevos
  messagesRef
    .orderByChild("ts")
    .limitToLast(MESSAGE_LIMIT)
    .on("child_added", function(snap){
      var msg = snap.val();
      appendMessage(msg, nick);
    });

  // Enviar al pulsar botón
  $("sendBtn").addEventListener("click", function(){
    sendCurrentMessage(messagesRef, nick);
  });

  // Enviar con Enter
  $("msgInput").addEventListener("keypress", function(e){
    if (e.keyCode === 13) {
      sendCurrentMessage(messagesRef, nick);
    }
  });

  // Auto focus para Kindle si es posible
  try { $("msgInput").focus(); } catch(e){}
}

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

  // Auto-scroll
  box.scrollTop = box.scrollHeight + 1000;
}

function formatTime(d){
  // hh:mm dd/mm
  function pad(n){ return (n<10?"0":"") + n; }
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + " " +
         pad(d.getDate()) + "/" + pad(d.getMonth()+1);
}

// ---- bootstrap ----
var auth = checkAccess();
if (auth) {
  // Esperar a que el DOM esté del todo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ startChat(auth.nick); });
  } else {
    startChat(auth.nick);
  }
}
