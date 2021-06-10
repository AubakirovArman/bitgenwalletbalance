"use strict";
const request = require("request");
const CoinKey = require('coinkey')
const setTitle = require('node-bash-title');
const getRandomValues = require('get-random-values')
const fs = require('fs');


let count=0
function generate() {
    count++
    setTitle(count.toString());
    let randArr = new Uint8Array(32);
    getRandomValues(randArr)
    
    let privateKeyBytes = []
    for (var i = 0; i < randArr.length; ++i)
      privateKeyBytes[i] = randArr[i]
    
    function toHexString(byteArray) {
        return Array.from(byteArray, function(byte) {
            return (('0' + byte).toString(16)).slice(-2);
        }).join('')
    }
    
    let privateKeyHex = toHexString(privateKeyBytes).toUpperCase()
    
    let ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'))
    ck.compressed = false
     let url= 'https://blockchain.info/address/'+(ck.publicAddress).toString()+'?format=json'
    
    request(url,function (error, response, body) {
        let ans=JSON.parse(body).final_balance
        let n_tx=JSON.parse(body).n_tx
          if (0==ans || 0==n_tx){
            generate()
          }else{
            console.log(n_tx)
            console.log(ans)
            console.log(ck.publicAddress) // don't do this if you want even faster performance.
            console.log(ck.privateWif)
         }
      })
}

generate()


