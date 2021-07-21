const errorCodes = require('./errorCode.json')
const _ = require('lodash');
const getErrorDescription = (errorCode,placeHolders) => {
    let error = _.find(errorCodes,(error) => {
        return error.errorCode == errorCode
    })
    let description = error.errorDescription;
    let errorPlaceHolders = error.placeHolders;
    if(errorPlaceHolders){
        for(var i=0;i<errorPlaceHolders.length;i++){
            description = _.replace(description,errorPlaceHolders[i],placeHolders[i]);            
        }
    }
    return description;
}

class BusinessError extends Error {
    constructor (errorCode,placeHolders,statusCode) { 
        super()
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode?statusCode:400
        this.description = getErrorDescription(errorCode,placeHolders)
    }
}

module.exports = BusinessError