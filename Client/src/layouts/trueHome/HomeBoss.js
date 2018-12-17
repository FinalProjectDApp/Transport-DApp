import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from '../../components/navbar'
import { Pie } from 'react-chartjs'
import TableTrx from '../../components/tableTrx'
import Header from '../../components/header'
import firebase from '../../firebase'

import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Expense from '../../../build/contracts/Expense.json'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      subordinates: [],
      transactions: [],
      hasVoted: false,
      loading: true,
      voting: false,
      choosed: false,
      email: '',
      chartData: [],
      totalExpense: 0
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
  }

  getTransactions=(ownerSelected)=>{
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
        let chartData = [];
        let arrSubordinates = [];
        for (let i = 0; i <= totalTransaction; i++) {
          this.expenseInstance.transactions(i).then( (transaction)=> {
            let owner = transaction[6]
            if (!arrSubordinates.includes(owner)) arrSubordinates.push(owner)
            console.log('trx:', transaction, ' cek user--:', user, '===', owner, user === owner)
            if (ownerSelected === owner) {
              arr.push(transaction)
              let obj = {};
              switch (transaction[1]) {
                case 'Food & Beverage':
                  obj = {
                    color:"#F7464A",
                    highlight: "#FF5A5E"
                  }
                  break;
                case 'Transportation':
                  obj = {
                    color: "#46BFBD",
                    highlight: "#5AD3D1"
                  }
                  break;
                case 'Accomodation':
                  obj = {
                    color: "#33cc33",
                    highlight: "#2eb82e"
                  }
                  break;
                case 'Entertainment':
                  obj = {
                    color: "#eeee00",
                    highlight: "#bbbb00"
                  }
                  break;
                case 'Misc.':
                  obj = {
                    color: "#333333",
                    highlight: "#111111"
                  }
                  break;
              }
              let index = chartData.findIndex(each => each.label === transaction[1])
              if (index !== -1) {
                chartData[index].value += transaction[4].c[0]
              } else {
                chartData.push({
                  value: transaction[4].c[0],
                  label: transaction[1],
                  ...obj
                })
              }
              this.setState(prevState => ({ totalExpense: prevState.totalExpense + transaction[4].c[0] }))
            }
          });
        }
        this.setState({ transactions: arr, subordinates: arrSubordinates, chartData })
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

  addTransaction = (category, description, imageBill, total, status) => {
    let {email} = this.state
    // console.log(this.web3.eth.defaultAccount)
    console.log('masuk submit..')
    if (!imageBill) imageBill = 'http://militan.co.id/wp-content/uploads/2017/08/Screenshot_93.png';
    this.expenseInstance.addTransaction(category, description, imageBill, Number(total), status, email, { from: this.state.account })
      .then((result) => {
        // this.watchEvents()
        console.log('success add new transaction', result)
        this.getTransactions()
      }).catch(function (err) {
        console.error(err);
      });
  }

  castVote(candidateId) {
    this.setState({ voting: true })
    this.expenseInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
    )
  }

  handleForm=(val)=>{
    if(val != 'Choose one') {
      this.getTransactions(val)
      this.setState({choosed: true})
    }
  }

  render() {
    return (
      <div>
        <Header></Header>
        <Navbar></Navbar>
        <main className="container" style={{marginTop: 10}}>
          <div>
            <div className='ui segment'>
              <div className="ui field">
                <label>Select your subordinate </label>
                <select className="ui search dropdown" onChange={(e)=>this.handleForm(e.target.value)}>
                    <option value="Choose one">Choose one</option>
                    {this.state.subordinates.map((el, i)=>{
                      return (
                        <option value={el} key={i}>{el}</option>
                      )
                    })}
                </select>
              </div>
            </div>
            {/* React-Chart JS */}
            {
              this.state.choosed && 
              <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', padding: 10}}>
              <Pie data={this.state.chartData} width="600" height="250" />
              <h3>Category</h3>
              {this.state.chartData.map(each => (
                <ul>
                  <li style={{color: each.color}}>{each.label} <span style={{backgroundColor: each.color, color: 'white', padding: 5, borderRadius: 10}}>{(each.value / this.state.totalExpense * 100).toFixed(2)}%</span> </li>
                </ul>
              ))}
              </div>
            }
            <TableTrx
              account={this.state.account}
              transactions={this.state.transactions}
              hasVoted={this.state.hasVoted}
              castVote={this.castVote}
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