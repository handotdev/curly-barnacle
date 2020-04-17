const CryptoJS = require('crypto-js');

let secretKey = 'eaf542b9-9451-4591-b18d-d954d6284cf3';

let cipherText = CryptoJS.AES.encrypt(
  'ag759@cornell.edu',
  secretKey
).toString();
console.log(cipherText);
console.log(cipherText.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l').replace(/\?/g, '2F9dCse'))

const decrypted = CryptoJS.AES.decrypt(cipherText, secretKey);
const email = decrypted.toString(CryptoJS.enc.Utf8);