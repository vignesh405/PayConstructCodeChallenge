const logger = require('../logger/logger')

function logError (err,req, res, next) {
    if(err)
        logger.error(err)
        next(err,req, res)
   }
   
   function returnError (err, req, res, next) {
       if(err){
        let errorBody = {
            statusCode:err.statusCode || 500,
            message:err.description || 'Something went wrong, please contact the helpdesk'
        }
        logger.info(err)
        res.status(err.statusCode || 500).send(errorBody)
       }
       else{
        next(err,req,res)
       }
   }
  
   
   module.exports = {
    logError,
    returnError
   }