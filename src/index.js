const { app, BrowserWindow,  clipboard, remote} = require('electron');
const path = require('path');
const { ipcMain } = require('electron')
const Store = require('electron-store')
const store = new Store()



// const firebaseApp = require('firebase/app')
const express = require('express');
const { env } = require('process');
const eapp = express()
eapp.use(express.static('public'));
eapp.set('view engine','ejs');
eapp.get('/',(req,res) => res.render('index.html'))
eapp.listen(process.env.PORT || 9999, (err) => {
  if(err) console.log(err)
  else console.log("Server Listens at 9999")
})

console.log("Hello from index.js")

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		height:600,
		width:600,
		webPreferences:{
		nodeIntegration:true,
		nativeWindowOpen: true,
		},
	});
	mainWindow.maximize();
	// and load the index.html of the app.
	// mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
	if(store.get('userKey') == null){
		mainWindow.loadFile(path.join(__dirname, 'login.html'));
	}
	else{
		console.log("UserKey Already Exists " + store.get("userKey"))
		mainWindow.loadFile(path.join(__dirname, 'index.html'))
	}
		// mainWindow.loadURL('http://localhost:9999')
	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// app.on('ready', createWindow);
app.whenReady().then(createWindow) 

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


// ipcMain.on('r2m', (event, arg) => {
// 	text = clipboard.readText()
// 	event.reply('m2r', text)
// })
// ipcMain.on('fromLogin',(event,args)=>{
//   console.log("from Login: " + args)
//   if(store.get('userkey') == args){
//     console.log("Key Match")
//     mainWindow.loadFile(path.join(__dirname, 'index.html'))
//     // event.reply('fromMain',"success") 
//   }
//   // else event.reply('fromMain',"failure") 
// })

// ipcMain.on("example",(event,arg)=>console.log("index.js example " + arg))
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