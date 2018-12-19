import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from '../../components/navbar'
import FormInput from '../../components/formInput'
import TableTrx from '../../components/tableTrx'
import firebase from '../../firebase'


import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Expense from '../../../build/contracts/Expense.json'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      transactions: [],
      hasVoted: false,
      loading: true,
      voting: false,
      email: '',
      location: '', // add new-----------------
      grandTotal: 0
    }
    // this.web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    if (typeof web3 == 'undefined') {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    } else {
      this.web3Provider = Web3.givenProvider
    }

    this.web3 = new Web3(this.web3Provider)

    this.expense = TruffleContract(Expense)
    this.expense.setProvider(this.web3Provider)

    this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)
  }

  cekLogin = () => {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        email: user.email
      })
      // console.log(user);
  });
  }

  componentDidMount = () => {
    // TODO: Refactor with promise chain
    this.cekLogin()
    this.getTransactions()
    this.getLocation()
  }

  getTransactions=()=>{
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.expense.deployed().then((instance) => {
        this.expenseInstance = instance
        this.watchEvents()

        return this.expenseInstance.totalTransactions()
      }).then(async (totalTransaction) => {

        return { user: await this.expenseInstance.owner(), totalTransaction: totalTransaction }
      }).then(({ user, totalTransaction }) => {
        let arr = [];
        for (let i = 0; i <= totalTransaction; i++) {
          this.expenseInstance.transactions(i).then( (transaction)=> {
            let owner = transaction[6]
            console.log('trx:', transaction, ' cek user--:', user, '===', owner, user === owner)
            if (this.state.email === owner) {
              arr.push(transaction)
            }
          });
        }
        this.setState({ transactions: arr, grandTotal: this.setGrandTotal(arr) })
      }).catch(err => {
        console.log(err)
      })
    })
  }

  watchEvents() {
    // TODO: trigger event when transaction is counted, not when component renders
    this.expenseInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      console.log("event triggered", event)
        // Reload when a new transaction is recorded

    })
  }

  addTransaction = async (category, description, imageBill, total, status) => {
    let {email} = this.state
    let id = await this.getId()
    let date = String(new Date().toLocaleString())
    let location = this.state.location
    console.log('total in add trx:', Number(total))
    if (!imageBill) imageBill = 'https://www.firstaidacademy.co.uk/app/themes/ibex-theme/img/no-img.gif';
    this.expenseInstance.addTransaction(category, description, imageBill, Number(total), status, email, date, Number(id), location, { from: this.state.account })
      .then((result) => {
        // this.watchEvents()
        console.log('success add new transaction', result)
        this.getTransactions()
      }).catch(function (err) {
        console.error(err);
      });
  }

  // add new ------------------------------
  getLocation=()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
       console.log("Geolocation is not supported by this browser.");
    }
  }

  showPosition=(position)=> {
    let obj={
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    let storeObj = JSON.stringify(obj);
    this.setState({location: storeObj}, ()=>{
      console.log('this.state.location:', this.state.location)
    });
  }

  getId=()=>{
    let possible = '1234567890'
    var text = "";
        
        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return '666'+text;
  }

  setGrandTotal = (arr)=>{
    let counter=0;
    arr.forEach((el, i)=>{
      if(el[4].s == -1) {
        counter -= el[4].c[0]
      } else {
        counter += el[4].c[0]
      }
    })
    this.setState({grandTotal: counter})
  }

  
  castVote(candidateId) {
    this.setState({ voting: true })
    this.expenseInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  render() {
    if(this.state.transactions.length > 0 && !this.state.grandTotal) this.setGrandTotal(this.state.transactions)
    return (
      <div>
        <Navbar></Navbar>
        <main className="container" style={{marginTop: 10}}>
          <div>
            <FormInput
              account={this.state.account}
              transactions={this.state.transactions}
              hasVoted={this.state.hasVoted}
              castVote={this.castVote}
              addTransaction={this.addTransaction}></FormInput>
            <TableTrx
              account={this.state.account}
              transactions={this.state.transactions}
              hasVoted={this.state.hasVoted}
              castVote={this.castVote}
              grandTotal={this.state.grandTotal}
            ></TableTrx>
          </div>
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    
  }
}

export default connect(mapStateToProps, null)(Home);