var express = require('express');
var app = express();
const uuid = require('uuid/v1');
const port = process.argv[2];

const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');
const bodyparser = require('body-parser');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/blockchain', function(req,res){
  res.send(bitcoin);
});

app.post('/transaction', function(req,res){
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender , req.body.recipient)
  res.json({ note : 'transaction will be added in block '+blockIndex})
});

app.get('/mine', function (req , res) {
  const lastBlock=bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions:bitcoin.pendingTransactions ,
    index : lastBlock['index']+1
  };

  const nonce= bitcoin.proofOfWork(previousBlockHash,currentBlockData);

  const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
  bitcoin.createNewTransaction("12.5" , "00" , nodeAddress );
  const newBlock = bitcoin.createNewBlock(nonce , previousBlockHash , blockHash);
  console.log(newBlock);
  res.json({
    note:"new block added successfully" ,
    block: newBlock
  })
});

app.listen(3000, function(){console.log("listening on port 3000")});
var express = require('express');
var app = express();
const uuid = require('uuid/v1');
const port = process.argv[2];

const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');
const bodyparser = require('body-parser');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/blockchain', function(req,res){
  res.send(bitcoin);
});

app.post('/transaction', function(req,res){
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender , req.body.recipient)
  res.json({ note : 'transaction will be added in block '+blockIndex})
});

app.get('/mine', function (req , res) {
  const lastBlock=bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions:bitcoin.pendingTransactions ,
    index : lastBlock['index']+1
  };

  const nonce= bitcoin.proofOfWork(previousBlockHash,currentBlockData);

  const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
  bitcoin.createNewTransaction("12.5" , "00" , nodeAddress );
  const newBlock = bitcoin.createNewBlock(nonce , previousBlockHash , blockHash);
  console.log(newBlock);
  res.json({
    note:"new block added successfully" ,
    block: newBlock
  })
});

app.listen(3000, function(){console.log("listening on port 3000")});
