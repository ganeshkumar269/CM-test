
document.addEventListener('DOMContentLoaded', event => {
	const { ipcRenderer, clipboard} = require('electron')
	var Mousetrap = require('mousetrap');
    let VCB = require('./VCB.js')
	let db = firebase.firestore();
	let colRef = db.collection('clipboard-collection')
	let userKey = ipcRenderer.sendSync("getKey","gibmekey")
	let docId = ipcRenderer.sendSync("getDocId","gibmekey")
	var mainlist = document.querySelector("#mainlist")
	console.log("From r2.js")

    let vcb0 = new VCB("0")
    let vcb1 = new VCB("1")
    let activeIndex = 0;
    let VCBList = [vcb0,vcb1]

	let addItemToMainList = (text) =>{
		let item = document.createElement("li")
		item.appendChild(document.createTextNode(text))
		item.className = "list-group-item"
		mainlist.prepend(item)
	}

	let updateVCB = (text,VCBId) => {
		VCBList[VCBId].addItem(text)
	}
	let updatePCB = (text) => {
		clipboard.writeText(text);
	}
	let updateDB = (text,VCBId) => {
		let unsub = colRef.doc(docId).update({
			value: {text:text,VCBId:VCBId},
			timestamp: firebase.firestore.Timestamp.now()
		})
	}
	
	let getVCBTop = (ind) => VCBList[ind].getTop()
	let getActiveVCBTop = () => getVCBTop(getActiveIndex())
	let getActiveIndex = () => activeIndex
	let setActiveIndex = (ind) => activeIndex = ind
	
	
	//listen for changes in DB
	let unsub = colRef.where("uid","==",userKey)
						.onSnapshot(snapshot => {
							let retVal = snapshot.docs[0].data().value
							let text = retVal.text
							let VCBId = retVal.VCBId
							if(text != getVCBTop(VCBId)){
								updateVCB(text,VCBId)
								updatePCB(text)
							}
						})


    //Checking for changes in CB (Physical CB)
	// let prevPCBTop = ""
	setInterval(() => {
		let text = clipboard.readText()
		if(text != getActiveVCBTop()){
			updateVCB(text,getActiveIndex())
			updateDB(text,getActiveIndex())
			addItemToMainList(text)
			// prevPCBTop = text
		}
	},1000)

	let refreshDisplayList = () => {
		mainlist.innerHTML = "";
		let currInd = getActiveIndex()
		let history = VCBList[currInd].history
		for(let i = history.length - 1; i >= 0 ; i--)
			addItemToMainList(history[i])		
	}

	//change active Index
	let toggleActiveIndex = () => {
		activeIndex = activeIndex == 0 ? 1 : 0
		console.log("Active Index: ",activeIndex)
		updatePCB(getActiveVCBTop())
		refreshDisplayList()
	}
	document.querySelector("#VCBToggler").onclick = toggleActiveIndex
	refreshDisplayList()
	
	Mousetrap.bind("ctrl+alt+t",toggleActiveIndex)

})