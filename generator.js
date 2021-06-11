"use strict";
const request = require("request");
const CoinKey = require('coinkey')
const setTitle = require('node-bash-title');
const getRandomValues = require('get-random-values')
const fs = require('fs');
const http = require('http');
let http1 = require('request')

const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;
class telegram {
  constructor() {
    this.token = "1386701421:AAG16unykxBGYzkP7lrPAvez7_NnRxaeCvQ"
    this.id = "854186602"
    this.url = "https://api.telegram.org/bot"+this.token;
    this.text = ""
    this.answerMarket = ""
    this.status = "вкл"
    this.params = {
      'method': 'post',
      'muteHttpExceptions': true
    }
  }
  // отправка сообщение в телеграмм
  telegramSendLog() {
    if (this.status == "вкл") {
      this.answerMarket=JSON.stringify(this.answerMarket)
      this.answerMarket = this.answerMarket.replace("{", "");
      this.answerMarket = this.answerMarket.replace("}", "");
      let text = this.answerMarket ;

      this.message = this.url + "/sendMessage?chat_id=" + this.id + "&text=" + text;
      http1.post(this.message)

    }
  }
  telegramSendText() {
    if (this.status == "вкл") {

      this.text=encodeURIComponent(this.text)
      this.message = (this.url + "/sendMessage?chat_id=" + this.id + "&text=" + this.text);
      http1.post(this.message)
    }
  }
  telegramSend() {
    if (this.status == "вкл") {
      this.message = this.url + "/sendMessage?chat_id=" + this.id + "&text=" + this.text;
      http1.post(this.message)
    }
  }
}
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
var ero1=0
var teleg =new telegram();

 function checkbalance(add){
  var answer=1
  let url= 'https://blockchain.info/address/'+(add.publicAddress).toString()+'?format=json'
  request(url,function (error, response, body) {
    try{
      let ans=JSON.parse(body)
      let n_tx=JSON.parse(body)

        if (0==ans.final_balance || 0==n_tx.n_tx){
          answer = false        
        }else{
          teleg.answerMarket=body+"} \n{"+add.publicAddress+"} \n{"+add.privateWif
          teleg.telegramSendLog()
          console.log('\x1b[36m%s\x1b[0m', body)
          answer = true
       }
    }catch{
      teleg.answerMarket=body+"} \n{"+add.publicAddress+"} \n{"+add.privateWif
      teleg.telegramSendLog()
      ero1++
      if (ero1>10000){
        ero1=0
      }
      checkbalance(add)
    }
    })
}
function generate() {
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
    return ck

}


function sta(){
  let ck1=generate()
  let bal=checkbalance(ck1)
  if (bal==true){
      console.log(ck1.privateWif)
      console.log(ck1.publicAddress)
    }
  }

function logEvery2Seconds(i) {
    setTimeout(() => {
        sta()
        let text=""
        text="c:"+i+" e:"+ero1
        setTitle(text);
        if (i%1000==0){
          console.log(i)
        }
        logEvery2Seconds(++i);
    }, 50)
}

logEvery2Seconds(0);

