const { Menu, shell, BrowserWindow}=require('electron')

const template = [
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/');
                }
            }
        ]
    },
    {
        label:"Format",
        submenu:[
            {
                label:"Toggle Bold",
                click(){
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event','toogle-bold')
                }
            }
        ]
    },
    {
        label: 'Debugging',
        submenu: [
            {
                role: 'toggleDevTools'
            },
            { type: 'separator' },
            { role: 'reload' }
        ]
    }
];

const menu = Menu.buildFromTemplate(template)

module.exports=menu