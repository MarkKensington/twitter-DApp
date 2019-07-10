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
    uint256 private tokInitialSupply = 10000;  // Default initial token supply
    uint256 private tokTweetValue = 10;  // Default number of tokens sent per tweet

    uint256 private _tweetValue;
    event TweetValueSet(uint256 tweetValue);

    constructor()
        ERC20Detailed (tokName, tokSymbol, tokDecimals)
    public {
        _mint(msg.sender, tokInitialSupply);
        setTweetValue(tokTweetValue);
    }

    /**
     * @dev This contract does not accept ETH
     */
    function() external payable {
        revert("Default method not allowed");
    }

    /**
     * @dev Returns the current set amount of tokens issued per tweet
     */
    function tweetValue() public view returns (uint256) {
        return _tweetValue;
    }

    /**
     * @dev Sets the amount of tokens issued per tweet
     * Can only be called by the current owner.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `TweetValueSet` event.
     */
    function setTweetValue(uint256 newValue) public onlyOwner returns (bool) {
        _tweetValue = newValue;
        emit TweetValueSet(_tweetValue);
        return true;
    }

    /**
     * @dev Moves `_tweetValue` quantity of tokens from the caller's account to `recipient`.
     * Can only be called by the current owner.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `Transfer` event.
     */
    function tweetToken(address recipient) public onlyOwner returns (bool) {
        require (balanceOf(msg.sender) > 0, "Need to mint more tokens");
        _transfer(msg.sender, recipient, _tweetValue);
        return true;
    }

}
