const { app, BrowserWindow,  clipboard, remote} = require('electron');
const path = require('path');
const { ipcMain } = require('electron')
const Store = require('electron-store')
const store = new Store()

console.log("Hello from index.js")


// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
// });


if (require('electron-squirrel-startup')) app.quit()

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		height:600,
		width:600,
		webPreferences:{
			nodeIntegration:true,
			nativeWindowOpen: true,
		},
		// frame:false,
	});
	// mainWindow.maximize();
	if(store.get('userKey') == null){
		mainWindow.loadFile(path.join(__dirname, 'login.html'));
	}
	else{
		console.log("UserKey Already Exists " + store.get("userKey"))
		mainWindow.loadFile(path.join(__dirname, 'index.html'))
	}
	// mainWindow.webContents.openDevTools();
};

app.whenReady().then(createWindow) 

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


ipcMain.on('setKey',(event,arg)=>{
	store.set('userKey',arg.userKey)
	store.set('docId',arg.docId)
	mainWindow.loadFile(path.join(__dirname, 'index.html'))
	event.returnValue = "success"
})
ipcMain.on('getKey',(event,arg)=>{
	event.returnValue = store.get('userKey')
})
ipcMain.on('getDocId',(event,arg)=>{
	event.returnValue = store.get('docId')
})
