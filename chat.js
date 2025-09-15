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

var PASSWORD = "mipass123";
var ADMIN_PASS = "adminpass123";

function getRoomId() {
  var params = new URLSearchParams(window.location.search);
  return params.get("room") || "sala1";
}
var ROOM_ID = getRoomId();

var MESSAGE_LIMIT = 200;
function $(id){ return document.getElementById(id); }

function showNotice(msg, timeoutMs) {
  var n = $("notice");
  if (n) {
    n.textContent = msg;
    if (timeoutMs) setTimeout(() => { if (n.textContent === msg) n.textContent = ""; }, timeoutMs);
  } else {
    console.log("NOTICE:", msg);
  }
}

function checkAccess(){
  var pass = sessionStorage.getItem("chat_pass");
  var nick = sessionStorage.getItem("chat_nick");
  if (!pass || !nick) { window.location.href = "index.html"; return null; }
  if (pass !== PASSWORD && pass !== ADMIN_PASS) { window.location.href = "index.html"; return null; }
  return { nick: nick, isAdmin: pass === ADMIN_PASS };
}

var messagesRefGlobal = null;
window.database = null;

function startChat(nick){
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  $("nickLabel").innerHTML = "👤 " + nick;
  $("roomLabel").textContent = ROOM_ID;

  firebase.auth().signInAnonymously().catch(err => showNotice("Error auth: " + err.message, 5000));

  var db = firebase.database();
  window.database = db;
  messagesRefGlobal = db.ref("rooms/" + ROOM_ID + "/messages");

  messagesRefGlobal.orderByChild("ts").limitToLast(MESSAGE_LIMIT).on("child_added", snap => {
    appendMessage(snap.val(), nick);
  });

  $("sendBtn").addEventListener("click", () => sendCurrentMessage(messagesRefGlobal, nick));
  $("msgInput").addEventListener("keypress", e => { if (e.keyCode === 13) sendCurrentMessage(messagesRefGlobal, nick); });
}

window.deleteChat = function(){
  if (!messagesRefGlobal) return;
  messagesRefGlobal.remove().then(() => {
    $("messages").innerHTML = "";
    showNotice("Chat borrado ✅", 4000);
  }).catch(err => showNotice("Error al borrar: " + err.message, 5000));
};

function sendCurrentMessage(messagesRef, nick){
  var text = $("msgInput").value.trim();
  if (!text) return;
  if (window.__lastSendTs && Date.now() - window.__lastSendTs < 500) return;
  window.__lastSendTs = Date.now();

  var msg = { nick: nick, text: text, ts: Date.now() };
  messagesRef.push(msg, err => { if (!err) $("msgInput").value = ""; });
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
  box.scrollTop = box.scrollHeight;
}

function formatTime(d){
  return d.getHours().toString().padStart(2,"0") + ":" +
         d.getMinutes().toString().padStart(2,"0") + " " +
         d.getDate() + "/" + (d.getMonth()+1);
}

var auth = checkAccess();
if (auth) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => startChat(auth.nick));
  } else {
    startChat(auth.nick);
  }
}