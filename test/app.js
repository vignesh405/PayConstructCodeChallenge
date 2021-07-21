const request = require('supertest');
const app = require('../app.js');

let userId = Math.floor(Math.random() * 1000);
let fromAccountId = Math.floor(Math.random() * 10000000000).toString();
let toAccountId = Math.floor(Math.random() * 10000000000).toString();
console.log(Math.floor(Math.random() * 10000000000).toString())

describe('POST /v1/users', () => {
  it('should return 201', (done) => {
    request(app)
      .post('/v1/users')
      .send({ id: userId,name:'testuser'  })
      .expect(201, done);
  });
});

describe('POST /v1/users', () => {
  it('should return 400, duplicate user id case', (done) => {
    request(app)
      .post('/v1/users')
      .send({ id: userId,name:'testuser'  })
      .expect(400, done);
  });
});

describe('POST /v1/users', () => {
  it('should return 400, id not passed case', (done) => {
    request(app)
      .post('/v1/users')
      .send({ name:'testuser'  })
      .expect(400, done);
  });
});

describe('POST /v1/users', () => {
  it('should return 400, name not passed case', (done) => {
    request(app)
      .post('/v1/users')
      .send({ id: Math.floor(Math.random() * 1000)})
      .expect(400, done);
  });
});


describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 201', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ balanceAmount: 400, accountCurrency: "USD",accountId:fromAccountId})
      .expect(201, done);
  });
});

describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 201', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ balanceAmount: 400, accountCurrency: "USD",accountId:toAccountId})
      .expect(201, done);
  });
});

describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400, duplicate accountId case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ balanceAmount: 400, accountCurrency: "USD",accountId:fromAccountId })
      .expect(400, done);
  });
});

describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400, account number length invalid case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ balanceAmount: 400, accountCurrency: "USD",accountId:'12345678' })
      .expect(400, done);
  });
});

describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400,balance amount not passed case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ accountCurrency: "USD",accountId:Math.floor(Math.random() * 10000000000).toString() })
      .expect(400, done);
  });
});

describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400, balance amount and account currency not passed case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ accountId:Math.floor(Math.random() * 10000000000).toString()  })
      .expect(400, done);
  });
});


describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400, empty request body case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({  })
      .expect(400, done);
  });
});


describe('POST /v1/users/'+userId+'/account', () => {
  it('should return 400, negative amount case', (done) => {
    request(app)
      .post('/v1/users/'+userId+'/account')
      .send({ balanceAmount: -1, accountCurrency: 'USD',accountId:Math.floor(Math.random() * 10000000000).toString()  })
      .expect(400, done);
  });
});


describe('GET /v1/account/balance/fetch', () => {
  it('should return 200', (done) => {
    request(app)
      .get('/v1/account/balance/fetch?accountId='+fromAccountId)
      .expect(200, done);
  });
});

describe('GET /v1/account/balance/fetch', () => {
  it('should return 400, account id not passed case', (done) => {
    request(app)
      .get('/v1/account/balance/fetch?accountId=')
      .expect(400, done);
  });
});

describe('POST /v1/transaction', () => {
  it('should return 201', (done) => {
    request(app)
      .post('/v1/transaction')
      .send({fromAccountId:fromAccountId,toAccountId:toAccountId,transactionAmount:1,transactionCurrency:'USD'})
      .expect(201, done);
  });
});

describe('POST /v1/transaction', () => {
  it('should return 400, invalid from account case', (done) => {
    request(app)
      .post('/v1/transaction')
      .send({fromAccountId:'123',toAccountId:toAccountId,transactionAmount:1,transactionCurrency:'USD'})
      .expect(400, done);
  });
});


describe('POST /v1/transaction', () => {
  it('should return 400, invalid to account case', (done) => {
    request(app)
      .post('/v1/transaction')
      .send({fromAccountId:fromAccountId,toAccountId:'12',transactionAmount:1,transactionCurrency:'USD'})
      .expect(400, done);
  });
});

describe('POST /v1/transaction', () => {
  it('should return 400, invalid transfer amount case', (done) => {
    request(app)
      .post('/v1/transaction')
      .send({fromAccountId:fromAccountId,toAccountId:toAccountId,transactionAmount:-1,transactionCurrency:'USD'})
      .expect(400, done);
  });
});

describe('POST /v1/transaction', () => {
  it('should return 400, invalid transfer currency case', (done) => {
    request(app)
      .post('/v1/transaction')
      .send({fromAccountId:fromAccountId,toAccountId:toAccountId,transactionAmount:1,transactionCurrency:'UD'})
      .expect(400, done);
  });
});

describe('GET /v1/transaction/history', () => {
  it('should return 200 with account alone', (done) => {
    request(app)
      .get('/v1/transaction/history?accountId='+fromAccountId)
      .expect(200, done);
  });
});

describe('GET /v1/transaction/history', () => {
  it('should return 200 with both account and transactionDate', (done) => {
    let date = new Date()
    let month = date.getMonth()+1;
    month = month<10?'0'+month:month
    let day = date.getDate()<10?'0'+date.getDate():date.getDate()
    request(app)
      .get('/v1/transaction/history?accountId='+fromAccountId+'&transactionDate='+date.getFullYear()+'-'+month+'-'+day)
      .expect(200, done);
  });
});

describe('GET /v1/transaction/history', () => {
  it('should return 400, invalid date case', (done) => {
    let date = new Date()
    request(app)
      .get('/v1/transaction/history?accountId='+fromAccountId+'&transactionDate=12/21/2101')
      .expect(400, done);
  });
});

describe('GET /v1/transaction/history', () => {
  it('should return 400, invalid account id case', (done) => {
    let date = new Date()
    request(app)
      .get('/v1/transaction/history?accountId=&transactionDate=12/21/2101')
      .expect(400, done);
  });
});