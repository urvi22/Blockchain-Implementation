const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./Blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');
const nodeAddress = uuid().split('-').join('');
const path = require('path');
const request = require('request');

const bitcoin = new Blockchain();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// console.log("port is " + port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  verification_sector = new Array();

//details
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.get('*', function(req, res) {

    var name = 'hello';
    res.render('index2.html' , {name:name})
});

// app.post('/startnode',function (req , res) {
//   console.log(" starting nodes ");
//   nodestostart=req.body.nodes;
//
//   // console.log("node to start" + req.body.nodes);
//   // var command="concurrently";
//   // var add=" \"npm run node_";
//   // var endit="\" "
//   // console.log(bitcoin.networkNodes.length+1);
//   // for (var i = bitcoin.networkNodes.length+1; i < parseInt(bitcoin.networkNodes.length)+parseInt(nodestostart)+1; i++) {
//   //   command=command+add+JSON.stringify(i)+endit
//
//   // console.log(req.body.nodes);
//   var command="npm run start";
//   // var add=" \"npm run node_";
//   // var endit="\" "
//   // for (var i = 2; i <= nodestostart; i++) {
//   //   command=command+add+JSON.stringify(i)+endit
//
//     // console.log("concurrently \"npm run node_"+JSON.stringify(i)+"\""+ " "+ "\"npm run node_"+JSON.stringify(i+1)+"\"");
//     // shell.exec("concurrently \"npm run node_"+JSON.stringify(i)+"\""+ " "+ "\"npm run node_"+JSON.stringify(i+1)+"\"", {silent:true}).stdout;
//
//   command=command.toString()
//   console.log(command);
//   // command="npm run start"
//   // shell.exec(npm config set javaScript-blockchain:runall 9090)
//   shell.exec(command, {silent:true}).stdout;
//
//
// })

// create a new transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});


var c = bitcoin.Create2DArray(100, 3);


var verified_sectors_count=0;//verication count-------------------
// mine a block
app.get('/mine', function(req, res) {
//netwroknodes/2 ki ceil
//var len=Math.ceil(bitcoin.networkNodes.length/2);
id=1;
  bitcoin.pendingTransactions.transactionId.forEach(i => {
    console.log(i);
  })

  if(c[id][0]>=Math.ceil(ver1.length/2) && c[id][1]>=Math.ceil(ver2.length/2) && c[id][1]>=Math.ceil(ver3.length/2)) //changeeeeeeeee whennnchangee number of nodes..............
    {
      verified_sectors_count=1;
      console.log("verified_sectors_count=="+verified_sectors_count);

    }

	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];

	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);


  if(verified_sectors_count==1){
	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)

	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
}
else{
  res.json({ note: 'not enough verification' });
}
});

// receive new block
app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
    //bitcoin.update_money();
		bitcoin.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

nodes=[];
// register a node and broadcast it the network
var node_bro=2;
app.post('/register-and-broadcast-node', function(req, res) {
  // console.log(node_bro);
  // console.log(req.body.newNodeUrl);
  if(node_bro<=9)
  {
    //res.json({ note: 'aya' });
	    newNodeUrl = "http://localhost:300"+JSON.stringify(node_bro);
    //res.json({ note: `${newNodeUrl}` });

  }
  else if(node_bro>9){
	 newNodeUrl = "http://localhost:30"+JSON.stringify(node_bro);}

   node_bro=node_bro+1;

   console.log(newNodeUrl);
  // console.log("nodes are= " + networkNodes[4]);
   // console.log(newNodeUrl[17]+newNodeUrl[18]+newNodeUrl[19]+newNodeUrl[20]);
   // console.log(port);
    if (parseInt(newNodeUrl[17]+newNodeUrl[18]+newNodeUrl[19]+newNodeUrl[20])==port) {
      res.json({ note: 'CURRENT NODE == NEW NODE' });
    }
    else {
      if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    	const regNodesPromises = [];
    	bitcoin.networkNodes.forEach(networkNodeUrl => {
    		const requestOptions = {
    			uri: networkNodeUrl + '/register-node',
    			method: 'POST',
    			body: { newNodeUrl: newNodeUrl },
    			json: true
    		};

    		regNodesPromises.push(rp(requestOptions));
    	});

    	Promise.all(regNodesPromises)
    	.then(data => {
    		const bulkRegisterOptions = {
    			uri: newNodeUrl + '/register-nodes-bulk',
    			method: 'POST',
    			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
    			json: true
    		};

    		return rp(bulkRegisterOptions);
    	})
    	.then(data => {
    		res.json({ note: 'New node registered with network successfully.' });
    	});

    }

});



// register a node with the network
app.post('/register-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});


// consensus
app.get('/consensus', function(req, res) {
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			};
		});


		if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: bitcoin.chain
			});
		}
		else {
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			});
		}
	});
});


// get block by blockHash
app.get('/block/:blockHash', function(req, res) {
	const blockHash = req.params.blockHash;
	const correctBlock = bitcoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});


// get transaction by transactionId
app.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
	const trasactionData = bitcoin.getTransaction(transactionId);
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block
	});
});


// get address by address
app.get('/address/:address', function(req, res) {
	const address = req.params.address;
	const addressData = bitcoin.getAddressData(address);
	res.json({
		addressData: addressData
	});
});


// block explorer
app.get('/block-explorer', function(req, res) {
	res.sendFile('./block-explorer/index.html', { root: __dirname });
});


