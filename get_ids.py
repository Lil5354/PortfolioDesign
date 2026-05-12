import urllib.request
import re
import json

def get_ids(q):
    url = 'https://unsplash.com/s/photos/' + q.replace(' ', '-')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # find img tags with src starting with https://images.unsplash.com/photo-
        ids = re.findall(r'https://images\.unsplash\.com/photo-([a-zA-Z0-9-]+)\?', html)
        print(f"--- {q} ---")
        print(list(set(ids))[:5])
    except Exception as e:
        print(q, e)

get_ids('poster mockup')
get_ids('branding mockup')
get_ids('3d abstract render')
get_ids('ui ux design')
get_ids('illustration art')
get_ids('graphic design')
