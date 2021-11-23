const ipcRenderer = require('electron').ipcRenderer;

window.onload = function () {
    console.log('ok')
    ipcRenderer.on("uuid", (event, data) => {
        document.getElementById("code").innerHTML = data;
    })

    document.getElementById("start").addEventListener('click',()=>{
        ipcRenderer.send("start-share", {});
        document.getElementById("start").style.display = "none";
        document.getElementById("stop").style.display = "block";
    })

    document.getElementById("stop").addEventListener('click', () => {
        ipcRenderer.send("stop-share", {});
        document.getElementById("start").style.display = "block";
        document.getElementById("stop").style.display = "none";
    })
}
