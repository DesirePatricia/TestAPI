console.log("server is starting")
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var server = app.listen(3000, listening);
var account = require('./account.js')
var accounts = [];
var event = {
  type: "",
  origin: "",
  destination: "",
  amount: ""
}
var destination = {
  destination: {
      id: "",
      balance: ""
  }
}

var origin = {
  origin: {
      id: "",
      balance: ""
  }
}

function listening(){
  console.log("listening ... ")
}

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.post('/event', updateBalance)
function updateBalance(request, response){
  event.type = request.body.type;
  event.destination = request.body.destination;
  event.amount = request.body.amount;
  event.origin = request.body.origin;

  if(event.type === "withdraw"){
    if (accounts.find(x=> x.id === event.origin) === undefined){
      response.status(404).send("0");
    
    }
    else {
      var this_account = accounts.find(x=> x.id === event.origin);
      
    }
    this_account.balance = this_account.withdraw(event, this_account.balance)
    origin.origin.id = this_account.id;
    origin.origin.balance = this_account.balance;
    response.status(201).send(origin);
  }
  else if (event.type === "deposit"){
    if (accounts.find(x=> x.id === event.destination) === undefined){
      var this_account = new account(event.destination);
      accounts.push(this_account);
    }
    else {
      var this_account = accounts.find(x=> x.id === event.destination);
    }
    this_account.balance = this_account.deposit(event, this_account.balance)
    destination.destination.id = this_account.id;
    destination.destination.balance = this_account.balance;
    response.status(201).send(destination);
  }
  else if (event.type === "transfer"){
    if(accounts.find(x=> x.id === event.origin) === undefined){
      response.status(404).send("0")
    }
    else {
      var this_account = accounts.find(x=> x.id === event.origin);
      
    }
    if(accounts.find(x=> x.id === event.destination) === undefined){
      var this_account2 = new account(event.destination);
      accounts.push(this_account2);

    }
    else {
      var this_account2 = accounts.find(x=> x.id === event.destination);
    }
    this_account.balance = this_account.withdraw(event, this_account.balance)
    this_account2.balance = this_account2.deposit(event, this_account2.balance)

    var data = {
      origin: {
        id: this_account.id,
        balance: this_account.balance
      },
      destination: {
        id: this_account2.id,
        balance: this_account2.balance
      }
    }

    response.status(201).send(data);
  }

  
}

app.get('/balance', getBalance)

function getBalance(request, response){
    if (accounts.find(x=>x.id === request.query.account_id) === undefined){
      response.status(404).send("0")
    }
    else{
      var this_account = accounts.find(x=>x.id === request.query.account_id)
      response.send("" + this_account.balance);
    }
  
}
app.get('/', sendHome);
app.post('/', sendHome);

function sendHome(request, response){
  response.send("in");
}

app.post('/reset', reset);

function reset(request, response){
  accounts = []
  response.status(200).send("OK")
}



