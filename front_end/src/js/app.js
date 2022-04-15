
App = {
  web3: null,
  contracts: {},
  address: '0x84437129672044cE66Fd8A04ca47fB2D6fED0A60', //contract
  network_id: 3, // 5777 for local
  handler: null,
  value: 1000000000000000000,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {
   //localStorage.clear();
    console.log(localStorage);

    for (const [key, value] of Object.entries(localStorage)) {
      console.log(key, value);
      
      game_name = key;
      game_url = value;

      var game_button = document.createElement("button");
      game_button.setAttribute("id", game_name);
      game_button.setAttribute("class", "button");
      game_button.textContent = game_name;
      game_button.setAttribute("onclick", "window.location.href = '" + game_url + "';");


      var container = document.getElementById("games");
      container.appendChild(game_button);

   }
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.request({ method: 'eth_requestAccounts' });
    return App.initContract();
  },

  initContract: function () {
    App.contracts.LuckyBlue = new App.web3.eth.Contract(App.abi, App.address, {});
    return App.bindEvents();
  },

  bindEvents: function () {

    $(document).on('click', '#register_vendor', function () {
      App.handleRegisterVendor();
    });

    $(document).on('click', '#deregister_vendor', function () {
      App.handleDeregisterVendor();
    });

    $(document).on('click', '#register_player', function () {
      App.handleRegisterPlayer();
    });

    $(document).on('click', '#deregister_player', function () {
      App.handleDeregisterPlayer();
    });

    // $(document).on('click', '#registerPlayerInfo', function () {
    //   App.registerPlayerInfo();
    // });

    $(document).on('click', '#add_game', function () {
      App.addGame();
    });

    $(document).on('click', '#add_game_submit', function () {
      App.addGameInfo();
    });


    $(document).on('click', '#extract', function () {
      App.Extract();
    });

    $(document).on('click', '#extract_submit', function () {
      App.ExtractInfo();
    });
  },

  populateAddress: function () {
    App.handler = App.web3.givenProvider.selectedAddress;
  },

  handleRegisterVendor: function () {
    console.log("handleRegisterVendor called");
    var option = { from: App.handler }
    console.log(option);
    App.contracts.LuckyBlue.methods.RegisterVendor()
      .send({
        from: ethereum.selectedAddress
        , value: 2000000000000000000
      })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          toastr.success("Vendor registered");
        }
      })

  },

  handleDeregisterVendor: function () {
    console.log("handle deregisterVendor called");
    App.contracts.LuckyBlue.methods.DeregisterVendor()
      .send({
        from: ethereum.selectedAddress
      })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          toastr.success("Vendor Deregistered");
        }
      })

  },


  // registerPlayer: function () {
  //   console.log("Register Player");
  //   document.getElementById("player_popup").style.display = "block";
  // },

  // registerPlayerInfo: function () {
  //   console.log("Register Player Info Called");
  //   var register_player_fee = document.getElementById("player_fee").value;
  //   console.log("player fee: ", register_player_fee);
  //   console.log("eth player fee: ", ((register_player_fee) * Math.pow(10, 18)));
  //   document.getElementById("player_popup").style.display = "none";
  //   var option = { from: App.handler }
  //   App.contracts.LuckyBlue.methods.RegisterPlayer()
  //     .send({
  //       from: ethereum.selectedAddress
  //       , value: register_player_fee * Math.pow(10, 18)
  //     })
  //     .on('receipt', (receipt) => {
  //       if (receipt.status) {
  //         toastr.success("Player registered");
  //       }
  //     })
  // },


  handleRegisterPlayer: function () {
    console.log("handle register player Called");
    App.contracts.LuckyBlue.methods.RegisterPlayer()
      .send({
        from: ethereum.selectedAddress
        , value: 2000000000000000000
      })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          toastr.success("Player registered");
        }
      })
  },


  handleDeregisterPlayer: function (){
    console.log("handle deregisterPlayer called");
    App.contracts.LuckyBlue.methods.DeregisterPlayer()
      .send({
        from: ethereum.selectedAddress
      })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          toastr.success("Player Deregistered");
        }
      })
  },



  addGame: function () {
    console.log("Add game clicked");
    document.getElementById("add_game_popup").style.display = "block";
  },

  addGameInfo: function () {
    game_name = document.getElementById("game_name").value;
    game_url = document.getElementById("game_url").value;

    var game_button = document.createElement("button");
    game_button.setAttribute("id", game_name);
    game_button.setAttribute("class", "button");
    game_button.textContent = game_name;
    game_button.setAttribute("onclick", "window.location.href = '" + game_url + "';");


    var container = document.getElementById("games");
    container.appendChild(game_button);
    document.getElementById("add_game_popup").style.display = "none";

    var option = { from: App.handler }
    App.contracts.LuckyBlue.methods.AddGame()
      .send({
        from: ethereum.selectedAddress,
        value: 1000000000000000000
      })
      .on('receipt', (receipt) => {
        if (receipt.status) {
          toastr.success("Vendor registered");
        }
      })

      localStorage.setItem(game_name, game_url);
      console.log(localStorage);

    //   for (const [key, value] of Object.entries(localStorage)) {
    //     console.log(key, value);
        
    //     game_name = key;
    //     game_url = value;

    //     var game_button = document.createElement("button");
    //     game_button.setAttribute("id", game_name);
    //     game_button.setAttribute("class", "button");
    //     game_button.textContent = game_name;
    //     game_button.setAttribute("onclick", "window.location.href = '" + game_url + "';");


    //     var container = document.getElementById("games");
    //     container.appendChild(game_button);

    //  }
  },

  Extract: function () {
    console.log("Extract called");
    document.getElementById("extract_popup").style.display = "block";

  },

  ExtractInfo: function(){
    console.log("Extract Info called");

    var extract_amount = document.getElementById("extract_amount").value;
    console.log("extract amount: ", extract_amount);
    console.log("eth extract amount: ", ((extract_amount) * Math.pow(10, 18)));
    document.getElementById("extract_popup").style.display = "none";

    App.contracts.LuckyBlue.methods.extractValue()
    .send({
      from: ethereum.selectedAddress,
      value: ((extract_amount) * Math.pow(10, 18))
    })
    .on('receipt', (receipt) => {
      if (receipt.status) {
        toastr.success("Extract Succesful");
      }
    })


  },

  abi: [
    {
      "inputs": [],
      "name": "AddGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DeregisterPlayer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DeregisterVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "extractValue",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vendorCut",
          "type": "uint256"
        }
      ],
      "name": "PayVendors",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RegisterPlayer",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RegisterVendor",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [],
      "name": "cedric",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "CheckPlayer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "vendor",
          "type": "address"
        }
      ],
      "name": "CheckVendor",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ContractValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "jack",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "players",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vendors",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "vendorAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numVendorGames",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

}

$(function () {

  $(window).load(function () {
    App.init();
  });

});


