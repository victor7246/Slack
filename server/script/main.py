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
AMAZON_SECRET_KEY = '**'
AMAZON_ACCESS_KEY = '**'
AMAZON_ASSOC_TAG = 'asengup6-21'
SLACK_TOKEN = '**'

AT_BOT = "<@" + BOT_ID + ">"
EXAMPLE_COMMAND = "buy"

slack_client = SlackClient(SLACK_TOKEN)
amazon = AmazonAPI(AMAZON_ACCESS_KEY,AMAZON_SECRET_KEY,AMAZON_ASSOC_TAG,region="IN")

like_cart = {}
buy_cart = {}
showed_items = {}
all_items = {}
all_item_index = 1
current_products = {}
current_items = {}
prev_question = None
showed_items = set([])

gauth = GoogleAuth()
gauth.LoadCredentialsFile("../mycreds.txt")
drive = GoogleDrive(gauth)

def amazon_chat(command):
	global like_cart,buy_cart,showed_items,all_items,all_item_index,current_products,current_items,prev_question,showed_items
	response = "Not sure what you mean."
	if buy_signal(command):
		if len(buy_cart) == 0:
			if len(like_cart) == 0:
				text = get_search_text(command)
				print text
				products = amazon.search_n(3,Keywords=text, SearchIndex='All')
			else:
				items = ",".join([i.asin for i in like_cart])
				products = amazon.similarity_lookup(ItemId=items)
				products = products[0:min(3,len(products))]
			for i in products:
				response = "None to show."
				if i not in showed_items and i.large_image_url is not None:
					showed_items.add(i)
					current_products['item'+str(len(showed_items))] = i
					
			if len(current_products) > 0:
				response = "Here are some items based on your search."
				slack_client.api_call("chat.postMessage", channel=channel,
                          text=response, as_user=True)
				product_comparison(current_products)
				plot(current_items)
				current_products = {}
				current_items = {}
	
		if len(get_items(command)) > 0:
			for i in get_item(command):
				itemname = 'item'+i
				buy_cart[itemname] = all_items[itemname]
				response = "Want to finalize your cart? Here are the products"
				slack_client.api_call("chat.postMessage", channel=channel,
                          text=response, as_user=True)
				link = buy_cart[itemname]['product'].large_image_url
				slack_client.api_call("chat.postMessage", channel=channel,
                          text=link, as_user=True)
				
		if len(buy_cart) > 0 and len(buy_cart) < 10:
			for i in buy_cart.values():
				product = i['product']
				item = amazon.lookup(ItemId=product.asin)
				item = {'offer_id': item.offer_id, 'quantity': 1} 
				if cart:
					cart = amazon.cart_add(item, cart.cart_id, cart.hmac)
				else:
					cart = amazon.cart_create(item)  
		else:
			reponse = "Can't add."

	if show_more_signal(command):
		if len(like_cart) == 0:
				text = get_search_text(command)
				products = amazon.search_n(3,Keywords=text, SearchIndex='All')
		else:
			items = ",".join([i.asin for i in like_cart])
			products = amazon.similarity_lookup(ItemId=items)
			products = products[0:min(3,len(products))]
		for i in products:
			response = "None to show."
			if i not in showed_items:
				showed_items.add(i)
				current_products['item'+str(len(showed_items))] = i
				reponse = "Here are some items based on your search."
		if len(current_products) > 0:
			product_comparison(current_products)
			plot(current_items)
			current_products = {}
			current_items = {}

	if like_signal(command):
		if len(get_items(command)) > 0:
			for i in get_item(command):
				itemname = 'item'+i
				like_cart[itemname] = all_items[itemname]
				response = "Want to finalize your cart? Here are the products"
				slack_client.api_call("chat.postMessage", channel=channel,
                          text=response, as_user=True)
				link = buy_cart[itemname]['product'].large_image_url
				slack_client.api_call("chat.postMessage", channel=channel,
                          text=link, as_user=True)
	slack_client.api_call("chat.postMessage", channel=channel,text=response, as_user=True)

