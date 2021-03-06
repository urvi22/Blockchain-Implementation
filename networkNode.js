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

app.get('/information', function(req, res) {

    res.render('information.html' , {

      sectors:sectors,
      mining_sector:mining_sector,
      verification_sector:verification_sector,
      users: users,
      users_amount: users_amount,
      veri: veri,
      mini: mini})
});

app.get('/home', function(req, res) {

    res.render('home.html' );
    });

app.get('/initialization', function(req, res) {

        res.render('initialization.html' );
        });

app.get('/nodes', function(req, res) {

            res.render('nodes.html' ,  {

              sector1:sectors[0],
              sector2:sectors[1],
              sector3:sectors[2],
              sector4:sectors[3],
              sector5:sectors[4],
              sector6:sectors[5],
              sectorok:sectors
              })
            });

app.get('/transaction', function(req, res) {

                res.render('transaction.html' );
                });

app.get('/mining', function(req, res) {

                        res.render('mining.html' );
                        });


// create a new transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// mine initiation
var x=0;
var y=4000;
app.get('/mining-initiation-bulk', function(req, res) {

console.log("on mining-initiation-bulk");
res.json({ note: 'sent notification to mine.' });

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
    var ab=networkNodeUrl[19]+networkNodeUrl[20];

    if (bitcoin.in_array(mine_urls,ab))
    {//console.log("mine_urls -" +mine_urls);
      const	p = {
          start:x,
          end:(x+y),
          port:port
        };
        x=x+y;
  		const requestOptions = {
  			uri: networkNodeUrl + '/mine',
        method: 'POST',
  			body: p,
  			json: true
  		  };
  		requestPromises.push(rp(requestOptions));
    }

});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'sent notification to mine.' });
	});
  //res.end();
});

var ok=1;
app.post('/mining-initiation', function(req, res) {
console.log("mining_initialization");
// console.log(req.body);
if (ok!=-1)
{ ok=req.body.port;}

  if(ok!=-1)
  {
    const requestPromises = [];
      const	p = {
          start:x,
          end:(x+y),
          port:port
        };
        x=x+y;
      const requestOptions = {
        uri: "http://localhost:"+req.body.port+"/mine",
        method: 'POST',
        body: p,
        json: true
        };
      requestPromises.push(rp(requestOptions));

      Promise.all(requestPromises)
      .then(data => {
        res.json({ note: 'sent notification to mine.' });
      });
    //  res.end();
  }
  else {

    res.json({ note: 'stop mining' });
    //res.end();
  }

});


var c = bitcoin.Create2DArray(100, 4);


var verified_sectors_count=0;//verication count-------------------
// mine a block
app.post('/mine', function(req, res) {

  console.log("on mine");
  const start= req.body.start;
  const end= req.body.end;

  var start_mine=1;
  var nonce=0;
  var lastBlock = bitcoin.getLastBlock();
  var previousBlockHash = lastBlock['hash'];
  var currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };
  var blockHash=0;

  if(start_mine==1 )
  {
        nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData,start,end);
        if(nonce==-1)
        {
              console.log("nonce -1");
              var headers = {
              'User-Agent':       'Super Agent/0.0.1',
              'Content-Type':     'application/x-www-form-urlencoded'
        }

        str_address="http://localhost:"+req.body.port+"/mining-initiation";

        var options = {
            url: str_address,
            method: 'POST',
            headers: headers,
            form: {port: port}
        }

  // Start the request
      request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                      if (error)
                        { return console.log("err");

                        }
                       else {
                         console.log("checked nonce from-"+start+" - "+end);
                        }
              }
        });

//res.end();
      }/////////////////////end of if nonce not found
      else {
        //send notofication to stop;
        blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
        var id=0;
          bitcoin.pendingTransactions.forEach(p => {
            id=p.transactionId;
            if (c[id][3]==1)
            verified_sectors_count=1;
            else {
              verified_sectors_count=0;
              if (verified_sectors_count==0) return false
              else return true
              }
          })


          if(verified_sectors_count==1)
          {          	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

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
                      //  res.end();
                    	});
          }
              else{
                res.json({ note: 'not enough verification' });
              }
              //res.end();




        //send notification to stop
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
            }
            str_address="http://localhost:"+req.body.port+"/mining-initiation";
        var options = {
                url: str_address,
                method: 'POST',
                headers: headers,
                form: {port: -1}
            }

        // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body

                    if (error)
                      { return console.log("err");

                      }
                     else {
                       console.log("checked nonce from-"+start+" - "+end);
                       //console.log(" nonce calculated ");
                      }
                    //console.log(body)
                }
            });
            //res.end();
      }////end of else
}
//console.log("nonce finally calculated");

});

