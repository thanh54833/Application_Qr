const express=require('express');
const bodyParser=require("body-parser");
const passPort=require("passport");
const localStrategy=require("passport-local").Strategy;
const fs=require("fs");
const session=require("express-session");
const mongoose=require('mongoose');
const port=8080;
const app=express();
const tokenBank="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTExMjM0ZGFzNTY3ODlkYXMwIiwibmFtZSI6IkozM2Rhb2hkc2FuIGRhZGFzc0RvZSIsImFkbWluIjp0cnVlLCJqdGkiOiJmNmZiMWEyZi1iNThiLWFzZGE0ODMtOWM0OC1hMWE2ZjA2MmUyNWUiLCJpYXQiOjE1MzM0NTY1ODcsImV4cCI6MTUzMzQ2MzgxM30.p6UqmE9wsy8HGZQtsOuPlIDImcq-oIL6rrTcNQDFnLM"
var request = require("request")
var qr = require('qr-image'); 

// int RSA
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






app.set('views',"./views");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"mysecret1",cookie:{ maxAge:1000*60*5 }}));
app.use(passPort.initialize());
app.use(passPort.session());

var crypto = require('crypto')

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

// Data base thay thế mongo...
var nameBankA="Ngân hàng A"
var tokenBankA="15cf19bb3f6c2968520a551603fedfdf"
var user={name:"thanh",password:"thanh"}

var order={ 
    "name": "Dunkirk",
    "poster": "https://api.androidhive.info/barcodes/dunkirk.jpg",
    "duration": "1hr 46min",
    "rating": 4.6,
    "released": true,
    "genre": "Action",
    "price": "200000",
    "director": "Christopher Nolan"
}


// check vertify ...

var socket = new chilkat.Socket();

var success;
success = socket.UnlockComponent("Anything for 30-day trial");
if (success !== true) {
    console.log(socket.LastErrorText);
    return;
}


    var ssl = true;
    var maxWaitMillisec = 20000;
    var sslServerHost;
    sslServerHost = "www.paypal.com";

    var sslServerPort = 443;
    success = socket.Connect(sslServerHost,sslServerPort,ssl,maxWaitMillisec);
    if (success !== true) {
        console.log(socket.LastErrorText);
        return;
    }

   
    var cert;
    var bExpired;
    var bRevoked;
    var bSignatureVerified;
    var bTrustedRoot;
    cert = socket.GetSslServerCert();
    console.log("+++ Check Vertify ... ")
    if (!(cert == null )) {

        console.log("   +Server Certificate:");
        console.log("   +Distinguished Name: " + cert.SubjectDN);
        console.log("   +Common Name: " + cert.SubjectCN);
        console.log("   +Issuer Distinguished Name: " + cert.IssuerDN);
        console.log("   +Issuer Common Name: " + cert.IssuerCN);

        bExpired = cert.Expired;
        bRevoked = cert.Revoked;
        bSignatureVerified = cert.SignatureVerified;
        bTrustedRoot = cert.TrustedRoot;

        console.log("   +Expired: " + bExpired);
        console.log("   +Revoked: " + bRevoked);
        console.log("   +Signature Verified: " + bSignatureVerified);
        console.log("   +Trusted Root: " + bTrustedRoot);
        
    }
    success = socket.Close(20000);



// show qr 
app.get("/showqr",(req,res)=>
{  


var rsaEncryptor = new chilkat.Rsa();
rsaEncryptor.EncodingMode = "hex";
success = rsaEncryptor.ImportPublicKey(publicKey);
var usePrivateKey = false;
var check=checksum(checksum((order.name+"."+order.poster+"."+order.duration+"."+order.rating+"."+order.released+"."+order.genre+"."+order.price+"."+order.director), 'sha1')+"."+checksum(tokenBankA, 'sha1'),'sha1')
var encryptedStrCheckSum = rsaEncryptor.EncryptStringENC(check,usePrivateKey);

var url = "http://192.168.1.3:3000/getID?order="+user.name+"&&name="+order.name+
"&&poster="+order.poster+"&&duration="+order.duration+"&&rating="+order.rating+
"&&released="+order.released+"&&genre="+order.genre+"&&price="+order.price+"&&director="+order.director+"&&token="
+tokenBankA+"&&hash="+encryptedStrCheckSum

request({ url: url,json: true}, function (error, response, body) {

    if (!error && response.statusCode === 200) {

        console.log("----------response.request.host ="+response.request.host)
        console.log("----------response.request.port ="+response.request.port)
        //console.log(JSON.stringify(response))

        //check vertify...
        var socket = new chilkat.Socket();

var success;
success = socket.UnlockComponent("Anything for 30-day trial");
if (success !== true) {
    console.log(socket.LastErrorText);
    return;
}


    var ssl = true;
    var maxWaitMillisec = 20000;
    var sslServerHost;
    sslServerHost = "www.paypal.com";

    var sslServerPort = 443;
    success = socket.Connect(sslServerHost,sslServerPort,ssl,maxWaitMillisec);
    if (success !== true) {
        console.log(socket.LastErrorText);
        return;
    }

   
    var cert;
    var bExpired;
    var bRevoked;
    var bSignatureVerified;
    var bTrustedRoot;
    cert = socket.GetSslServerCert();
    console.log("+++ Check Vertify ... ")
    if (!(cert == null )) {

        console.log("   +Server Certificate:");
        console.log("   +Distinguished Name: " + cert.SubjectDN);
        console.log("   +Common Name: " + cert.SubjectCN);
        console.log("   +Issuer Distinguished Name: " + cert.IssuerDN);
        console.log("   +Issuer Common Name: " + cert.IssuerCN);

        bExpired = cert.Expired;
        bRevoked = cert.Revoked;
        bSignatureVerified = cert.SignatureVerified;
        bTrustedRoot = cert.TrustedRoot;

        console.log("   +Expired: " + bExpired);
        console.log("   +Revoked: " + bRevoked);
        console.log("   +Signature Verified: " + bSignatureVerified);
        console.log("   +Trusted Root: " + bTrustedRoot);
        
    }
    success = socket.Close(20000);
    if(bSignatureVerified)
    {

         // send id ...
         console.log("requst url :"+body.result) 
         if(body.result)
         {
             console.log("idOrderMomo : "+body.idOrderMomo)
 
              //RSA decryptor ...
             var rsaDecryptor = new chilkat.Rsa();
             rsaDecryptor.EncodingMode = "hex";
             success = rsaDecryptor.ImportPrivateKey(privateKey);
             usePrivateKey = true;
             var decryptedStr = rsaDecryptor.DecryptStringENC(body.check,usePrivateKey);
             var check=checksum((checksum(body.result,'sha1')+"."+checksum(body.idOrderMomo,'sha1')),'sha1')
 
             if(check==decryptedStr)
             {
                 console.log("Tạo mã Qrcode trên Web ...")
                      var code = qr.image(body.idOrderMomo, { type: 'svg' });
                      res.type('svg');
                     code.pipe(res);
             }
             else
             {
                 console.log("Nhận mã bị lỗi ... ")
             }
             console.log("decryptedStr --- :"+decryptedStr)
 
         }else
         {
             console.log("Thông tin bị sửa đổi ...")
         }
 
        //end ... 
    }

    //end ... 
    }
})
console.log("order : "+JSON.stringify(order));
});

