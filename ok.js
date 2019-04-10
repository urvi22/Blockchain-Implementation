$.ajax({
    url: "http://localhost:3001/transaction",
    type: "POST",
    contentType: "application/json",
    data: {
        amount: "1" , sender:"a" , recipient:"b"
    },
    success: function(results){
        console.log(results)
    },
    error: function(err) {
        console.log(err)
    }
});
