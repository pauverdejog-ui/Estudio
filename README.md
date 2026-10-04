# Temario

App web (PWA) para marcar el temario estudiado de cada asignatura, ver el progreso y las fechas de examen y PEC. Funciona sin conexión y guarda los datos solo en el móvil.

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `temario`).
2. Sube **todos** los archivos de esta carpeta a la raíz del repositorio (incluida la carpeta `icons`). Desde la web: *Add file → Upload files*.
3. En el repositorio: *Settings → Pages → Build and deployment*, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)` y guarda.
4. En un par de minutos estará en `https://TU-USUARIO.github.io/temario/`.

## Instalarla en el móvil

- **iPhone:** abre la dirección en Safari → botón Compartir → *Añadir a pantalla de inicio*.
- **Android:** abre la dirección en Chrome → menú ⋮ → *Instalar aplicación*.

## Copias de seguridad

Ajustes → *Exportar copia (.json)*. Para recuperarla: Ajustes → *Restaurar una copia*. La app te avisa si pasan más días de los elegidos sin exportar.

Ojo: en iPhone, la app instalada y Safari tienen almacenamientos separados. Usa siempre la app instalada.

## Cómo se usa

- Toca el círculo de un punto para pasar de pendiente → estudiado → repasado.
- El botón ⋯ de cada punto abre su nota y su fecha.
- *Editar* (dentro de una asignatura) permite renombrar, añadir, ordenar y borrar temas y puntos.
- Calendario → ⋯ para importar un `.ics` o exportar todas las fechas.

## Actualizar la app

Si cambias algún archivo, sube también `sw.js` cambiando `temario-v1` por `temario-v2` (y así sucesivamente). La app mostrará "Hay una versión nueva" y se actualizará sin perder tus datos.

## Archivos

- `index.html`, `styles.css`, `app.js`: la app.
- `data.js`: temario y fechas iniciales. Se copian al móvil la primera vez; después se editan desde la app.
- `manifest.webmanifest`, `sw.js`, `icons/`: instalación y modo sin conexión.