// result buy ...
app.get('/resultbuy',function(req,res){
    console.log("log :"+req.query.namebuy+"--"+req.query.resultbuy+"--"+req.query.check)
    
    if(req.query.resultbuy)
    {
        if(req.query.namebuy==user.name)
        {

            
            var socket = new chilkat.Socket();

            var success;
            success = socket.UnlockComponent("Anything for 30-day trial");
            if (success !== true) {
                console.log(socket.LastErrorText);
                return;
            }
            
            
                var ssl = true;
                var maxWaitMillisec = 20000;
                var sslServerHost;
                sslServerHost = "www.paypal.com";
                var sslServerPort = 443;
                success = socket.Connect(sslServerHost,sslServerPort,ssl,maxWaitMillisec);
                if (success !== true) {
                    console.log(socket.LastErrorText);
                    return;
                }
            
               
                var cert;
                var bExpired;
                var bRevoked;
                var bSignatureVerified;
                var bTrustedRoot;
                cert = socket.GetSslServerCert();
                console.log("+++ Check Vertify ... ")
                if (!(cert == null )) {
            
                    console.log("   +Server Certificate:");
                    console.log("   +Distinguished Name: " + cert.SubjectDN);
                    console.log("   +Common Name: " + cert.SubjectCN);
                    console.log("   +Issuer Distinguished Name: " + cert.IssuerDN);
                    console.log("   +Issuer Common Name: " + cert.IssuerCN);
            
                    bExpired = cert.Expired;
                    bRevoked = cert.Revoked;
                    bSignatureVerified = cert.SignatureVerified;
                    bTrustedRoot = cert.TrustedRoot;
            
                    console.log("   +Expired: " + bExpired);
                    console.log("   +Revoked: " + bRevoked);
                    console.log("   +Signature Verified: " + bSignatureVerified);
                    console.log("   +Trusted Root: " + bTrustedRoot);
                    
                }
                success = socket.Close(20000);
    
                if(bSignatureVerified)
                {


                    var check=checksum((checksum(req.query.namebuy,'sha1')+"."+checksum(req.query.resultbuy,'sha1')),'sha1')
                    //RSA decryptor ...
                    var rsaDecryptor = new chilkat.Rsa();
                    rsaDecryptor.EncodingMode = "hex";
                    success = rsaDecryptor.ImportPrivateKey(privateKey);
                    usePrivateKey = true;
                    var decryptedStr = rsaDecryptor.DecryptStringENC(req.query.check,usePrivateKey);
          
              
                  if(check==decryptedStr)
                  {
                      console.log("Tài khoản tên ((  "+req.query.namebuy+"  )) hoàn thành thanh toán phim  (( "+req.query.resultbuy+" ))...")
                  }  




                }




        }
    }
 })

  


// login
app.route('/login').get((req,res)=>res.render("login"))
.post(passPort.authenticate('local',{failureRedirect: '/login',successRedirect:'/loginOK'}));

// Đăng nhập thành công ... 
app.get('/loginOK',(req,res)=>
{  
 
    res.render("movie")
 
});



// check qr code ...
app.get('/qrcode',function(req,res){ 

            if(true)
            {
                res.json({ 
                    "name": "Dunkirk",
                    "poster": "https://api.androidhive.info/barcodes/dunkirk.jpg",
                    "duration": "1hr 46min",
                    "rating": 4.6,
                    "released": true,
                    "genre": "Action",
                    "price": "200.000vnđ",
                    "director": "Christopher Nolan"
                });       
            }

});

// passport ...
passPort.use(new localStrategy((username,password,done)=>{ 
        if(username==user.name&&password==user.password)
        {
            return done(null,user)
        }
        else
        {
            return done(null,false)         
        }  
    }
))
passPort.serializeUser((user,done)=>{
    done(null,user.name)
    console.log("\nĐăng nhập vào web phim thành công...")
});
passPort.deserializeUser((name,done)=>{
        if(name==user.name)
        {
            if(true)
            {   
                return done(null,user)
            }
            else
            {
                return done(null,false) 
            }
        }          
})
app.listen(port,()=>console.log('Chạy server web bán phim :'+port));

