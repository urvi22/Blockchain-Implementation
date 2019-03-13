const sha256=require('sha256');
const currentNodeUrl = process.argv[3];

 function eval(){
  this.chain = [];
   this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
 this.networkNode = [];
   this.createNewBlock(100,'0','0');
}

eval.prototype.createNewBlock= function(nonce, previousBlockHash,Hash){

const newBlock = {
index:this.chain.length+1,
 timestamp:Date.now(),
 transactions:this.pendingTransactions,
 nonce : nonce,
 hash: Hash,
 previousBlockHash: previousBlockHash   };

 this.pendingTransactions = [];
 this.chain.push(newBlock);
 return newBlock
}

eval.prototype.createNewT= function(name,enroll,gender) {
 const newT = {
 name: name,
 enroll: enroll,
 gender: gender
};
   this.pendingTransactions.push(newT);
 }

 eval.prototype.hashb=function(prev, curr, nonce){
   const dataAsString = prev+nonce.toString() +JSON.stringify(curr);
   const hash=sha256(dataAsString);
   return hash;
 }

module.exports = eval;