veri =""
mini=""
mine_urls=[]
// broadcast transaction.
verification_sector=[]
mining_sector=[]
transaction_count=0
transaction_limit=5
start=1;
sectors=[]
flag=0;
app.post('/transaction/broadcast', function(req, res) {
  veri =""
  mini=""
  transaction_count+=1
  if(transaction_count%(transaction_limit+1)==1)
  {
    ret=bitcoin.sector_allocation(port)
    sectors=ret[0];
    verification_sector=ret[1];
    mining_sector=ret[2];
    flag=1;
  }

	const newTransaction = bitcoin.createNewTransaction(req.body.transactionid,req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);///////hatana hai shayad

	const requestPromises = [];
  const urlss=[]

  for (i=0;i<verification_sector.length;++i)
  {
    for (j=0;j<sectors[verification_sector[i]].length;++j)
    {
      urlss.push(sectors[verification_sector[i]][j]);
      veri=veri+" "+(sectors[verification_sector[i]][j]+1);
    }
  }
  console.log("veri."+veri);

  for (i=0;i<sectors[mining_sector].length;++i)
  {urlss.push(sectors[mining_sector][i]);
  mini=mini+" "+(sectors[mining_sector][i]+1);}
  console.log("mini"+mini);

  //urls for verification and mining
  urlss.sort();
  for(var i =0;i<urlss.length;i++)
  {urlss[i]+=1;
  }

  console.log("urlss="+urlss);

  console.log("all urls="+bitcoin.networkNodes);

	bitcoin.networkNodes.forEach(networkNodeUrl => {
    var ad=networkNodeUrl[19]+networkNodeUrl[20]
    if (bitcoin.in_array(urlss,ad))
    {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	}

});

	Promise.all(requestPromises)
	.then(data => {
		//res.json({ note: 'Transaction created and broadcast successfully.' });
	});
  print_json="Transaction and sector created and broadcast successfully";
  if (flag==1)
  {str_address="http://localhost:"+port+"/sector/broadcast"
  request(str_address, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    // console.log(res);
  // send(res.body);
  //print_json=res.body;
  //

});
flag=0;
}
// res.json(print_json);
var name = "hello";
res.render('index2.html' , {name:name , sectors:sectors , mining_sector:mining_sector})

});

app.post('/sector', function(req, res) {
	const newsector = req.body;
	const blockIndex = bitcoin.addSectorsToSectors_list(newsector);
	res.json({ note: `Sector will be added ${blockIndex}.` });
});


app.get('/sector/broadcast', function(req, res) {

  indices=port+"="+start+"-"+(start+transaction_limit-1);
	const newsector = bitcoin.createNewSector(indices, veri, mini);
	bitcoin.addSectorsToSectors_list(newsector);

	const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/sector',
			method: 'POST',
			body: newsector,
			json: true
		};

		requestPromises.push(rp(requestOptions));


});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'sector created and broadcast successfully.' });
	});
});



app.post('/verification-broadcast', function(req, res) {
  var pi=port%100;
  var a=Math.floor((req.body.transactionid)/5);
  //console.log("a............."+a);
  const	p = {
  		port: pi,
      sector_id:a,
      transactionId:req.body.transactionid
  	};

  const requestPromises = [];
  var min=bitcoin.sector_list[a].minee;///////////
  var word="";
  min=min+" ";
  for(i=1;i<min.length;i++)
  { if (min[i]==' ')
    {
        mine_urls.push(word);
        word="";
    }
    else
    {
        word+=min[i];
    }
  }
  //console.log(mine_urls);
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    var ab=networkNodeUrl[19]+networkNodeUrl[20];
    if (bitcoin.in_array(mine_urls,ab))
    {
  		const requestOptions = {
  			uri: networkNodeUrl + '/verify',
        method: 'POST',
  			body: p,
  			json: true
  		  };
  		requestPromises.push(rp(requestOptions));
    }

});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'verification.' });
	});
});


app.post('/verify', function(req, res) {
  const p = req.body.port;
  const a = req.body.sector_id;
  const id=req.body.transactionId;
  //console.log("id---"+id)
  var min=bitcoin.sector_list[a].veri;
  ver_urls=[];
  ver1=[];
  ver2=[];
  ver3=[];
  var len=bitcoin.networkNodes.length;

  var word="";
  min=min+" "

  for(i=1;i<min.length;i++)
  {
      if (min[i]==' ')
      {
        ver_urls.push(word);
        word="";
      }
    else
    {
      word+=min[i];
    }
  }
  //console.log(ver_urls);
  for (var i=0;i<ver_urls.length;)
  {
      ver1.push(ver_urls[i++]);
      ver1.push(ver_urls[i++]);
      if(i==len)
      break;
      ver2.push(ver_urls[i++]);
      ver2.push(ver_urls[i++]);
      if(i==len)
      break;
      ver3.push(ver_urls[i++]);
      ver3.push(ver_urls[i++]);
      if(i==len)
      break;




    }

      console.log("p--"+p)
      console.log("ver1--"+ver1);
      console.log("ver2--"+ver2);
      console.log("ver3-"+ver3);
  if(bitcoin.in_array(ver1,p) )
  {
      c[id][0]+=1;
      console.log("number of nodes verified in 1st sector for id"+id+" are=="+c[id][0]);
  }
  else if(bitcoin.in_array(ver2,p) )
  {
    c[id][1]+=1;
    console.log("number of nodes verified in 2nd sector for id"+id+" are=="+c[id][1]);
  }
  else if(bitcoin.in_array(ver3,p) )
  {
    c[id][2]+=1;
    console.log("number of nodes verified in 3rd sector for id"+id+" are=="+c[id][2]);
  }

res.json({ note: 'verification notification received' });
});


const server = app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});
