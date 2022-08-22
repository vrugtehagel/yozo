export default class Reader {

    constructor(reference){
        this.reference = reference
    }

    [Symbol.toPrimitive](){
        if(this.reference.isObject) return
        return () => this.reference.value
    }

    valueOf(){
        return () => this.reference.value
    }

    toJSON(){
        return () => this.reference.value
    }

    toString(){
        return () => this.reference.value.toString()
    }

}
