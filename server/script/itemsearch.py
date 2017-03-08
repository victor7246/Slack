import os
import time
from slackclient import SlackClient
from nltk import word_tokenize
from wordcloud import WordCloud, STOPWORDS
from bs4 import BeautifulSoup
from amazon.api import AmazonAPI
import urllib
import re
import nltk

def buy_signal(text):
    if "buy" in text or "purchase" in text or "add" in text and "cart" in text:
        return True
    else:
        return False

def like_signal(text):
    if "like" in text or "keep" in text or "similar" in text:
        return True
    else:
        return False

def show_more_signal(text):
    if "dont" in text or "more" in text or "other" in text or "else" in text:
        return True
    else:
        return False

def get_items(text):
	l = set([int(s) for s in re.findall(r'\b\d+\b', text)])
	dict = {'first':1,'second':2,'third':3,'fourth':4,'fifth':5,'sixth':6,'seventh':7,'eighth':8,'ninth':9,'tenth':10}
	for word in text:
		if word in dict.keys():
			l.add(dict[word])
	return list(l)

def get_search_text(text):
    words = word_tokenize(text)
    tagged_words = nltk.pos_tag(words)
    search_term = " ".join([i[0] for i in tagged_words if i[1] == 'NN' or i[1] == 'JJ'])
    return search_term



