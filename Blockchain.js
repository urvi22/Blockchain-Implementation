const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

Blockchain.prototype.allot_sectors = function(){
  function Create2DArray(r,c) {
    var i = 0;
    var j = 0;
    arr = new Array();
    for(i=0; i<r; i++)
    {
        arr[i] = new Array();
        for(j=0; j<c; j++)
        {
            arr[i][j];
        }
    }
      return arr;
  }

    var network_length = networkNodes.length;
    var sectorIndex=0;

    for (var a=[],i=0;i<50;++i) a[i]=i;
    function shuffle(array) {
        var tmp, current, top = array.length;
        if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
        return array;
      }
    a = shuffle(a);

      var nSectors= 6;
      var nNodes= Math.floor(a.length / nSectors);
      var arr = Create2DArray(nSectors, nNodes);
      console.log(arr);
      var ind=0;
      for(var b=0;b<nSectors;b++){
        for(var i=0; i<nNodes; i++){
          arr[b][i]=a[ind];
          ind=ind+1;
          network_length=network_length-1;
        }
      }
      while(network_length != 0){
        arr[sectorIndex][nNodes]= a[networkNodes.length-network_length];
        sectorIndex=sectorIndex+1;
        network_length=network_length-1;
       }
   return arr;
};

Blockchain.prototype.alocate_nsector= function(arr,nNode){
	var min=arr[0].length;
	var ind= 0;
	for(i=0;i<arr.length;i++)
	{
		if(arr[i].length<min){
			min=arr[i].length;
			ind=i;
		}
	}
	arr[ind][min]=nNode;
  return arr;
};


module.exports = Blockchain;
