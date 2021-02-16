class VCB{
    constructor(id){
        this._VCBId = id
        this._top = "Initialise Check"
        this._history=["Initialise Check"]
    }
    get VCBId(){return this._VCBId}
    get top(){return this._top}
    get history(){return this._history}
    
    set VCBId(x){this._VCBId = x} 
    set top(x){this._top= x} 
    set history(x){this._history= x} 

    addItem(item){
        this._history.splice(0,0,item)
        this._top = item;
    }

    getTop(){return this._top}

}

module.exports = VCB