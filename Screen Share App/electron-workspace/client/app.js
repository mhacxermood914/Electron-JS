const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
const path = require('path')
var socket = require('socket.io-client')('http://192.168.0.135:5000');
var interval;
let win,splash;


// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function createWindow() {
    win = new BrowserWindow({
        width: 500,
        height:200,
        show:false,
        icon:path.join(__dirname,'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            preload:path.join(__dirname,'preload.js')
        }
    })

    splash = new BrowserWindow({
        width: 400,
        height: 400,
        transparent: false,
        frame: false,
        icon: path.join(__dirname, 'icon.png'),
        alwaysOnTop: true
    });
    win.removeMenu();
    splash.loadFile('splash.html');
    splash.center();
    win.loadFile('index.html')


    win.once('ready-to-show', () => {
        setTimeout(()=>{
            splash.close()
            win.show()
        },5000)
    })
}

app.on('ready',createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("start-share", function (event, arg) {

    var uuid = uuidv4();
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function () {
        screenshot().then((img) => {
            var imgStr = new Buffer(img).toString('base64');

            var obj = {};
            obj.room = uuid;
            obj.image = imgStr;

            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 100)
})

ipcMain.on("stop-share", function (event, arg) {

    clearInterval(interval);
})

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};