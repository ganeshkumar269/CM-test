const {ipcRenderer, remote} = require('electron')
let db;
let colRef;
document.addEventListener('DOMContentLoaded', event => {
    db = firebase.firestore()
    colRef = db.collection('clipboard-collection')
})

let inputKey = document.querySelector("input.form-control")
let keySubmit = document.querySelector("#keySubmit")



keySubmit.onclick = (event) => {
    console.log("KeySubmit button clicked " + inputKey.value)
    authenticate(inputKey.value)
}


let authenticate = (key) => {
    let unsub;
    console.log("Authenticating " + key)
    unsub = colRef.where('uid',"==", key)
                .onSnapshot(snapshot => {
                    console.log(snapshot)
                    console.log(snapshot.docs[0].data())
                    console.log(snapshot.docs[0].id)
                    if(snapshot.docs.length == 0){
                        console.log("User Doesnt Exist Retry")
                    }
                    else{
                        let result = ipcRenderer.sendSync('setKey',{userKey:key,docId:snapshot.docs[0].id})
                        // remote.getCurrentWindow().loadFile(path.join(__dirname, 'index.html'))
                        // if(result == "success")
                    }
              })
}