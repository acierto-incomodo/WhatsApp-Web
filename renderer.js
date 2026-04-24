// Detectar mensajes no leídos observando el título de la página
// Esto es más eficiente y funciona independientemente del idioma configurado.
const observer = new MutationObserver(() => {
  const title = document.title;
  const match = title.match(/\((\d+)\)/);

  if (match && match[1]) {
    console.log(`Tienes ${match[1]} mensajes nuevos`);
    // Aquí podrías enviar una notificación al proceso principal si fuera necesario
  }
});

const titleElement = document.querySelector('title');
if (titleElement) {
  observer.observe(titleElement, {
    childList: true,
  });
}
