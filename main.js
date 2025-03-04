const { app, BrowserWindow, clipboard, ipcMain } = require('electron');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: __dirname + '/preload.js'
    }
  });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-clipboard-text', () => {
  return clipboard.readText();
});


let lastText = '';

setInterval(() => {
  const currentClipboardText = clipboard.readText();
  if (currentClipboardText && currentClipboardText !== lastText) {
    lastText = currentClipboardText;

    if (win) {
        win.webContents.send('update-clipboard-text', currentClipboardText);
        win.webContents.send('update-progress', true);
    }

    correctGrammar(currentClipboardText).then(correctedText => {
      if (win) {
        win.webContents.send('update-text', correctedText);
        win.webContents.send('update-progress', false);
      }
    }).catch(error => {
      console.error("Grammar correction failed:", error);
    });
  }
}, 1000);

async function correctGrammar(text) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2", // test mistral
        prompt: `Can you correct the grammatical errors in your text? Please do not add any other content
                and only respond with the original text if the corrections are correct. Please do not
                include double quotation marks at the beginning and end of the text. here is my text:\n"${text}"`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error("Error in correctGrammar:", error);
    return text;
  }
}