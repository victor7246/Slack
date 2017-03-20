class bot(slack_client,amazon,drive):
	like_cart = {}
	buy_cart = {}
	showed_items = {}
	all_items = {}
	all_item_index = 1
	current_products = {}
	current_items = {}
	prev_question = None
	showed_items = set([])

	def amazon_chat(self,command):
		response = "Not sure what you mean."
		if buy_signal(command):
			if len(buy_cart) == 0:
				if len(like_cart) == 0:
					text = get_search_text(command)
					products = amazon.search_n(5,Keywords=text, SearchIndex='All')
				else:
					items = ",".join([i.asin for i in like_cart])
					products = amazon.similarity_lookup(ItemId=items)
					products = products[0:min(5,len(products))]
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
