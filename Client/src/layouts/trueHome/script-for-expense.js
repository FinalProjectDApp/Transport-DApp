// import web3 from './truffle-contract'
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.totalTransactions()
    }).then( async function(totalTransaction) {
      
      return {user: await electionInstance.owner(), totalTransaction: totalTransaction}
    }).then(function({user, totalTransaction}) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
      for (var i = 0; i <= totalTransaction; i++) {
        electionInstance.transactions(i).then(function(candidate) {
          var id = candidate[0];
          var category = candidate[1];
          var description = candidate[2];
          var bill = candidate[3];
          var total = candidate[4];
          var owner = candidate[5]
          console.log('cek user--:', user, '===', owner, user===owner)
  
              // Render candidate Result
              if(user === owner) {
                var candidateTemplate = "<tr><th>" + id + "</th><td>" + category + "</td><td>" + description + "</td><td>" + bill + "</td><td>" + total + "</td></tr>"
                candidatesResults.append(candidateTemplate);
              }
            });
        }
        loader.hide();
        content.show();
    }).catch(err=>{
      console.log(err)
    })
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addTransaction: function() {
    let category = 'Food & Bavarages'
    let description = 'ini deskripsi'
    let imageBill = 'http://militan.co.id/wp-content/uploads/2017/08/Screenshot_93.png'
    let total = $('#totalExpense').val();
    App.contracts.Election.deployed().then(function(instance) {
      // return instance.vote(candidateId, { from: App.account });
      return instance.addTransaction(category, description, imageBill, total)
    }).then(function(result) {
      // Wait for votes to update
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
