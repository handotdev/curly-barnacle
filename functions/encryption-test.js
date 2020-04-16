const CryptoJS = require('crypto-js');

let secretKey = 'curly-barnacles';

let cipherText = CryptoJS.AES.encrypt(
  'ag759@cornell.edu',
  secretKey
).toString();

let decrypted = CryptoJS.AES.decrypt(cipherText, secretKey);
const email = decrypted.toString(CryptoJS.enc.Utf8);
