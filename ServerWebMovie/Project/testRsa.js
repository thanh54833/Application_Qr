



/*var Pi="123456789"
var Oi="thanhthanh"

var hashPi = require('crypto'), hashPi = hashPi.createHash('sha1');
var hashOi = require('crypto'), hashOi = hashOi.createHash('sha1');
var hashPO = require('crypto'), hashPO = hashPO.createHash('sha1');

hashPi.update(Pi);
hashOi.update(Oi);
var PO=hashPi.digest('hex')+"."+hashOi.digest('hex')
hashPO.update(PO);


console.log(hashPO.digest('hex'));*/

var NodeRSA = require('node-rsa');
var fs = require('fs');
var publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBOQIBAAJAWvKMulRNnfZseO++bq8xX74qK2HtjxLqhB26XzrBm7tFZUxR7cqr4APjRsPVnFwvyBAZaWkSPDzn3SH5uPWgmwIDAQABAkAtwqK6Uhanp0jW5NItgOrX4Kf5IhHUjlD/XrHanoax40ODQK8bN8yjKfcVssBvOSZc0gdzECf2hdCoMBvOu5MRAiEAoAOs0A5cIKEXuKphfyIcJDecUQiCyfkqkw761xOCxvMCIQCRgLzLyhc+tsMobpS8tPnn0lB86sAj5IeqsUBX46l5uQIhAIoy4lxHKrZbq3soXFBLC3cUOIOcECmUc3rTYz3Cch6VAiBDLqH9po4dEt4BaS2cBCPvehhX1TxqVjaeBcGj0yaJYQIgeT7MtgHOyp5R4D3QjmZEWaXMJpHlNhUMMjZQDSVXOaI=n-----END PUBLIC KEY-----";
var privateKey = '-----BEGIN RSA PRIVATE KEY-----\nMFswDQYJKoZIhvcNAQEBBQADSgAwRwJAWvKMulRNnfZseO++bq8xX74qK2HtjxLqhB26XzrBm7tFZUxR7cqr4APjRsPVnFwvyBAZaWkSPDzn3SH5uPWgmwIDAQAB\n-----END RSA PRIVATE KEY-----'
const constants = require('constants');
var options1 = {
  environment: 'node',
  encryptionScheme: {
    scheme: 'pkcs1_oaep',
    hash: 'md5', //hash using for scheme
  }
}
var text = 'This is the string to be encrypted using RSA!';

var encryptKey = new NodeRSA(publicKey, 'pkcs8-public', options1);
encryptKey.setOptions(options1)

var encrypted = encryptKey.encrypt(text, 'base64');
console.log(encrypted);
console.log(encryptKey.isPublic(true))

var options2  = {
  environment: 'node',
  encryptionScheme: {
    scheme: 'pkcs1_oaep', //scheme
    hash: 'md5', //hash using for scheme
  }
}

var decryptKey = new NodeRSA(privateKey, 'pkcs1', options2);
decryptKey.setOptions(options2)
var decrypted = decryptKey.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);