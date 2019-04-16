const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
var express = require('express');
var hbs = require('hbs');

var app = express();
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));



function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	this.consumers=[];
	this.sector_list=[];
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

var users=[];
var users_amount=[];
users.push("B")
users_amount.push(10)
users.push("A")
users_amount.push(10)


//
Blockchain.prototype.createNewTransaction = function(transactionid,amount, sender, recipient) {
var ver=0;
if (this.enough_amount(amount,sender,recipient))
	{
		console.log("verified");
	  ver =1;
	}
	else
	{
		console.log("not verified");
	}

const	newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: transactionid,
		verification_done:ver
	};
if(ver==1){
  return newTransaction;}
};


Blockchain.prototype.enough_amount = function(amount,sen,res){
	flag1=0;
	flag2=0;

	for (var i =0;i<users.length;i++)
	{	if (users[i]==res)
	 	{
		flag2=1;
			}

		if (users[i]==sen)
		{
			flag1=1;
			if(users_amount[i]>=amount)
			{return 1;}
			else {
				return 0;
			}
		}

	}

	if(flag1==0)
	{
		users.push(sen)
		users_amount.push(0)
	}

	if(flag2==0)
	{
		users.push(res)
		users_amount.push(0)
	}
	console.log("user=="+users);
};

Blockchain.prototype.update_money= function(){
			this.chain.forEach(block => {
		if (block.transactions.amount === blockHash)
		correctBlock = block;
	});

};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.addSectorsToSectors_list = function(sectorObj) {
	this.sector_list.push(sectorObj);
	return 1;
};

Blockchain.prototype.createNewSector = function(indices, veri, minee) {
const	newsector = {
		indices: indices,
		veri: veri,
		minee: minee,
	};

  return newsector;
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


Blockchain.prototype.Create2DArray = function(r,c){
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
Blockchain.prototype.shuffle= function(array){
		var tmp, current, top = array.length;
		if(top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}
		return array;
	}
Blockchain.prototype.in_array = function(arr,n){
for (var i =0;i<arr.length;i++)
	{if (	parseInt(arr[i])==parseInt(n))
			{	return 1;
				break;
			}
	}
}

Blockchain.prototype.in_array_string = function(arr,n){
for (var i =0;i<arr.length;i++)
	{if (	(arr[i])==(n))
			{	return 1;
				break;
			}
	}
}

Blockchain.prototype.allot_sectors = function(port,nodes){
	networkNodes=[];
		networkNodes.push(port%100);

		for(i=0;i<nodes.length;i++)
		{
			networkNodes.push(nodes[i]);
		}
		console.log("networkNodes"+networkNodes);

    var network_length = networkNodes.length;
    var sectorIndex=0;
		var currentNodeId=port;
    for (var a=[],i=0;i<network_length;++i)
		{
			a[i]=i;
		}
    a =this.shuffle(a);

    var nSectors= 6;
    var nNodes= Math.floor(a.length / nSectors);
    var arr = this.Create2DArray(nSectors, nNodes);
    //console.log(arr);
    var ind=0;
    for(var b=0;b<nSectors;b++){
      for(var i=0; i<nNodes; i++){
        arr[b][i]=a[ind];
        ind=ind+1;
        network_length=network_length-1;
      }
    }
    while(network_length != 0)
		{
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

var mining_sector[]=0; ////////////////////////////////////

Blockchain.prototype.sector_allocation= function(port)
{
	nodes=[]
  this.networkNodes.forEach(networkNodeUrl => {

    nodes.push(networkNodeUrl[19]+networkNodeUrl[20]);
  });

  sectors=this.allot_sectors(port,nodes);
  // res.json({ note: `Blocks are alloted` });
  console.log("sector are= " + sectors);
  console.log("no of sectors = " + sectors.length);
  var currentNodeId=port%100;
	console.log("port is "+ currentNodeId);                 // place Your current node id here
  var currentNodeSector=0;
  for (i=0;i<sectors.length;i++)
  {
      for (j=0;j<sectors[i].length;j++)
      {
        if(sectors[i][j]==currentNodeId)
        {
          currentNodeSector=i
          break;
        }
      }
  }
  console.log("current node sector==" + currentNodeSector);

  for (var a=[],i=0;i<sectors.length;++i)
  {
    a[i]=i;
  }
  a=this.shuffle(a)
  var count=0;
  var i=0;
  for (i=0;i<sectors.length;i++)
  {
      if(count==sectors.length/2)
      {
          break;
      }
      if(a[i]!=currentNodeSector)
      {
          verification_sector[count]=a[i];
          count++;
      }

  }

  for (j=i;j<sectors.length;j++)
  {
    if(a[j]!=currentNodeSector)
    {
        mining_sector=a[j];
    }
  }

  console.log("mining sector is = " + mining_sector);
  console.log("verification sectors are = " + verification_sector);
	return [sectors, verification_sector , mining_sector];
}

app.get('/print', (req,res) => {
	res.render('about.hbs', {
		mining: mining_sector;
	});
})

app.listen(8080, function() {
	console.log(`Listening on port 8080...`);
});

module.exports = Blockchain;
