const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let win;
let tray;
let isQuitting = false;

// 🔄 logs de updates
log.transports.file.level = "info";
autoUpdater.logger = log;

// ⚡ evitar error "Chrome 85"
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 🔥 User agent moderno
  win.webContents.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  win.loadURL("https://web.whatsapp.com");

  // 🚀 iniciar maximizado
  win.maximize();
  win.show();

  // ❌ cerrar = ocultar (no matar app)
  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      win.hide();
    }
  });

  // 🔔 permisos notificaciones
  win.webContents.session.setPermissionRequestHandler((wc, permission, callback) => {
    if (permission === "notifications") callback(true);
    else callback(false);
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, 'icons/icon.png')
  );

  tray = new Tray(icon);

  const menu = Menu.buildFromTemplate([
    {
      label: 'Abrir WhatsApp',
      click: () => win.show()
    },
    {
      label: 'Maximizar',
      click: () => {
        win.show();
        win.maximize();
      }
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('WhatsApp Web');
  tray.setContextMenu(menu);

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
}

// 🚀 auto-start sistema
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  // 🔄 auto updates
  autoUpdater.checkForUpdatesAndNotify();
});

// ❌ evitar cierre total accidental
app.on('window-all-closed', (e) => {
  e.preventDefault();
});