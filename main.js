const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  // Crear/usar una sesión persistente para WhatsApp
  // "persist:whatsapp" -> los datos quedan en disco
  const ses = session.fromPartition('persist:whatsapp');

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // seguridad: no dar acceso Node al contenido web
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // opcional
      partition: 'persist:whatsapp' // normalmente no es necesario si usas ses en loadURL, pero es explícito
    }
  });

  // Opcional: algunas webs (WhatsApp) detectan userAgent; usar uno moderno ayuda
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

  win.loadURL('https://web.whatsapp.com', { userAgent: ua });
}

app.whenReady().then(() => {
  // Opcional: colocar la carpeta de datos en un lugar controlado
  // Uncomment si quieres forzar ruta:
  // app.setPath('userData', path.join(app.getPath('appData'), 'MiAppWhatsApp'));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