def plot(dict):
	ratings = numpy.array([i['ratings'] for i in dict.values()])
	sentiments = numpy.array([i['sentiments'] for i in dict.values()])
	tags = [i['tags'] for i in dict.values()]
	ids = numpy.array(dict.keys())
	sns.barplot(x=ids,y=ratings)
	plt.title('Rating Comparison')
	plt.xlabel('Products')
	plt.ylabel('Ratings')
	link, file = plot_generation(plt,'Rating Comparison')
	slack_client.api_call("chat.postMessage", channel=channel,
                          text=link, as_user=True)
	slack_client.api_call("chat.postMessage", channel=channel,
                          text="This is the rating comparison of the products I showed", as_user=True)
	plot_deletion('Rating Comparison',file)

	sns.barplot(x=ids,y=sentiments)
	plt.title('Sentiment Comparison')
	plt.xlabel('Products')
	plt.ylabel('Sentiments')
	link, file = plot_generation(plt,'Sentiment Comparison')
	slack_client.api_call("chat.postMessage", channel=channel,
                          text=link, as_user=True)
	slack_client.api_call("chat.postMessage", channel=channel,
                          text="This is the sentiment comparison of the products I showed", as_user=True)
	plot_deletion('Sentiment Comparison',file)

	slack_client.api_call("chat.postMessage", channel=channel,
                          text="Now I'll show you something cool! See what are the major tags commented by the users.", as_user=True)	
	for i in range(len(ids)):
		tagged = ids[i] + ': ' + tags[i]
		slack_client.api_call("chat.postMessage", channel=channel,
                          text=tagged, as_user=True) 

def plot_generation(plot,text):
	imgname = text+'.png'
	file = drive.CreateFile({'title':imgname,'mimeType':'slack/plots'})
	plot.savefig('../plots/'+imgname)
	file.SetContentFile('../plots/'+imgname)
	file.Upload()
	permission = file.InsertPermission({'type': 'anyone','value': 'anyone','role': 'reader'})
	return file['alternateLink'], file

def plot_deletion(text,file):
	imgname = text+'.png'
	os.remove('../plots/'+imgname)
	file.Delete()

def product_comparison(dict):
	global like_cart,buy_cart,showed_items,all_items,all_item_index,current_products,current_items,prev_question,showed_items
	product_ids = dict.keys()
	products = dict.values()
	for i in products:
		link = i.large_image_url
		slack_client.api_call("chat.postMessage", channel=channel,
                          text=link, as_user=True)
	tags = []
	sentiments = []
	ratings = []
	soups = map(soupify,[i.reviews[1] for i in products])
	reviews = map(get_review,soups)
	
	sentiments = map(calculate_sentiment,reviews)
	print sentiments
	ratings = map(calculate_rating,soups)
	print ratings
	tags = map(top_tags,reviews)
	print tags
	
	for i in range(len(product_ids)):
		id = product_ids[i]
		all_items[id] = {'tags':"",'sentiments':"",'ratings':0,'product':""}
		current_items[id] = {'tags':"",'sentiments':"",'ratings':0,'product':""}
		all_items[id]['tags'] = " ".join(tags[i])
		all_items[id]['sentiments'] = sentiments[i]
		all_items[id]['ratings'] = ratings[i]
		all_items[id]['product'] = dict[id]
		current_items[id]['tags'] = " ".join(tags[i])
		current_items[id]['sentiments'] = sentiments[i]
		current_items[id]['ratings'] = ratings[i]
		current_items[id]['product'] = dict[id]

def handle_command(command, channel):
	for cmd in command.split('.'):
		amazon_chat(cmd)

def parse_slack_output(slack_rtm_output):
	output_list = slack_rtm_output
	if output_list and len(output_list) > 0:
		for output in output_list:
			if output and 'text' in output and AT_BOT in output['text']:
				return output['text'].replace(AT_BOT,'').lower(),output['channel']
	return None, None


if __name__ == "__main__":
	READ_WEBSOCKET_DELAY = 5
	if slack_client.rtm_connect():
		print("bot running!")	
		startup_chat = ["I am your shoe assistant. Let me buy you a pair of good looking shoes.", "I will show you shoes based on your specifications. If you like, just tell me to add in your like list","Tell me to show more if you don't like", "If you are willing to buy, just tell me so!"]
		command, channel = parse_slack_output(slack_client.rtm_read())
		for text in startup_chat:
			slack_client.api_call("chat.postMessage", channel=channel,text=text, as_user=False)
		slack_client.api_call("chat.postMessage", channel=channel,text="Tell me something. Any brand or color you like? ", as_user=True)        
		while True:
			command, channel = parse_slack_output(slack_client.rtm_read())
			if command and channel:
				handle_command(command, channel)
			else:
				print("Command failed!")
			time.sleep(READ_WEBSOCKET_DELAY)
	else:
		print("Connection failed")
