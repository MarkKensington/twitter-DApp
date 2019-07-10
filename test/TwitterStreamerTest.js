const ERC20Token = artifacts.require("TwitterStreamer")

contract("Twitter Streamer Tests", async (accounts) => {

    it("Basic ERC20 Properties (symbol, name, decimals)", async () => {
        let instance = await ERC20Token.new();

        let symbol = await instance.symbol();
        assert.equal(symbol, "TST2");

        let name = await instance.name();
        assert.equal(name, "Twitter Streamer Token 2");

        let decimals = await instance.decimals();
        assert.equal(decimals, 0);
    })

    it("Does not accept ETH", async () => {
        let instance = await ERC20Token.new();

        let bob = accounts[1];

        try {
            await instance.sendTransaction({from: bob, value: 1000000000000000000});
            assert.fail("Contract does not accept Ether. Transaction should fail!");
        } catch (err) {
            assert(err.toString().includes("Default method not allowed"), "Message: " + err);
        }
    })

    it("Initial totalSupply", async () => {
        let instance = await ERC20Token.new();
 
        let totalSupply = await instance.totalSupply();
        assert.equal(totalSupply.valueOf(), 10000);
    })

    it("Initial balance and balanceOf", async () => {
        let instance = await ERC20Token.new();
        let contractCreator = accounts[0];
        let bob = accounts[1];

        let balance = await instance.balanceOf(contractCreator);
        assert.equal(balance.valueOf(), 10000);
    
        balance = await instance.balanceOf(bob);
        assert.equal(balance.valueOf(), 0); 
    })

    it("Simple transfer", async () => {
        let instance = await ERC20Token.new();
        let alice = accounts[0];
        let bob = accounts[1];

        let result = await instance.transfer(bob, 100);
        assert.equal(result.logs[0].event, "Transfer");

        let balance = await instance.balanceOf(alice);
        assert.equal(balance.valueOf(), 9900);
    
        balance = await instance.balanceOf(bob);
        assert.equal(balance.valueOf(), 100); 
    })

    it("Transfer with no tokens should fail", async () => {
        let instance = await ERC20Token.new();
        let alice = accounts[0];
        let bob = accounts[1];

        try {
            await instance.transfer(alice, 100, {from: bob});
            assert.fail("Bob has no tokens. Transfer should fail!");
        } catch (err) {
            assert(err.toString().includes("SafeMath: subtraction overflow"), "Message: " + err);
        }
    })

    it("Mint - Allowed from Contract Creator", async () => {
        let instance = await ERC20Token.new();
        let contractCreator = accounts[0];

        let result = await instance.mint(contractCreator, 1000);
        assert.equal(result.logs[0].event, "Transfer");

        let balance = await instance.balanceOf(contractCreator);
        assert.equal(balance.valueOf(), 11000);

        let totalSupply = await instance.totalSupply();
        assert.equal(totalSupply.valueOf(), 11000);
    })

    it("Mint - Disallowed from non-Minter", async () => {
        let instance = await ERC20Token.new();
        let contractCreator = accounts[0];
        let bob = accounts[1];

        try {
            await instance.mint(contractCreator, 1000, {from: bob});
            assert.fail("Bob is not a Minter. Mint should fail!")
        } catch (err) {
            assert(err.toString().includes("MinterRole: caller does not have the Minter role"), "Message:" + err);
        }
    })

    it("Mint - Re-allowed from added Minter", async () => {
        let instance = await ERC20Token.new();
        let contractCreator = accounts[0];
        let bob = accounts[1];

        let result1 = await instance.addMinter(bob);
        assert.equal(result1.logs[0].event, "MinterAdded");

        let result2 = await instance.mint(contractCreator, 1000, {from: bob});
        assert.equal(result2.logs[0].event, "Transfer");

        let balance = await instance.balanceOf(contractCreator);
        assert.equal(balance.valueOf(), 11000);

        let totalSupply = await instance.totalSupply();
        assert.equal(totalSupply.valueOf(), 11000);
    })
 
    it("Minter Role - Assigment allowed from Contract Creator", async () => {
        let instance = await ERC20Token.new();
        let bob = accounts[1];

        let result1 = await instance.isMinter(bob);
        assert.equal(result1.valueOf(), false);

        let result2 = await instance.addMinter(bob);
        assert.equal(result2.logs[0].event, "MinterAdded");

        let result3 = await instance.isMinter(bob);
        assert.equal(result3.valueOf(), true);
    })

    it("Minter Role - Assigment disallowed from Non-Minter", async () => {
        let instance = await ERC20Token.new();
        let bob = accounts[1];

        let result1 = await instance.isMinter(bob);
        assert.equal(result1.valueOf(), false);

        try {
            await instance.addMinter(bob, {from: bob});
            assert.fail("Bob is not a Minter. Mint should fail!")
        } catch (err) {
            assert(err.toString().includes("MinterRole: caller does not have the Minter role"), "Message:" + err);
        }

        let result2 = await instance.isMinter(bob);
        assert.equal(result2.valueOf(), false);
    })

    it("Initial tweetValue", async () => {
        let instance = await ERC20Token.new();
 
        let tweetValue = await instance.tweetValue();
        assert.equal(tweetValue, 10);
    })

    it("Set Tweet Value - Allowed from Contract Creator", async () => {
        let instance = await ERC20Token.new();

        let result = await instance.setTweetValue(20);
        assert.equal(result.logs[0].event, "TweetValueSet");

        let tweetValue = await instance.tweetValue();
        assert.equal(tweetValue, 20);
    })

    it("Set Tweet Value - Disallowed from Non-Contract Creator", async () => {
        let instance = await ERC20Token.new();
        let bob = accounts[1];

        try {
            await instance.setTweetValue(20, {from: bob});
            assert.fail("Bob is not the owner. Changing the tweetValue should fail!")
        } catch (err) {
            assert(err.toString().includes("Ownable: caller is not the owner"), "Message:" + err);
        }
        let tweetValue = await instance.tweetValue();
        assert.equal(tweetValue, 10);
    })

    it("Transfer Tokens using tweetToken()", async () => {
        let instance = await ERC20Token.new();
        let contractCreator = accounts[0];
        let bob = accounts[1];

        let result = await instance.tweetToken(bob);
        assert.equal(result.logs[0].event, "Transfer");

        let balance = await instance.balanceOf(contractCreator);
        assert.equal(balance.valueOf(), 9990);
    
        balance = await instance.balanceOf(bob);
        assert.equal(balance.valueOf(), 10); 
    })

    it("tweetToken() should fail if Contract Creator balance expires", async () => {
        let instance = await ERC20Token.new();
        let bob = accounts[1];

        let result = await instance.transfer(bob, 10000);
        assert.equal(result.logs[0].event, "Transfer");

        try {
            await instance.tweetToken(bob);
            assert.fail("Contract Creator Token balance is 0. Sending tweetTokens should fail!")
        } catch (err) {
            assert(err.toString().includes("Need to mint more tokens"), "Message:" + err);
        }
    })

})