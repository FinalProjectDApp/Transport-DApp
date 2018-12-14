import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navbar from '../../components/navbar'
import FormInput from '../../components/formInput'
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
      transactions: [],
      hasVoted: false,
      loading: true,
      voting: false,
      email: ''
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
          this.expenseInstance.transactions(i).then(function (transaction) {
            let owner = transaction[6]
            console.log('trx:', transaction, ' cek user--:', user, '===', owner, user === owner)
            if (user === owner) {
              arr.push(transaction)
            }
          });
        }
        this.setState({ transactions: arr })
      }).catch(err => {
        console.log(err)
      })
    })
    
  }

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.expenseInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  addTransaction = (category, description, imageBill, total, status) => {
    // this.web3.eth.defaultAccount=this.web3.eth.accounts[0]
    // console.log(this.web3.eth.defaultAccount)
    console.log('masuk submit..')
    if (!imageBill) imageBill = 'http://militan.co.id/wp-content/uploads/2017/08/Screenshot_93.png';
    this.expenseInstance.addTransaction(category, description, imageBill, Number(total), status, { from: this.state.account })
      .then((result) => {
        // this.watchEvents()
        console.log('success add new transaction', result)
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

  render() {
    return (
      <div>
        <Header></Header>
        <Navbar></Navbar>
        <main className="container">
          <div>
            <div className="ui centered card" >
              <div class="content">
                <div class="header">Groups</div>
              </div>
              <div class="content">
              </div>
              <div class="extra content">
                <button class="ui button">Create Group</button>
              </div>
            </div>
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
            ></TableTrx>
          </div>
          {/* =============================================================================================================== */}
          {/* <div className="pure-g">
          <div className="pure-u-1-1 header">
            <img src={logo} alt="drizzle-logo" />
            <h1>Drizzle Examples</h1>
            <p>Examples of how to get started with Drizzle in various situations.</p>

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>Active Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>SimpleStorage</h2>
            <p>This shows a simple ContractData component with no arguments, along with a form to set its value.</p>
            <p><strong>Stored Value</strong>: <ContractData contract="SimpleStorage" method="storedData" /></p>
            <ContractForm contract="SimpleStorage" method="set" />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>TutorialToken</h2>
            <p>Here we have a form with custom, friendly labels. Also note the token symbol will not display a loading indicator. We've suppressed it with the <code>hideIndicator</code> prop because we know this variable is constant.</p>
            <p><strong>Total Supply</strong>: <ContractData contract="TutorialToken" method="totalSupply" methodArgs={[{from: this.props.accounts[0]}]} /> <ContractData contract="TutorialToken" method="symbol" hideIndicator /></p>
            <p><strong>My Balance</strong>: <ContractData contract="TutorialToken" method="balanceOf" methodArgs={[this.props.accounts[0]]} /></p>
            <h3>Send Tokens</h3>
            <ContractForm contract="TutorialToken" method="transfer" labels={['To Address', 'Amount to Send']} />

            <br/><br/>
          </div>

          <div className="pure-u-1-1">
            <h2>ComplexStorage</h2>
            <p>Finally this contract shows data types with additional considerations. Note in the code the strings below are converted from bytes to UTF-8 strings and the device data struct is iterated as a list.</p>
            <p><strong>String 1</strong>: <ContractData contract="ComplexStorage" method="string1" toUtf8 /></p>
            <p><strong>String 2</strong>: <ContractData contract="ComplexStorage" method="string2" toUtf8 /></p>
            <strong>Single Device Data</strong>: <ContractData contract="ComplexStorage" method="singleDD" />

            <br/><br/>
          </div>
        </div> */}
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