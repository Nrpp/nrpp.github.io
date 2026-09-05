# 🛠 Configuración de Pilla-pilla

Este juego reutiliza el mismo proyecto Firebase que `bestchat/` (ver su `SETUP.md`), pero
guarda todos sus datos en una rama distinta de la base de datos (`pilla_pilla/`), así que no
toca nada del chat.

## Único paso necesario: abrir esa rama en las Reglas

En la consola de Firebase → tu proyecto `chat-261ba` → **Realtime Database** → **Rules**,
añade este bloque `pilla_pilla` junto a las reglas que ya tengas (no borres las que ya
existen, solo añade esta clave nueva al mismo nivel que `"rooms"`):

```json
{
  "rules": {
    "rooms": {
      "...": "deja esto exactamente igual que ya lo tienes"
    },
    "pilla_pilla": {
      ".read": true,
      ".write": true
    }
  }
}
```

Esto deja `pilla_pilla` abierto (sin necesidad de que los jugadores inicien sesión), igual que
estaba el chat en su día. Es un juego sin datos sensibles (solo nombres y códigos de sala
temporales), así que no hace falta autenticación.

Guarda las reglas y listo: la web ya funciona en `https://nrpp.github.io/pilla-pilla/` para
cualquiera con el enlace, sin instalar nada ni tener un ordenador encendido.

## Limitaciones

- Las salas no se borran solas: se quedan en la base de datos aunque nadie las use. Para un
  uso normal (partidas puntuales con amigos) no da ningún problema; si algún día crece mucho,
  se puede añadir limpieza automática con una Cloud Function.
- Sin servidor de por medio, cualquiera con la URL podría en teoría leer/escribir en
  `pilla_pilla/` directamente (por ejemplo, con las herramientas de desarrollador del
  navegador). Para una partida entre amigos no es un problema real, pero no lo uses para nada
  que necesite seguridad de verdad.
