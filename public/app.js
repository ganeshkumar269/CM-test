document.addEventListener('DOMContentLoaded', event => {
    const app = firebase.app()
    const auth = firebase.auth()
    console.log({app,auth})
    console.log(firebase.firestore())
    const whenSignedIn = document.querySelector("#whenSignedIn")
    const whenSignedOut = document.querySelector("#whenSignedOut")

    const signInBtn = document.querySelector("#signInBtn")
    const signOutBtn = document.querySelector("#signOutBtn")

    const userDetails = document.querySelector("#userDetails")
    const provider = new firebase.auth.GoogleAuthProvider()
    const dbValue = document.querySelector("#dbValue")

    signInBtn.onclick = () => auth.signInWithPopup(provider)
    signOutBtn.onclick = () => auth.signOut()

    const db = firebase.firestore()
    let dbRef
    let unsub

    dbRef = db.collection('clipboard-collection')
    unsub = dbRef.where('uid',"==","0E030feJEnXXFqWL5Tyy0t432yO2")
                    .onSnapshot(snapshot => {
                        console.log(snapshot)
                        snapshot.forEach(doc => console.log(doc.data()))
                    })

    // auth.onAuthStateChanged(user => {
    //     if(user){
    //         whenSignedIn.hidden = false;
    //         whenSignedOut.hidden = true;
    //         userDetails.innerHTML = `<h1>What Up ${user.displayName} with user id ${user.uid}<h1>`
    //         dbRef = db.collection('clipboard-collection')
    //         unsub = dbRef.where("uid","==",user.uid)
    //                 .onSnapshot(snapshot => {
    //                     console.log(snapshot)
    //                     console.log(snapshot.docs)
    //                     if(snapshot.docs.length == 0){
    //                         console.log("User doesnt exist")
    //                         dbRef.add({
    //                             uid:user.uid,
    //                             value:"RandomText",
    //                             timestamp: firebase.firestore.Timestamp.now()
    //                         })
    //                         dbValue.innerHTML = "RandomText"
    //                     }
    //                     else {
    //                         console.log("User already exists")
    //                         snapshot.forEach(doc =>dbValue.innerHTML = "from the docs " + doc.data().value)   
    //                     }
    //                 })
    //     }
    //     else{
    //         whenSignedIn.hidden = true;
    //         whenSignedOut.hidden = false;
    //         userDetails.innerHTML = "";
    //         dbValue.innerHTML = ""
    //     }
    // })

})