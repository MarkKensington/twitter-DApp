# Twitter Ethereum DApp


## TODO NEED TO RUN AN NPM UPDATE TO UPDATE VARIOUS PACKAGES, INCLUDING decompress, handlebars, tree-kill, http-proxy & tar, and fix changes in requirements.txt - See Github Alerts

## Status
Working

## Overview

This project is a very basic Ethereum DApp, which listen for Tweets which contains a specific hashtag (**#giveMeTST2Token**) - "give me twitter streaming token 2". If such a Tweet appears, the application sends TST2 tokens from the ERC20 Smart Contract Owners address to a specific address. This code was initially written during the Swisscom Blockchain Academy Seminar "Ethereum for Developer", May 2019.

## Updates
- **4 July 2019**: Is now working on Rinkeby and has been updated so that if the recipient includes their Ethereum address in the tweet then the DApp will send the tokens to that address
- **9 July 2019**: Complete re-write of TwitterStreamer Smart Contract to use OpenZeppelin Libraries, including Minter Roles and Owner-controlled Token issuance and to just transfer tokens rather than mint each time
- **10 July 2019**: Added tests (coverage confirmed all functions are covered) and updated contract as required

**The code now runs on a local testnet, on the Swisscom Blockchain Academy POA Network & on Rinkeby** 

## Requirements

Following tools are required:

- Twitter Developer Account (You need a access token for the Twitter API)
- Truffle
- Homebrew (Mac packaging manager)
- NPM
- Python with various libraries
- If you want to deploy via Rinkeby then you need access to a Rinkeby Node, such as via Infura

## Project structure

The project structure is a *Truffle* and *NPM* project. With NPM we can add additional libraries if required and also manage all tools. With Truffle we have the testing framework.

```bash
twitter-DApp   
    ├── build   
    │   └── contracts                  # JSON builds from Ethereum smart contracts   
    ├── contracts                      # Contains all the Ethereum Smart Contracts   
    ├── migrartions                    # Contains scripts for Smart Contracts deployment for Truffle   
    ├── node_modules                   # npm packages   
    ├── contractJSONABI.json           # application binary interface (ABI), needed for for encoding/decoding data into/out of the machine code [Reference](https://ethereum.stackexchange.com/questions/234/what-is-an-abi-and-why-is-it-needed-to-interact-with-contracts)  
    ├── package-lock.json              # Describe a single npm representation of a dependency packages    
    ├── package.json                   # npm installtion packages is called by `npm install`
    ├── requirements.txt               # packages list for Python  (installed via pip)     
    ├── truffle-config.js              # Configuration file which setting up a single development network [Doc](https://www.trufflesuite.com/docs/truffle/reference/configuration)   
    ├── twitter_credentials_TODO.py    # Twitter API credentials file (have to be modified)   
    ├── twitter_streamer.py            # file which listens for Tweets and sends tokens on Ganache local Network
    ├── twitter_streamer_SBA.py        # file which listens for Tweets and sends tokens on Swisscom POA Network
    ├── twitter_streamer_Rinkeby.py    # file which listens for Tweets and sends tokens on Rinkeby Test Network
```

## Step-by-Step installation guide for Mac

One of the easiest way is to use [Homebrew](https://brew.sh/index_de) for installation of Python3, NPM etc. Run this in your Terminal if you need to install Homebrew:   
```/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"```

1. change `twitter_credentials_TODO.py` to `twitter_credentials.py` and fill in your own keys from the twitter developer account
2. Install **npm** (for mac: `brew install node`). Check if installation was successfull with: `npm -v`. If you already have **npm** [Update NPM](https://docs.npmjs.com/updating-packages-downloaded-from-the-registry) `npm update` or `npm update --save`
3. [Download and install Ganache](https://www.trufflesuite.com/docs/ganache/quickstart) or `npm install -g ganache-cli`   
4. Install **Truffle**: `npm install -g truffle`
5. [OPTIONAL] Install xcode developer tools separatly. If you have ```homebrew```installed on your mac, ```xcode command line tools``` are already installed. `xcode-select --install` maybe you need additional configs according to [Doc](https://apple.stackexchange.com/questions/254380/why-am-i-getting-an-invalid-active-developer-path-when-attempting-to-use-git-a) and [Doc](http://osxdaily.com/2014/02/12/install-command-line-tools-mac-os-x/)
5. Install **virtualvenv** for isolated Python environments:```pip3 install virtualenv```   
6. Create isolated Python environment: first ```cd``` into project, second```virtualenv venv```
7. Activate virtual environment: ```source venv/bin/activate```   
8. Install dependencies: ```pip3 install -r requirements.txt``` 

If you have made additional installations with `pip3` run `pip3 freeze > requirements.txt` to rebuild requirements file for installtion dependencies.

To stop the isolated `(venv)`environment use command: `deactivate`

## Step-by-Step installation guide for PC running Lubuntu

1.  Git Clone the twitter-DApp repository into a local directory
2.  Install required **npm** modules using `npm install`
3.  [Download and install Ganache](https://www.trufflesuite.com/docs/ganache/quickstart) or `npm install -g ganache-cli`   
4.  Install **Truffle**: `npm install -g truffle`
5.  Install **pip**: `sudo apt install python-pip3`
6.  Install **virtualvenv** for isolated Python environments:`pip3 install virtualenv`   
7.  Create isolated Python environment: `virtualenv venv`
8.  Activate virtual environment: `source venv/bin/activate`
9.  Install **pandoc**: `sudo apt install pandoc`
10. Install dependencies: `pip3 install -r requirements.txt`. If you have made additional installations with `pip3` run `pip3 freeze > requirements.txt` to rebuild requirements file for installtion dependencies.
11. Copy `twitter_credentials_TODO.py` to `twitter_credentials.py` and fill in your own keys from the twitter developer account

To stop the isolated `(venv)`environment use command: `deactivate`

## Run the code on Ganache

1. Open command line tool (e.g Terminal for Mac)
2. `cd` into project folder
3. Start local testnet: `ganache -cli` (include `-m "mnemonic"` which can then be used to set-up MetaMask to allow interaction directly with Ganache)
4. Open a new Terminal tab and `cd` into project folder and deploy Smart Contract on the local testnet: `truffle deploy`
   [OPTIONAL] Retrieve the addresses from deployed contracts if needed with: `truffle networks`
5. Change the `contract_address` in method `on_data(self, raw_data)`from `twitter_streamer.py` with address provided after `truffle deploy` of the Smart Contract
6. If you want to hard-code the receiver address rather than extract it from the tweet you will need to change the `receiver_address` in method `on_data(self, raw_data)`from `twitter_streamer.py` with your own (Metamask) address and then comment out the second `receiver_address` assignment in the `try:` section
7. Start `twitter_streamer.py`in a new Terminal with: `python3 twitter_streamer.py`
8. Post a Tweet on Twitter with hashtag: `#giveMeTST2Token <yourAddress>`

## Troubleshooting

- Make sure you have started `ganache-cli` (maybe with with the right Mnemonic)
- Make sure you initialized MetaMask with the exactly the same Mnemonic like from `ganahce-cli`


## Run the code on Swisscom Blockchain Academy POA Network

NOTE: This requires you have already had a node running on your local PC
1. Open command line terminal to the Swisscom POA Node directory and start the Node using `geth --datadir ./ --rpc --rpcaddr "0.0.0.0" --rpcapi "admin,eth,net,personal,web3,debug"`
2. Open another terminal to the Swisscom POA Node, run `geth attach --datadir ./` and then use `admin.addPeer("enode://<address>")` with the correct `address` to connect. Once it has synched check connectivity with MetaMask
3. Unlock the main node account using `personal.unlockAccount(eth.accounts[0])`
4. Open a new terminal and `cd` into the twitter-DApp project folder and deploy the Smart Contract on the Swisscom Blockchain using: `truffle deploy`
5. Change the `contract_address` in method `on_data(self, raw_data)`from `twitter_streamer_SBA.py` with address provided after `truffle deploy` of the Smart Contract
6. If you want to hard-code the receiver address rather than extract it from the tweet you will need to change the `receiver_address` in method `on_data(self, raw_data)`from `twitter_streamer.py` with your own (Metamask) address and then comment out the second `receiver_address` assignment in the `try:` section
7. If necessary, change the `Web3(IPCProvider)` path in method `on_data(self, raw_data)`from `~/poa/geth.ipc` to the path of your running POA Node
8. Start `twitter_streamer_SBA.py`in a new Terminal with: `python3 twitter_streamer_SBA.py`
9. Post a Tweet on Twitter with hashtag: `#giveMeTST2Token <yourAddress>`. BE AWARE you may need to unlock the local account again...

## Run the code on Rinkeby

1. Ensure you have an account on the Rinkeby Test Network loaded with some Ether. You will also need to connect to a Rinkeby Node. This DApp has been set-up using an Infura Rinkeby Node which requires a Project ID Code (see: https://infura.io/)
2. Update `truffle-config.js` to add in the private key from your Rinkeby Account and the Project Code for Infura
3. Open a new terminal and `cd` into the twitter-DApp project folder and deploy the Smart Contract on to the Rinkeby Test Network using: `truffle deploy --network rinkeby`
4. Change the `contract_address` in method `on_data(self, raw_data)`from `twitter_streamer_Rinkeby.py` with address provided after `truffle deploy` of the Smart Contract
5. Change the `sender_address` in method `on_data(self, raw_data)`from `twitter_streamer_Rinkeby.py` with address used to deploy the Smart Contract and also update the `sender_private_key`
6. If you want to hard-code the receiver address rather than extract it from the tweet you will need to change the `receiver_address` in method `on_data(self, raw_data)`from `twitter_streamer.py` with your own (Metamask) address and then comment out the second `receiver_address` assignment in the `try:` section
7. Change the `Web3(HTTPProvider)` address in method `on_data(self, raw_data)`to your Node Provider or with your Project Code for Infura
8. Start `twitter_streamer_Rinkeby.py`in a new Terminal with: `python3 twitter_streamer_Rinkeby.py`
9. Post a Tweet on Twitter with hashtag: `#giveMeTST2Token <yourAddress>`


## Future ideas (to do)

- add functionality to set the recipient address in the tweet itself (**Now Implemented**)
- make code running on Rinkeby test net. For that you need to specify the private key manually in the code (**Now Implemented**)
- add some tests (**Now Implemented**)

## Credits

- [0xjacobb](https://github.com/0xjacobb)
- [Swisscom Blockchain Academy for the skeleton](https://github.com/swisscom-blockchain/dapp-skeleton)   
- [Setting Up Ethereum Development Environment on MacOS](https://medium.com/coinmonks/setting-up-ethereum-development-environment-on-macos-22c96a136ac4)   
- [Guide for deploying Smart Contracts with Truffle and Ropsten](https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e)
- [OpenZeppelin libraries for building Smart Contracts](https://openzeppelin.org/)
