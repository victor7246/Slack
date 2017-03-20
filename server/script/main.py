import os
import time
from slackclient import SlackClient
from nltk import word_tokenize
from wordcloud import WordCloud, STOPWORDS
from bs4 import BeautifulSoup
from amazon.api import AmazonAPI
import urllib
import urllib3
import requests
requests.packages.urllib3.disable_warnings()
import warnings
warnings.filterwarnings("ignore")
import re
from text_mining import *
from plot_generation import *
from itemsearch import *
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
import numpy
import seaborn as sns
sns.set_style("whitegrid") 
import matplotlib.pyplot as plt

BOT_ID = 'U486B5E9M'
AMAZON_SECRET_KEY = ''
AMAZON_ACCESS_KEY = ''
AMAZON_ASSOC_TAG = 'asengup6-20'
SLACK_TOKEN = ''

AT_BOT = "<@" + BOT_ID + ">"
EXAMPLE_COMMAND = "buy"

slack_client = SlackClient(SLACK_TOKEN)
amazon = AmazonAPI(AMAZON_ACCESS_KEY,AMAZON_SECRET_KEY,AMAZON_ASSOC_TAG,region="US")

gauth = GoogleAuth()
gauth.LoadCredentialsFile("../mycreds.txt")
drive = GoogleDrive(gauth)

def parse_slack_output(slack_rtm_output):
	output_list = slack_rtm_output
	if output_list and len(output_list) > 0:
		for output in output_list:
			if output and 'text' in output and AT_BOT in output['text']:
				return output['text'].replace(AT_BOT,'').lower(), output['user'], output['channel']
	return None, None, None

if __name__ == "__main__":
	READ_WEBSOCKET_DELAY = 5
	allusers = {}
	if slack_client.rtm_connect():
		print("bot running!")	
		startup_chat = ["I am your shoe assistant. Let me buy you a pair of good looking shoes.", "I will show you shoes based on your specifications. If you like, just tell me to add in your like list","Tell me to show more if you don't like", "If you are willing to buy, just tell me so!"]
		#command, user, channel = parse_slack_output(slack_client.rtm_read())
		for text in startup_chat:
			slack_client.api_call("chat.postMessage", channel=channel,text=text, as_user=False)
		slack_client.api_call("chat.postMessage", channel=channel,text="Tell me something. Any brand or color you like? ", as_user=True)        
		while True:
			command, user, channel = parse_slack_output(slack_client.rtm_read())
			if command and channel and user:
				if user not in allusers.keys():
					new_bot = bot()
					allusers[user] = new_bot(slack_client,amazon,drive)
					allusers[user].handle_command(command, channel)
				else:
					allusers[user].handle_command(command, channel)
			else:
				print("Command failed!")
			time.sleep(READ_WEBSOCKET_DELAY)
	else:
		print("Connection failed")
