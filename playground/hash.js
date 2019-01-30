const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "password";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// })
var hashPassword = "$2a$10$ik/ZSOGHiEr2k2MNldCvTOlVkQQDlIrAAwgtHwAbMn4ful3FZvjp2"
bcrypt.compare(password, hashPassword, (err, res) => {
        console.log(res);
    })
    // let data = {
    //     id: 20
    // }

// let token = jwt.sign(data, "2056");

// console.log(token);

// decode = jwt.verify(token, "2056");
// console.log(decode);
// let message = "I have been hash";
// let hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// let data = {
//     id: 4
// }

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "secretKey").toString()
// }

// token.data.id = 10;
// token.hash = SHA256(JSON.stringify(data + "secretKey").toString());

// let hashResult = SHA256(JSON.stringify(token.data) + "secretKey").toString();

// if (hashResult === token.hash) {
//     console.log("password not change");
// } else {
//     console.log("password is change");
// }