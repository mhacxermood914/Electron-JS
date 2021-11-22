const {app,BrowserWindow,Menu,shell}=require('electron');
const menu = require('./utils/menu.js')
const path = require('path')
let mainWindow;
const createWindow=()=>{
    mainWindow=new BrowserWindow({
        title:"MarkDown Editor",
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            //nodeIntegration: true
        }
    })

    mainWindow.loadURL("file://"+__dirname+"/app/index.html")

    mainWindow.on('closed',()=>{
        mainWindow=null
    })
}


app.on('ready',createWindow)

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

Menu.setApplicationMenu(menu)