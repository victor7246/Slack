from nltk import word_tokenize
from wordcloud import WordCloud, STOPWORDS
from bs4 import BeautifulSoup
import re
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import numpy
import urllib
import nltk

def hashed(x):
	y = '# ' + str(x)
	return y

def top_tags(text):
	try:
		wordcloud = WordCloud(stopwords=STOPWORDS,background_color='white',width=1200,height=1000).generate(text)
		words = word_tokenize(" ".join([i[0] for i in wordcloud.words_]))
		tagged_words = nltk.pos_tag(words)
		l = [i[0] for i in tagged_words if i[1] == 'JJ' or i[1] == 'NNP']
		tags = l[0:min(3,len(l))]
		tags = map(hashed,tags)
		return " ".join(tags)
	except:
		return None

def soupify(url):
	urlread = urllib.urlopen(url).read()
	soup = BeautifulSoup(urlread)
	return soup

def get_review(soup):
	texts = soup.find_all("div", class_="reviewText")
	alltexts = map(lambda x: x.get_text(), texts)
	text = " ".join(alltexts)
	return text

def calculate_rating(soup):
	score = 0
	try:
		five = soup.find_all("div", class_="histoRowfive")
		temp = five[0].get_text()
		score += int(temp.split('star')[0])*int(temp.split('star')[1])*.01
	except:
		pass

	try:
		four = soup.find_all("div", class_="histoRowfour")
		temp = four[0].get_text()
		score += int(temp.split('star')[0])*int(temp.split('star')[1])*.01
	except:
		pass

	try:
		three = soup.find_all("div", class_="histoRowthree")
		temp = three[0].get_text()
		score += int(temp.split('star')[0])*int(temp.split('star')[1])*.01
	except:
		pass

	try:
		two = soup.find_all("div", class_="histoRowtwo")
		temp = two[0].get_text()
		score += int(temp.split('star')[0])*int(temp.split('star')[1])*.01
	except:
		pass

	try:
		one = soup.find_all("div", class_="histoRowone")
		temp = one[0].get_text()
		score += int(temp.split('star')[0])*int(temp.split('star')[1])*.01
	except:
		pass
	return score

def calculate_sentiment(text):
	sid = SentimentIntensityAnalyzer()
	return sid.polarity_scores(text)['compound']

	
