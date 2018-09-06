var https = require('https');

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
// ASE ... 

var crypto = require('crypto'),
    algorithm = 'aes-256-cbc',
    password = 'd6F3Efeq';

var bankA="Ngân hàng A"
var bankB="Ngân hàng B"

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 

//console.log("decrypt : "+decrypt(hwB));


// Data base thay the mongo ...
var user={name:"thanh",password:"thanh"}
var storeKey={moviestort:"ASDFGHJKLASDFGHJ"}
var idOrderMomo="123456789"
var order

app.get("/bank",function(req,res){

    

    console.log("Tiến hành thanh toán ...")
    var hashbank=checksum(checksum((req.query.token), 'sha1')+"."+checksum((req.query.tokenbank), 'sha1'),'sha1')
    
    //RSA decryptor ...
    var rsaDecryptor = new chilkat.Rsa();
    rsaDecryptor.EncodingMode = "hex";
    success = rsaDecryptor.ImportPrivateKey(privateKey);
    usePrivateKey = true;
    var decryptedStr = rsaDecryptor.DecryptStringENC(req.query.check,usePrivateKey);

    //console.log("token  :"+"---"+req.query.token)
    //console.log("decrypt : "+decrypt((req.query.token).toString()));

    console.log("Kiểm tra Thông tin hai tài khoan ngân hang tồn tại ... ")
    if(hashbank==decryptedStr&&decrypt((req.query.token).toString())==bankA&&decrypt((req.query.tokenbank).toString())==bankB)//&&req.query.token=="12345"
    {
       
       console.log("Hai tài khoản tồn tại , thanh toán thành công  ... ")
       var hash=checksum(checksum("true", 'sha1')+"."+checksum("true", 'sha1'),'sha1')

       var rsaEncryptor = new chilkat.Rsa();
       rsaEncryptor.EncodingMode = "hex";
       success = rsaEncryptor.ImportPublicKey(publicKey);
       var usePrivateKey = false;
       var encryptedStrCheckSum = rsaEncryptor.EncryptStringENC(hash,usePrivateKey);

       res.json({"result":"true","check":encryptedStrCheckSum})


    }
    else
    {
        console.log("Thanh toán thất bại ... ")
    }





})


app.get("/thanh",(req,res)=>{

    res.send("123!")
    console.log("123...");

})



var server = https.createServer(options, app).listen(1234, function(){
    console.log("Chạy Api ngân hàng : "+1234)
});