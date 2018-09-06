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

    var socket = new chilkat.Socket();

    var success;
    success = socket.UnlockComponent("Anything for 30-day trial");
    if (success !== true) {
        console.log(socket.LastErrorText);
        return;
    }

    var ssl = true;
    var maxWaitMillisec = 20000;

    //  The SSL server hostname may be an IP address, a domain name,
    //  or "localhost".
    var sslServerHost;
    sslServerHost = "www.paypal.com";
    //sslServerHost = "localhost"
    var sslServerPort = 443;

    //  Connect to the SSL server:
    success = socket.Connect(sslServerHost,sslServerPort,ssl,maxWaitMillisec);
    if (success !== true) {
        console.log(socket.LastErrorText);
        return;
    }

    // cert: Cert
    var cert;

    var bExpired;
    var bRevoked;
    var bSignatureVerified;
    var bTrustedRoot;

    cert = socket.GetSslServerCert();

    console.log("Check Vertify ... ")

    if (!(cert == null )) {

        console.log("Server Certificate:");
        console.log("Distinguished Name: " + cert.SubjectDN);
        console.log("Common Name: " + cert.SubjectCN);
        console.log("Issuer Distinguished Name: " + cert.IssuerDN);
        console.log("Issuer Common Name: " + cert.IssuerCN);

        bExpired = cert.Expired;
        bRevoked = cert.Revoked;
        bSignatureVerified = cert.SignatureVerified;
        bTrustedRoot = cert.TrustedRoot;

        console.log("Expired: " + bExpired);
        console.log("Revoked: " + bRevoked);
        console.log("Signature Verified: " + bSignatureVerified);
        console.log("Trusted Root: " + bTrustedRoot);
        
    }

    //  Close the connection with the server
    //  Wait a max of 20 seconds (20000 millsec)
    success = socket.Close(20000);

/*var url = "http://localhost:17000/sub1/sub2/mypage.html?q=12";

var host=url.split("/")[2]
var port=host.split(":")[1]

var port2=host.split(":")[1]

console.log("host :"+host)// == "localhost:17000"
console.log("host :"+port)// == "localhost:17000"

console.log("port :"+url.split("/")[url.split("/").length-1])// == "mypage.html?q=12"*/

