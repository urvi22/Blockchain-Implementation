Minor project in blockchain

A 12 node sever has been setup start it using command : npm run start.
import postman collection from blockchain.postman_collection.
To close a used port: killall -9 node or sudo pkill node
To install mongodb : https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition http://mongodb.github.io/node-mongodb-native/2.2/quick-start/

Steps to run blockchain: 1)Hit http://localhost:3001/register-and-broadcast-node (Post Request) to register a new node with the network body--> { "newNodeUrl":"http://localhost:3011" }
2)Hit http://localhost:3006/transaction/broadcast (Post Request) to add a transaction in blockchain body--> { "transactionid":1, "amount":1, "sender":"A", "recipient":"B" }
3)Hit http://localhost:3006/verification-broadcast (Post Request) to verify the transaction Example--the user on 3006 is verifying the transaction with transactionid 6 Body--> { "transactionid":6 }
4)Hit http://localhost:3006/mining-initiation-bulk (Get Request) to start mining.For example port 3006 The process going on is visible on the command prompt.