// receive new block
app.post('/receive-new-block', function(req, res) {

	const newBlock = req.body.newBlock;
  //console.log(newBlock);
	const lastBlock = bitcoin.getLastBlock();

	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
    //console.log(newBlock.transactions);
    bitcoin.update_money(newBlock.transactions);
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




veri =""
mini=""
minee=""
mine_urls=[]
// broadcast transaction.
verification_sector=[]
mining_sector=[]
users=[]
users_amount=[]
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
    //console.log(bitcoin.port+"dddd");


    ret=bitcoin.sector_allocation(port)
    sectors=ret[0];
    verification_sector=ret[1];
    mining_sector=ret[2];
    flag=1;
    ret2=bitcoin.info(req.body.amount,req.body.sender,req.body.recipient);
    users=ret2[0];
    console.log(users);
    users_amount=ret2[1];
  }

	const newTransaction = bitcoin.createNewTransaction(req.body.transactionid,req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);///////hatana hai shayad

	const requestPromises = [];
  const urlss=[]
console.log("veri.");
  for (i=0;i<verification_sector.length;++i)
  {
    for (j=0;j<sectors[verification_sector[i]].length;++j)
    {
      urlss.push(sectors[verification_sector[i]][j]);
      veri=veri+" "+(sectors[verification_sector[i]][j]+1);
      process.stdout.write(sectors[verification_sector[i]][j]+1+".");
    }
    process.stdout.write("|");

  }
  //console.log("veri."+veri);

  for (i=0;i<sectors[mining_sector].length;++i)
  {
    urlss.push(sectors[mining_sector][i]);
    mini=mini+" "+(sectors[mining_sector][i]+1);
  }
  console.log();
  console.log("mini"+mini);

  //urls for verification and mining
  urlss.sort();
  for(var i =0;i<urlss.length;i++)
  {
    urlss[i]+=1;
  }

  //console.log("urlss="+urlss);
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
  //console.log(port+"---------port");
  if (flag==1)
  {
    str_address="http://localhost:"+port+"/sector/broadcast";
    request(str_address, { json: false }, (err, res, req) => {
    if (err)
      { return console.log("err");

      }
     else {
       console.log("sector broadcast called");
      }
  });
  flag=0;
  }
//  var name = "hello";
  //res.render('information.html');
  //res.render('home.html')
res.json(print_json);

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
      transactionid:req.body.transactionid
  	};

  //console.log(bitcoin.sector_list[a].minee);
  var min=bitcoin.sector_list[a].minee;//////////
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
    const requestPromises = [];
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
  const id=req.body.transactionid;
  var min=bitcoin.sector_list[a].veri;
  ver_urls=[];
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
  //console.log("ver_urls"+ver_urls);
    var nSectors= Math.ceil(6/2);
    var nNodes= Math.ceil(ver_urls.length / nSectors);
    //console.log("nSectors-"+nSectors);
    //console.log("nNodes-"+nNodes);
    var ver_nodes_array = bitcoin.Create2DArray(nSectors, nNodes);
    //console.log(arr);
    var ind=0;
    for(var b=0;b<nSectors;b++){
      for(var i=0; i<nNodes; i++){
        ver_nodes_array[b][i]=ver_urls[ind];
        ind=ind+1;
      }
    }

      //console.log("port working--"+p)
      //for(var k=0;k<nSectors;k++)
      //{console.log("ver"+(k+1)+"--"+ver_nodes_array[k]);}

  var i=0;
  for(i=0;i< nSectors;i++)
  {
    if(bitcoin.in_array(ver_nodes_array[i],p) )
    {
        c[id][i]+=1;
        console.log("number of nodes verified in sector "+ (i+1) +" for id "+id+" are ="+c[id][i]);
    }
  }

  var f1=0
  for(var j=0;j< nSectors;j++)
  {
    if(c[id][j]>=Math.ceil(ver_nodes_array[j].length/2) )
      {
        f1=1;

      }
      else {
        f1=0;
      }
  }
  if (f1==1)
  {c[id][i]=1;
  //console.log("verification for id "+id+" = "+c[id][i]);
   }
res.json({ note: 'verification notification received' });
});


const server = app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});
