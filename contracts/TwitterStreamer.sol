pragma solidity ^0.5.0;

/**
 * @title The TwitterStreamerToken2 Contract
 *
 * @dev The TST2 Token is an ERC20 Token
 * @dev https://github.com/ethereum/EIPs/issues/20
 * 
 * NOTE: This has now been updated to use the OpenZeppelin Libraries: https://openzeppelin.org/
 * 
 */

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TwitterStreamer is ERC20, ERC20Detailed, ERC20Mintable, Ownable {

    string private tokSymbol = "TST2"; 
    string private tokName = "Twitter Streamer Token 2";
    uint8 private tokDecimals = 0;
    uint256 private tokInitialSupply = 10000;
    uint256 public tweetValue = 10;  // Number of tokens sent per tweet

    constructor()
        ERC20Detailed (tokName, tokSymbol, tokDecimals)
    public {
        _mint(msg.sender, tokInitialSupply);
    }

    /**
     * @dev This contract does not accept ETH
     */
    function() external payable {
        revert("Default method not allowed");
    }

    function setTweetValue(uint256 newValue) public onlyOwner returns (bool) {
        tweetValue = newValue;
        return true;
    }

    function tweetToken(address recipient) public onlyOwner returns (bool) {
        require (balanceOf(msg.sender) > 0, "Need to mint more tokens");
        _transfer(msg.sender, recipient, tweetValue);
        return true;
    }

}
