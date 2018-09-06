
var https = require('https');
var port=3000;
var fs=require("fs")
var options = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('certificate.pem'),
    requestCert: false,
    rejectUnauthorized: false
};



var express=require("express")
var app=express();
var server=require("http").createServer(app)
var io=require("socket.io").listen(server)


var request = require("request")

var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjY1Mjg5Nzc5LTE0N2ItNDFkNy1iMzczLWEwMzE5YjIyN2ZlOSIsImlhdCI6MTUzMzY0ODk2NCwiZXhwIjoxNTMzNjUyNTY0fQ.hFx0vlM32X_F8zSkywRl7qTJGY8ZrTdrCmZlYK5usJw";

//init RSA
var os = require('os');
if (os.platform() == 'win32') {  
    var chilkat = require('chilkat_node10_win32'); 
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('chilkat_node10_arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('chilkat_node10_linux32');
    } else {
        var chilkat = require('chilkat_node10_linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('chilkat_node10_macosx');
}


var rsa = new chilkat.Rsa();

var success = rsa.UnlockComponent("Anything for 30-day trial");

if (success !== true) {
    console.log("RSA component unlock failed");
    return;
}

success = rsa.GenerateKey(512);
if (success !== true) {
    console.log(rsa.LastErrorText);
    return;
}

//var publicKey = rsa.ExportPublicKey();
//var privateKey = rsa.ExportPrivateKey();

var publicKey ="<RSAPublicKey><Modulus>uRnJbSeZ8A8XPxD1H9SwBynZukeK4LGWAo7Y1Rub1mK986aZxa29inEGo6Cs6uprpZjwczBjuP+4obJLuH3Ihw==</Modulus><Exponent>AQAB</Exponent></RSAPublicKey>"
var privateKey ="<RSAKeyValue><Modulus>uRnJbSeZ8A8XPxD1H9SwBynZukeK4LGWAo7Y1Rub1mK986aZxa29inEGo6Cs6uprpZjwczBjuP+4obJLuH3Ihw==</Modulus> <Exponent>AQAB</Exponent><D>ttXo6AApBz3wyWPXrQRqh/jnzx/h50ajFY3CUuZ9jUm3nVJywTkFgbYvSylUM/Jnw2yg9vFmiOG/FiWx67LP+Q==</D><P>1l/RD2EQsNMzJbAUkycWwD55AUiRlr9HYMim1nGdTjU=</P><Q>3QrUzwawZII0PMeFunZbqzi6Xv7zzXX0yP8vAnIwQ0s=</Q><DP>Gw4GpWk7oQVWjCgXwKaLQYHg5Z+R+DN1v6ozHBdEog0=</DP><DQ>HGiy9zSt4Q0W96TRHCjwGS5+TY1I+mQppNefTBou98c=</DQ><InverseQ>AJY7Fv5h1QOrZqg69tW/+iHPAWziTvtwlc5phkS3MbA=</InverseQ></RSAKeyValue>";




var crypto = require('crypto')

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

// Data base thay the mongo ...
var user={name:"thanh",password:"thanh"}
var storeKey={moviestort:"ASDFGHJKLASDFGHJ"}
var idOrderMomo="123456789"
var order


var nameBankB="Ngân hàng B"
var tokenBankB="3a165f96e982913bfb4f247885a097ad"


io.sockets.on('connection',function(socket)
{
    console.log("\nMobile Connection ...")
    //đăng nhập...
    socket.on('clientSendMessage',function(data){     
            var recoder=JSON.parse(data) 
            if(recoder.name==user.name&&recoder.password==user.password)
            {
                console.log("\nMobile login successful ...")
                result=true;
                socket.emit("result-client",{noidung:result,token:token,key:storeKey.moviestort}) 
            }
            else
            {
                result=false;
                console.log("  +Mobile login fail ...")
            }   

    })
})

app.get("/",(req,res)=>{
    console.log(""+req.query.thanh);
    res.json("thanh ne !")
})

app.get("/getID",(req,res)=>{

    if(req.query.order&&req.query.name&&req.query.poster&&req.query.duration&&req.query.rating&&req.query.released&&req.query.genre&&req.query.price&&req.query.director&&req.query.token&&req.query.hash)
    {
        
        console.log("Cấp Id cho giao dich ... ")
        //console.log("result : "+req.query.order+"--"+req.query.token+"--"+req.query.hash)
      
        //console.log("hash : "+req.query.hash)
        var hashWeb=req.query.hash
        var hashQuery=checksum(checksum((req.query.name+"."+req.query.poster+"."+req.query.duration+"."+req.query.rating+"."+req.query.released+"."+req.query.genre+"."+req.query.price+"."+req.query.director), 'sha1')+"."+checksum(req.query.token, 'sha1'),'sha1')
       
        //console.log("checksum : "+hashQuery)

        //RSA decryptor ...
        var rsaDecryptor = new chilkat.Rsa();
        rsaDecryptor.EncodingMode = "hex";
        success = rsaDecryptor.ImportPrivateKey(privateKey);
        usePrivateKey = true;
        var decryptedStr = rsaDecryptor.DecryptStringENC(hashWeb,usePrivateKey);

        //console.log("--------------decryptedStr : "+decryptedStr);

        order={
             "name": req.query.name,
             "poster": req.query.poster,
             "duration":req.query.duration,
             "rating": req.query.rating,
             "released": req.query.released,
             "genre": req.query.genre,
             "price": req.query.price,
             "director": req.query.director,
             "token":req.query.token,
             "nameBuy":req.query.order
        }
        //console.log("order :"+JSON.stringify(order))
        if(decryptedStr==hashQuery)
        {
            var send={"result":"true","idOrderMomo":idOrderMomo}
           
            //RSA encryptor...
            
            var rsaEncryptor = new chilkat.Rsa();
            rsaEncryptor.EncodingMode = "hex";
            success = rsaEncryptor.ImportPublicKey(publicKey);
            var usePrivateKey = false;
            var check=checksum((checksum(send.result,'sha1')+"."+checksum(send.idOrderMomo,'sha1')),'sha1')
            var encryptedStrCheckSum = rsaEncryptor.EncryptStringENC(check,usePrivateKey);
        
            //console.log("check :"+check)
            res.json({"result":send.result,"idOrderMomo":send.idOrderMomo,"check":encryptedStrCheckSum})


        }
        else
        {
            res.json({"result":"false","idOrderMomo":idOrderMomo})
        }
        //console.log("log :"+req.query.order+"--"+req.query.name+"--"+req.query.poster+"--"+req.query.duration+"--"+req.query.rating+"--"+req.query.released+"--"+req.query.genre+"--"+req.query.price+"--"+req.query.director) 
    }

})


// check qr code ...
app.get('/qrcode',function(req,res){ 

    //console.log("----"+req.query.id+"--"+order.token+"--"+order.nameBuy)

    if(req.query.id==idOrderMomo)
    {
            var hashQuery=checksum(checksum((order.name+"."+order.poster+"."+order.duration+"."+order.rating+"."+order.released+"."+order.genre+"."+order.price+"."+order.director), 'sha1')+"."+checksum("true", 'sha1'),'sha1')
            console.log("Kết quả quét mã Qr ...");

            res.json({ 
                "name": order.name,
                "poster": order.poster,
                "duration": order.duration,
                "rating": order.rating,
                "released": order.released,
                "genre": order.genre,
                "price": order.price,
                "director": order.director,
                "check":hashQuery,
                "result":"true"
            }); 
     
    }

});

app.get('/buy',function(req,res){ 

    //console.log("result :"+req.query.result+"--"+req.query.check)
    if(req.query.result=="true")
    { 
          //RSA decryptor ...
          var rsaDecryptor = new chilkat.Rsa();
          rsaDecryptor.EncodingMode = "hex";
          success = rsaDecryptor.ImportPrivateKey(privateKey);
          usePrivateKey = true;
          var de= rsaDecryptor.DecryptStringENC(req.query.check,usePrivateKey);
     
         //console.log("check sum : "+checksum(req.query.result,'sha1')+"--"+de)

        if(checksum(req.query.result,'sha1')==de)
        {

        //RSA encryptor...
        var rsaEncryptor = new chilkat.Rsa();
        rsaEncryptor.EncodingMode = "hex";
        success = rsaEncryptor.ImportPublicKey(publicKey);
        var usePrivateKey = false;
        var hashbank=checksum(checksum((order.token), 'sha1')+"."+checksum((tokenBankB), 'sha1'),'sha1')
        var encryptedStrCheckSum = rsaEncryptor.EncryptStringENC(hashbank,usePrivateKey);

        var url = "http://192.168.1.3:1234/bank?token="+order.token+"&&check="+encryptedStrCheckSum+"&&tokenbank="+tokenBankB
        request({ url: url,json: true}, function (error, response, body) {
        if (!error && response.statusCode === 200) {

         var hash=checksum(checksum("true", 'sha1')+"."+checksum("true", 'sha1'),'sha1')
          //RSA decryptor ...
        var rsaDecryptor = new chilkat.Rsa();
        rsaDecryptor.EncodingMode = "hex";
        success = rsaDecryptor.ImportPrivateKey(privateKey);
        usePrivateKey = true;
        var decryptedStr = rsaDecryptor.DecryptStringENC(body.check,usePrivateKey);
    
        //console.log('body :'+body.result+"--"+body.check+"--"+decryptedStr)
        if(body.result&&hash==decryptedStr)
        {
            console.log("Kiêm tra thẻ thành công ... ")
            res.json({"result":"true"})
            console.log("\nThanh toán phim thanh công...")
            var hashQuery=checksum(checksum((order.nameBuy), 'sha1')+"."+checksum((order.name), 'sha1'),'sha1')
            //RSA encryptor...
            var rsaEncryptor = new chilkat.Rsa();
            rsaEncryptor.EncodingMode = "hex";
            success = rsaEncryptor.ImportPublicKey(publicKey);
            var usePrivateKey = false;
            var encryptedStrCheckSum = rsaEncryptor.EncryptStringENC(hashQuery,usePrivateKey);
            var url = "http://192.168.1.3:8080/resultbuy?namebuy="+order.nameBuy+"&&resultbuy="+order.name+"&&check="+encryptedStrCheckSum
            request({ url: url,json: true}, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Thanh toán phim không thanh công... ... ")
            }})

        }
        else
        {
            console.log("The không tồn tại ...")

        }
        }
        })
        }
    }
    else
    {
        res.json({"result":"false"})
        console.log("\nThanh toán phim không thanh công...") 
    }
     
})

 
var server = https.createServer(options, app).listen(3000, function(){
    console.log("SSL Api ứng dụng quét mã Qrcode : "+3000)
});