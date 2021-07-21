const messageCodes = require('./messageCode.json')
const _ = require('lodash');
const getMessageDescription = (messageCode,placeHolders) => {
    let message = _.find(messageCodes,(message) => {
        return message.messageCode == messageCode
    })
    let description = message.messageDescription;
    let messagePlaceHolders = message.placeHolders;
    if(messagePlaceHolders){
        for(var i=0;i<messagePlaceHolders.length;i++){
            description = _.replace(description,messagePlaceHolders[i],placeHolders[i]);            
        }
    }
    return description;
}

class Response {
    constructor (messageCode,statusCode,payload,placeHolders) { 
        Object.setPrototypeOf(this, new.target.prototype)
        this.description = getMessageDescription(messageCode,placeHolders)
        this.payload = payload
        this.statusCode = statusCode
    }
}

module.exports = Response