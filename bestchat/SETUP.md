# 🛠 Guía de configuración del Chat

## 1. Configurar Firebase Auth (usuarios reales, sin contraseñas en el código)

### Paso 1 — Activar Email/Password en Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto `chat-261ba`
3. Menú izquierdo → **Authentication** → **Sign-in method**
4. Activa **Email/Password** → Guardar

### Paso 2 — Crear los usuarios
1. En Authentication → pestaña **Users** → **Add user**
2. Crea el usuario normal:
   - Email: `usuario@tuchat.local` (o el que quieras)
   - Contraseña: la que decidas (mínimo 6 caracteres)
3. Crea el usuario admin:
   - Email: `admin@tuchat.local` (o el que quieras)
   - Contraseña: la que decidas

> ⚠️ Estos emails **no tienen que ser reales** — Firebase acepta cualquier formato válido.
> Son solo identificadores de login, no se envían correos.

### Paso 3 — Actualizar el ADMIN_EMAIL en index.html
Abre `index.html` y cambia esta línea:
```js
var ADMIN_EMAIL = "admin@tuchat.local"; // ← pon aquí el email de tu usuario admin
```

---

## 2. Actualizar las reglas de Firebase Database

En la consola de Firebase → **Realtime Database** → **Rules**, pon:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    }
  }
}
```

Esto asegura que **solo usuarios autenticados** puedan leer/escribir. Antes era abierto.

---

## 3. Configurar la API de NVIDIA

### Obtener la key gratuita
1. Ve a [build.nvidia.com](https://build.nvidia.com)
2. Regístrate / inicia sesión
3. Busca el modelo `meta/llama-3.1-8b-instruct` (o cualquier otro gratuito)
4. Haz clic en **Get API Key**
5. Copia la key (empieza por `nvapi-...`)

### Pegarla en chat.js
Abre `chat.js` y cambia esta línea:
```js
var NVIDIA_API_KEY = "TU_NVIDIA_API_KEY_AQUI"; // ← pega aquí tu key
```

### Cambiar el modelo (opcional)
Los modelos gratuitos disponibles en NVIDIA NIM incluyen:
- `meta/llama-3.1-8b-instruct` ← recomendado (rápido, gratis)
- `meta/llama-3.1-70b-instruct` (más capaz, más lento)
- `mistralai/mistral-7b-instruct-v0.3`
- `google/gemma-7b`

---

## 4. Cómo usar la IA en el chat

- Entra a la sala: `chat.html?room=alex`
- Escribe: `@ai ¿cuál es la capital de Francia?`
- La IA responderá automáticamente en el chat (visible para todos en la sala)

> 💡 La IA solo está activa en la sala `alex`. Para activarla en otra sala,
> cambia `var AI_ROOM = "alex"` en `chat.js`.

---

## 5. Subir a GitHub Pages

Sube los 4 archivos:
- `index.html`
- `chat.html`
- `chat.js`
- `style.css`

Y asegúrate de que GitHub Pages esté activado en Settings → Pages.

---

## ¿Por qué la apiKey de Firebase sigue visible?

La `apiKey` de Firebase en el código **no es un secreto** — por diseño de Firebase,
es un identificador público del proyecto. La seguridad real viene de las **Firebase Rules**
(paso 2), que impiden el acceso sin autenticación. Nadie puede leer/escribir tu base de datos
sin haber hecho login con un usuario válido.

Lo que SÍ ocultamos (al migrar a Firebase Auth) son las **contraseñas de acceso**,
que antes estaban literalmente como strings en el JS.
