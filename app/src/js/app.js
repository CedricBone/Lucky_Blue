
App = {
  web3: null,
  contracts: {},
  address: '0xBd7d53DE43D68f0D0Ebb1cE66D765ab679298716', //contract
  address2: '0xF8C48B742783BF4e9CC030F92e8b58b9B88AF3b0',
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
    App.contracts.BlueCoin = new App.web3.eth.Contract(App.abi2, App.address2, {});

    //document.getElementById("display_available_balance").value = App.contracts.BlueCoin.methods;
    return App.bindEvents();
  },

  bindEvents: function () {

    $(document).on('click', '#available_balance' ,function () {
      App.show_balance();
    });


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

    $(document).on('click', '#exchange_coin', function () {
      App.Exchange();
    });


    $(document).on('click', '#exchange_submit', function () {
      App.handleExchange();
    });

    // $(document).on('click', '#Buy', function () {
    //   App.handleBuy();
    // });

    // $(document).on('click', '#Sell', function () {
    //   App.handleSell();
    // });
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
        , value: 500000000000000000
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


  handleDeregisterPlayer: function () {
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
  },

  Extract: function () {
    console.log("Extract called");
    document.getElementById("extract_popup").style.display = "block";

  },

  ExtractInfo: function () {
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

  
  Exchange: function () {
    console.log("exchange called");
    document.getElementById("exchange_popup").style.display = "block";
   // var deploy_address = '0x36eB2Ac8E9E8e558091d7A3Feb182CD117d61744';
   // console.log(ethereum.selectedAddress);

  },


  handleExchange: function(){
    document.getElementById("exchange_popup").style.display = "none";
    var send_address = document.getElementById("send_address").value;
    console.log(send_address);
    var send_amount = (document.getElementById("send_amount").value) * 100;
    console.log(send_amount);

    var send_from_address = '0x4df5fB0A8E73d68867Edc414C837362Ea64385A3'; //coin deployer address

    var jack_address = '0xf667Eb467304D505B9fD484Aa622B9213c1B8920';

    console.log(ethereum.selectedAddress);



    App.contracts.BlueCoin.methods.transfer(send_address, send_amount)
    .send({
      from: ethereum.selectedAddress,
    })
    .on('receipt', (receipt) => {
      if (receipt.status) {
        toastr.success("Exchange Succesful");
      }
    })

  //   App.contracts.BlueCoin.methods.approve(send_address, send_amount)
  //   .send({
  //     from: ethereum.selectedAddress,
  //   })
  //   .on('receipt', (receipt) => {
  //     if (receipt.status) {
  //       toastr.success("Exchange Succesful");
  //     }
  //   })

  //  App.contracts.BlueCoin.methods.transferFrom(send_from_address, send_address, send_amount)
  //   .send({
  //     from: ethereum.selectedAddress,
  //   })
  //   .on('receipt', (receipt) => {
  //     if (receipt.status) {
  //       toastr.success("Exchange Succesful");
  //     }
  //   })



    //call exchange_eth??
    // App.contracts.LuckyBlue.methods.exchange_eth(jack_address, send_amount)
    // .send({
    //   from: ethereum.selectedAddress,
    // })
    // .on('receipt', (receipt) => {
    //   if (receipt.status) {
    //     toastr.success("Exchange Succesful");
    //   }
    // })


  },


  show_balance: function () {
    console.log("show balance called");

    App.contracts.BlueCoin.methods.balanceOf(ethereum.selectedAddress).call().then(function(p){
      console.log(p);
      document.getElementById("balance").innerHTML = (p/100) + " BLU";
  });
},

//   handleBuy: function () {
//     console.log("Handle Buy called");

//     App.contracts.LuckyBlue.methods.buy()
//     .send({
//       from: ethereum.selectedAddress,
//     })
//     .on('receipt', (receipt) => {
//       if (receipt.status) {
//         toastr.success("Buy Succesful");
//       }
//     })

// },



//   handleSell: function () {
//     console.log("handle sell called");

//     App.contracts.LuckyBlue.methods.sell()
//     .send({
//       from: ethereum.selectedAddress,
//     })
//     .on('receipt', (receipt) => {
//       if (receipt.status) {
//         toastr.success("Sell Succesful");
//       }
//     })
  


//   },

  // abi: [
  //   {
  //     "inputs": [],
  //     "name": "AddGame",
  //     "outputs": [],
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "DeregisterPlayer",
  //     "outputs": [],
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "DeregisterVendor",
  //     "outputs": [],
  //     "stateMutability": "nonpayable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "extractValue",
  //     "outputs": [],
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "vendorCut",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "PayVendors",
  //     "outputs": [],
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "RegisterPlayer",
  //     "outputs": [],
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "RegisterVendor",
  //     "outputs": [],
  //     "stateMutability": "payable",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "stateMutability": "payable",
  //     "type": "constructor"
  //   },
  //   {
  //     "stateMutability": "payable",
  //     "type": "fallback"
  //   },
  //   {
  //     "stateMutability": "payable",
  //     "type": "receive"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "cedric",
  //     "outputs": [
  //       {
  //         "internalType": "address",
  //         "name": "",
  //         "type": "address"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "address payable",
  //         "name": "player",
  //         "type": "address"
  //       }
  //     ],
  //     "name": "CheckPlayer",
  //     "outputs": [
  //       {
  //         "internalType": "bool",
  //         "name": "",
  //         "type": "bool"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "address payable",
  //         "name": "vendor",
  //         "type": "address"
  //       }
  //     ],
  //     "name": "CheckVendor",
  //     "outputs": [
  //       {
  //         "internalType": "bool",
  //         "name": "",
  //         "type": "bool"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "ContractValue",
  //     "outputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "getBalance",
  //     "outputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [],
  //     "name": "jack",
  //     "outputs": [
  //       {
  //         "internalType": "address",
  //         "name": "",
  //         "type": "address"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "players",
  //     "outputs": [
  //       {
  //         "internalType": "address",
  //         "name": "",
  //         "type": "address"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   },
  //   {
  //     "inputs": [
  //       {
  //         "internalType": "uint256",
  //         "name": "",
  //         "type": "uint256"
  //       }
  //     ],
  //     "name": "vendors",
  //     "outputs": [
  //       {
  //         "internalType": "address payable",
  //         "name": "vendorAddress",
  //         "type": "address"
  //       },
  //       {
  //         "internalType": "uint256",
  //         "name": "numVendorGames",
  //         "type": "uint256"
  //       }
  //     ],
  //     "stateMutability": "view",
  //     "type": "function"
  //   }
  // ],

  abi2: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "total",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "close",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "numTokens",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        }
      ],
      "name": "allowance",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],


   abi: [
    
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "tokenOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "delegate",
            "type": "address"
          }
        ],
        "name": "allowance",
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
        "inputs": [
          {
            "internalType": "address",
            "name": "delegate",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenOwner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
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
        "name": "close",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
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
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    
   ]


  
}

$(function () {

  $(window).load(function () {
    App.init();
  });

});


