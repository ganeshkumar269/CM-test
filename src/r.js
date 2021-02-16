document.addEventListener('DOMContentLoaded', event => {
	const { ipcRenderer, clipboard, Tray } = require('electron')
	
	let db = firebase.firestore();
	let colRef = db.collection('clipboard-collection')
	let userKey = ipcRenderer.sendSync("getKey","gibmekey")
	let docId = ipcRenderer.sendSync("getDocId","gibmekey")
	var mainlist = document.querySelector("#mainlist")
	var image = document.querySelector("img")
	console.log("From r.js")

	let cbTop = "" 
	let dbTop = ""
	let addItem = (text) =>{
		let item = document.createElement("li")
		item.appendChild(document.createTextNode(text))
		item.className = "list-group-item"
		mainlist.prepend(item)
	}

	let updateDB = () => {
		let unsub = colRef.doc(docId).update({
			value: cbTop,
			timestamp: firebase.firestore.Timestamp.now()
		})
	}

	let updateCB = (text) => {
		clipboard.writeText(text);
		// addItem(text);
	}
	//listen for changes in DB
	let unsub = colRef.where("uid","==",userKey)
						.onSnapshot(snapshot => {
							let text = snapshot.docs[0].data().value;
							if(text != dbTop){
								updateCB(text)
								addItem(text)
								cbTop = text
								dbTop = text
							}
						})


	setInterval(() => {
		let text = clipboard.readText()
		if(text != cbTop){
			cbTop = text
			dbTop = text
			addItem(text)
			updateDB()		
		}
	},1000)

	//for testing purpose
	addItem("Random Text")
})
