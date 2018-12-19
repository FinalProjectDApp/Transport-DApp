import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from '../../components/navbar'
import { Pie, Bar } from 'react-chartjs-2'
import TableTrx from '../../components/tableTrx'
// import Header from '../../components/header'
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
      transactionsAmount: 0,
      grandTotal: 0,
      hasVoted: false,
      loading: true,
      voting: false,
      choosed: false,
      email: '',
      location: '', // add new ----------------
      chartData: [],
      shouldRedraw: false,
      totalExpense: 0,
      chosenSubordinate: ''
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
    this.setState({ shouldRedraw: true })
    this.getAllTransactions()
    this.setState({ shouldRedraw: false })
  }

  getAllTransactions = () => {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.expense.deployed().then((instance) => {
        this.expenseInstance = instance
        this.watchEvents()

        return this.expenseInstance.totalTransactions()
      }).then(async (totalTransaction) => {
        this.setState({transactionsAmount: totalTransaction.c[0]})
        return { user: await this.expenseInstance.owner(), totalTransaction: totalTransaction }
      }).then(async ({ user, totalTransaction }) => {
        let arr = [];
        let arrSubordinates = [];
        let chartData = {
          labels: [],
          datasets: [
            {
              backgroundColor: [],
              hoverBackgroundColor: "rgba(220, 220, 220, 1)",
              data: []
            }
          ]
        };
        for (let i = 0; i <= totalTransaction; i++) {
          this.expenseInstance.transactions(i).then( (transaction)=> {
            let owner = transaction[6]
            if (!arrSubordinates.includes(owner)) arrSubordinates.push(owner)
            let index = chartData.labels.findIndex(each => each  === owner)
            if (index === -1) {
              chartData.datasets[0].data.push(transaction[4].c[0])
              chartData.labels.push(transaction[6])
              chartData.datasets[0].backgroundColor.push(this.getRandomColor())
            } else  {
              chartData.datasets[0].data[index] += transaction[4].c[0]
            }
            arr.push(transaction)
            console.log(chartData)
          });
        }
        this.setState({ transactions: arr, subordinates: arrSubordinates, chartData })
        this.setState({ shouldRedraw: false })
      }).catch(err => {
        console.log(err)
      })
    })
  }

  getTransactions=(ownerSelected)=>{
    this.setState({ totalExpense: 0 })
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.expense.deployed().then((instance) => {
        this.expenseInstance = instance
        this.watchEvents()

        return this.expenseInstance.totalTransactions()
      }).then(async (totalTransaction) => {
        this.setState({transactionsAmount: totalTransaction.c[0]})
        return { user: await this.expenseInstance.owner(), totalTransaction: totalTransaction }
      }).then(({ user, totalTransaction }) => {
        let arr = [];
        let chartData = {
          labels: [],
          datasets: [
            {
              backgroundColor: [],
              hoverBackgroundColor: [],
              data: []
            }
          ]
        };
        for (let i = 0; i <= totalTransaction; i++) {
          this.expenseInstance.transactions(i).then( async (transaction)=> {
            // let locationStr = await this.expenseInstance.locations(i);
            // console.log('ini location str', locationStr)
            // let location = JSON.parse(locationStr);
            let owner = transaction[6]
            console.log('trx:', transaction, ' cek user--:', user, '===', owner, user === owner)
            if (ownerSelected === owner) {
              this.setState({chosenSubordinate: ownerSelected})
              // transaction.push(location)
              arr.push(transaction)
              let barColor = {};
              switch (transaction[1]) {
                case 'Food & Beverage':
                  barColor = {
                    color: "rgba(247, 70, 74, 0.5)", //red
                    highlight: "rgba(255, 90, 94, 0.8)"
                  }
                  break;
                case 'Transportation':
                  barColor = {
                    color: "rgba(70, 191, 189, 0.5)",//turqois
                    highlight: "rgba(90, 211, 209, 0.8)"
                  }
                  break;
                case 'Accomodation':
                  barColor = {
                    color: "rgba(51, 204, 51, 0.5)",//green
                    highlight: "rgba(46, 184, 46, 0.8)"
                  }
                  break;
                case 'Entertainment':
                  barColor = {
                    color: "rgba(238, 238, 0, 0.5)",//yellow
                    highlight: "rgba(187, 187, 0, 0.8)"
                  }
                  break;
                case 'Misc.':
                  barColor = {
                    color: "rgba(99, 25, 25, 0.5)",//brown
                    highlight: "rgba(66, 16, 16, 0.8)"
                  }
                  break;
                case 'Transaction Adjustment':
                  barColor = {
                    color: "rgba(229, 126, 0, 0.5)",//orange
                    highlight: "rgba(178, 98, 0, 0.8)"
                  }
                  break;
                case 'Unused Budget':
                  barColor = {
                    color: "rgba(51, 51, 51, 0.5)",//grey
                    highlight: "rgba(17, 17, 17, 0.8)"
                  }
                  break;
              }
              let index = chartData.labels.findIndex(each => each  === transaction[1])
              if (index === -1) {
                chartData.datasets[0].data.push(transaction[4].c[0])
                chartData.labels.push(transaction[1])
                chartData.datasets[0].backgroundColor.push(barColor.color)
                chartData.datasets[0].hoverBackgroundColor.push(barColor.highlight)
              } else  {
                chartData.datasets[0].data[index] += transaction[4].c[0]
              }
              this.setState(prevState => ({ totalExpense: prevState.totalExpense + transaction[4].c[0] }))
              console.log(chartData)
            }
        })
      }
      this.setState({ transactions: arr, chartData, shouldRedraw: true })
      this.setState({ shouldRedraw: false })
      }).catch(err => {
        console.log(err)
      })
    })
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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


  setGrandTotal = (arr)=>{
    console.log('jumlah transaksi:', this.state.transactionsAmount)
    let counter=0;
    console.log('masuk set grand total:', arr)
    arr.forEach((el, i)=>{
      console.log('=========', el[4].s, el[4].c[0], 'counter:', counter)
      if(el[4].s == -1) {
        counter -= el[4].c[0]
      } else {
        counter += el[4].c[0]
      }
    })
    console.log('final counter:', counter)
    this.setState({grandTotal: counter})
  }

  handleForm=(val)=>{
    if (val != '') {
      this.getTransactions(val)
    } else {
      this.setState({ chosenSubordinate: '' })
      this.setState({ shouldRedraw: true })
      this.getAllTransactions()
    }
  }

  render() {
    if(this.state.transactions.length>0 && this.state.transactions.length === this.state.transactionsAmount && !this.state.grandTotal) this.setGrandTotal(this.state.transactions)
    let barOption = {legend: { display: false }, maintainAspectRatio: false, scales: { yAxes: [{ ticks: { beginAtZero: true }}]}}
    return (
      <div>
        <Navbar></Navbar>
        <main className="container" style={{marginTop: 10}}>
          <div>
            <div className='ui segment'>
              <div className="ui field">
                <label>Select your subordinate </label>
                <select className="ui search dropdown" onChange={(e)=>this.handleForm(e.target.value)}>
                    <option value="">All</option>
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
              this.state.chosenSubordinate ? 
                // Pie Chart
                <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <h1>Expense Report from {this.state.chosenSubordinate}</h1>
                  <Pie data={this.state.chartData} height={100} redraw={this.state.shouldRedraw} />
                </div> 
                :
                // Bar Chart
                <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', padding: 10}}>
                  <h1>Expense Report</h1>
                  <Bar data={this.state.chartData} options={barOption} redraw={this.state.shouldRedraw} />
                </div>
            }
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