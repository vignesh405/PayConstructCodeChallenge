const User = require('../models/User');
const Account = require('../models/Account');
const BusinessError = require('../middleware/error/businessError')
const Response = require('../middleware/response/response')
const _ = require('lodash');
const logger = require('./../logger/logger')
const validator = require('validator');


exports.getFetchBalances = async (req,res,next) => {
    try{
    logger.info(req.query)
    const id = req.query.accountId.toString();
    logger.info("id")
    logger.info(id)
    
        if(!id){
            throw new BusinessError(5)
        }
        let account = await Account.findOne({accountId:id});
        if(!account){
            throw new BusinessError(4,[id]);
        }
        res.status(200).send(new Response(2,200,{
            "balanceAmount":account.balanceAmount,
            "accountCurrency":account.accountCurrency
          }));
    }
    catch(error){
        next(error)
    }
}

