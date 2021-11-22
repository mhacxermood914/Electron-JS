const ipc = require('electron').ipcRenderer
window.addEventListener('load',()=>{
    
    ipc.on('editor-event',(event,args)=>{
        if(args=="toogle-bold"){
           console.log(window)
        }else{
            console.log('ok cool')
        }
    })
})