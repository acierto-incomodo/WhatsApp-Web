// detectar cambios en WhatsApp Web
const observer = new MutationObserver(() => {
  const unread = document.querySelectorAll('[aria-label*="no leídos"]');

  if (unread.length > 0) {
    console.log("Tienes mensajes nuevos");
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
