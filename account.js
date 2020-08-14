class Account{


    constructor(id){
        this.id = id
        this.balance = 0
    }

    withdraw(event, balance) {
        balance -= event.amount;
        return balance;
    
    }
    
    deposit(event, balance){
        balance += event.amount;
        return balance;
    }
    

}

module.exports = Account;



