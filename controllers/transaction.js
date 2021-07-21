const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const BusinessError = require('../middleware/error/businessError')
const Response = require('../middleware/response/response')
const _ = require('lodash');
const logger = require('./../logger/logger')
const validator = require('validator');
const moment = require('moment');

exports.postDoTransaction = async (req, res, next) => {
    try {
        if (!req.body.fromAccountId) {
            throw new BusinessError(6);
        }
        if (!req.body.toAccountId) {
            throw new BusinessError(7);
        }
        //if(!validator.isNumeric(req.body.transactionAmount)) throw new BusinessError(10)
        let fromAccount = await Account.findOne({ accountId: req.body.fromAccountId });
        if (!fromAccount) {
            throw new BusinessError(4, req.body.fromAccountId);
        }
        let toAccount = await Account.findOne({ accountId: req.body.toAccountId });
        if (!toAccount) {
            throw new BusinessError(4, req.body.toAccountId);
        }
        if (fromAccount.accountCurrency != req.body.transactionCurrency || toAccount.accountCurrency != req.body.transactionCurrency) {
            throw new BusinessError(9);
        }
        if (fromAccount.balanceAmount < req.body.transactionAmount) {
            throw new BusinessError(8);
        }
        if (req.body.transactionAmount < 0) {
            throw new BusinessError(18);
        }
        let fromAccountBalance = Number(fromAccount.balanceAmount) - Number(req.body.transactionAmount);
        let toAccountBalance = Number(toAccount.balanceAmount) + Number(req.body.transactionAmount);
        let transactionDate = new Date().toISOString()
        const creditTransaction = new Transaction({
            fromAccount: toAccount.accountId,
            toAccount: fromAccount.accountId,
            transactionAmount: req.body.transactionAmount,
            transactionCurrency: req.body.transactionCurrency,
            creditDebitType: 'C',
            transactionDate: transactionDate
        });
        const debitTransaction = new Transaction({
            fromAccount: fromAccount.accountId,
            toAccount: toAccount.accountId,
            transactionAmount: req.body.transactionAmount,
            transactionCurrency: req.body.transactionCurrency,
            creditDebitType: 'D',
            transactionDate: transactionDate
        })
        let creditTransactionId = await creditTransaction.save();
        let debitTransactionId = await debitTransaction.save();
        await Account.updateOne({ accountId: fromAccount.accountId }, { balanceAmount: fromAccountBalance })
        await Account.updateOne({ accountId: toAccount.accountId }, { balanceAmount: toAccountBalance });
        res.status(201).send(
            new Response(3,201, {
                balanceAmount: fromAccountBalance
            })
        )

    }
    catch (error) {
        next(error)
    }
}

exports.getfetchTransactionHistory = async (req, res, next) => {
    try {
        let accountId = req.query.accountId;
        if (!accountId) {
            throw new BusinessError(5);
        }
        let transactionDate = req.query.transactionDate;
        let filter = {
            fromAccount: accountId
        }
        if (transactionDate) {
            let splittedDate = transactionDate.split('-')
            let dateValidFlag = splittedDate.length == 3;
            dateValidFlag = dateValidFlag && splittedDate[0] && splittedDate[0].length == 4 && splittedDate[1] & splittedDate[1].length ==2 && splittedDate[2] && splittedDate[2].length==2;
            if (!dateValidFlag || !moment(transactionDate, 'YYYY-MM-DD').isValid()) {
                throw new BusinessError(11)
            }

            filter['transactionDate'] = {
                "$gte": new Date(transactionDate + 'T00:00:00.000Z'),
                "$lt": new Date(transactionDate + 'T23:59:59.000Z')
            };
        }
        let transactions = await Transaction.find(filter).sort({ transactionDate: 'desc' }).exec();
        if (transactions.length == 0) {
            throw new BusinessError(12);
        }
        res.status(200).send(new Response(4,200, transactions))
    }
    catch (error) {
        next(error)
    }
}