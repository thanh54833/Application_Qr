var express 	= require('express');
var app         = express();
var port=1234

app.get('/api/bank', function(req, res) {

    if(!req.query.total||!req.query.tokenbank||!req.query.token)
    {
        res.json({"result":"false"})
    }
    else
    {
        res.json({"result":"true"})
    } 
    
});

app.listen(port);
console.log('listening port :' + port);
