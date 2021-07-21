const validator = require('validator');
const User = require('../models/User');
const Account = require('../models/Account');
const BusinessError = require('../middleware/error/businessError')
const Response = require('../middleware/response/response')
const _ = require('lodash');
const logger = require('./../logger/logger')


exports.postCreateAccount = async (req, res, next) => {
  const { id } = req.params;
  const accountId = req.body.accountId;
  const accountCurrency = req.body.accountCurrency;
  const balanceAmount = req.body.balanceAmount;
  try {
    logger.info("request body")
    logger.info(req.body);
    logger.info("request params")
    logger.info(req.params)
    if(!accountId){
      throw new BusinessError(5)
    }
    if(!accountCurrency){
      throw new BusinessError(17)
    }
    if(!balanceAmount){
      throw new BusinessError(16)
    }
    if(accountCurrency.length!=3){
      throw new BusinessError(1);
    }
    if(_.isNaN(balanceAmount)){
      throw new BusinessError(10)
    }
    if(accountId.length!=10){
      throw new BusinessError(2); 
    }
    if(balanceAmount<0){
      throw new BusinessError(16)
    }
    let user;
    let existingUser = await User.findOne({ id: id });
    user = existingUser;
    let existingAccount = await Account.findOne({ accountId: accountId });
    if (!existingAccount) {
      const account = new Account({
        accountId: accountId,
        user: user,
        bankId: 'FAKE',
        accountType: req.body.accountType ? req.body.accountType : 'SAV',
        balanceAmount: balanceAmount,
        accountCurrency: accountCurrency
      })
      await account.save();
      let accounts = user.Account ? user.Account : [];
      accounts.push(account);
      let updatedAccounts = await Account.find().where('_id').in(accounts).select('accountId').exec();
      let selectedAccounts = []
      updatedAccounts.forEach((updatedAccount) => {
        selectedAccounts.push(updatedAccount.accountId)
      })
      let docs = await User.updateOne({ id: id }, { Account: accounts });
      res.status(201).send(new Response(1, 201, {
        "accountIds": selectedAccounts,
        "userId": id
      }))
    }
    else {
      throw new BusinessError(3, [accountId]);
    }
  }
  catch (error) {
    next(error)
  }
}

exports.postCreateUser = async (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  try {
    if (!id) {
      throw new BusinessError(13)
    }
    if (!name) {
      throw new BusinessError(14)
    }

    let existingUser = await User.findOne({ id: id });
    if (existingUser) {
      throw new BusinessError(15)
    }

    const user = new User({
      id: id,
      name: name
    });

    await user.save()

    res.status(201).send(new Response(5,201, {
      id: id,
      name: name
    }));
  }
  catch (error) {
    next(error)
  }

}