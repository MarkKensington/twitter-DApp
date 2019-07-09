from tweepy import API
from tweepy import Cursor
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import re

import twitter_credentials
from web3 import Web3, HTTPProvider
from web3.middleware import geth_poa_middleware

'''
TWITTER AUTHENTICATOR
Handles connection to Twitter API
'''

class TwitterAuthenticator():
    def authenticate_twitter_app(self):
        # Authenticate code
        auth = OAuthHandler(twitter_credentials.CONSUMER_KEY,
                            twitter_credentials.CONSUMER_SECRET)
        # Authenticate application
        auth.set_access_token(twitter_credentials.ACCESS_TOKEN,
                              twitter_credentials.ACCESS_TOKEN_SECRET)
        return auth


'''
TWITTER STREAMER
Class for streaming and processing tweets
'''


class TwitterStreamer():
    def __init__(self):
        self.twitter_authenticator = TwitterAuthenticator()
    '''
    This method handles Twitter authentication and the connection to the twitter Streaming API
    Save tweets to file 'fetched_tweets_filename'
    '''

    def stream_tweets(self, fetched_tweets_filename, hash_tag_list):
        # Create object
        listener = TwitterListener(fetched_tweets_filename)
        auth = self.twitter_authenticator.authenticate_twitter_app()

        # create a data stream
        stream = Stream(auth, listener)

        # Define words for filtering Twitter streams
        stream.filter(track=hash_tag_list)


'''
TWITTER STREAM LISTENER
Class that inherit from StreamListener
Prints received tweets to stdout
'''


class TwitterListener(StreamListener):

    # Constructor
    def __init__(self, fetched_tweets_filename):
        self.fetched_tweets_filename = fetched_tweets_filename
        self.i = 0

    # Method who takes the data (listening to tweets) and interact with Smart Contract
    def on_data(self, raw_data):
        # TwitterStreamer.sol Smart Contract address which was provided during `truffle deploy`
        # contract_address = '0x4B0E6F935F6e8CDa37254D72e8335f3351000C68'  <-- this already exists on Rinkeby
        contract_address = '<FILL IN CONTRACT ADDRESS SHOWN AFTER TRUFFLE DEPLOY>'

        # Address which created the contract and sends the Tokens
        sender_address = '<FILL IN SENDER ADDRESS>'
        sender_private_key = '<FILL IN SENDER PRIVATE KEY>'

        # Address which receives the Token - Only use if you want to hard-code recipient
        # receiver_address = '<FILL IN RECIPIENT ADDRESS>'


        try:
            json_load = json.loads(raw_data)
            text = json_load['text']
            coded = text.encode('utf-8')
            s = str(coded)
            print("########## NEW TWEET: Nr: %i ########## \n" %
                  (self.i), s[2:-1])

            self.i += 1

            # Receiver Address should be included in Tweet. If hard-coded above then comment out next line
            receiver_address = re.search("0x.{40}",s).group()
            print("Receiver Address is: ", receiver_address)

            with open("./contractJSONABI.json") as f:
                info_json = json.load(f)
            abi = info_json
            w3 = Web3(HTTPProvider('https://rinkeby.infura.io/v3/<YOUR-PROJECT-ID>'))
            w3.middleware_stack.inject(geth_poa_middleware, layer=0)
            free_tokkens_instance = w3.eth.contract(
                address=contract_address, abi=abi,)
            
            '''
            set sender account
            '''

            w3.eth.defaultAccount = sender_address

            '''send message to contract.
            '''
            print('Get some Tokens...')
            
            # Prepare the transaction
            nonce = w3.eth.getTransactionCount(sender_address)
            tx = {
                'from': sender_address,
                'chainId': 4,
                'gas': 70000,
                'gasPrice': w3.toWei('1', 'gwei'),
                'nonce': nonce,
            }
            contract_tx = free_tokkens_instance.functions.tweetToken(receiver_address).buildTransaction(tx)

            #Sign the Transaction
            signed_tx = w3.eth.account.signTransaction(contract_tx, private_key = sender_private_key)
            
            # Send the Transaction
            tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)

            # Wait for transaction to be mined...
            w3.eth.waitForTransactionReceipt(tx_hash)

            '''
            Read out the balance of the recipient
            '''
            print('Balance: {}'.format(
                free_tokkens_instance.functions.balanceOf(receiver_address).call()))

            # Save tweets to file for analysis if needed
            with open(self.fetched_tweets_filename, 'a') as tf:
                tf.write(raw_data)
            return True

        except BaseException as e:
            print("Error on raw_data: %s" % str(e))
        return True

    # Method who handles Twitter API errors
    def on_error(self, status_code):
        '''
        420 error from twitter API = hit the rate limit. You have to wait
        a certain time before proceed otherwise Twitter looks the app out
        '''
        if status_code == 420:
            return False
        print(status_code)


if __name__ == "__main__":
    hash_tag_list = ["giveMeTST2Token"]
    fetched_tweets_filename = "tweets.txt"
    twitter_streamer = TwitterStreamer()
    twitter_streamer.stream_tweets(fetched_tweets_filename, hash_tag_list)
