const mongoose = require('mongoose');
mongoose.set('debug', true);
const transactionSchema = new mongoose.Schema({
  fromAccount: String,
  toAccount:String,
  transactionAmount:Number,
  transactionCurrency: String,
  creditDebitType:String,
  transactionDate:Date
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
