const mongoose = require('mongoose');
mongoose.set('debug', true);
const accountSchema = new mongoose.Schema({
  accountId: {type:String,unique:true},
  user: {
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  bankId: String,
  accountType: String,
  balanceAmount: Number,
  accountCurrency: String
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
