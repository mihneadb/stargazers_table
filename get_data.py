from github3 import login
from geopy.geocoders import GoogleV3

import json
import sys

if len(sys.argv) != 5:
    print >>sys.stderr, '%s $user $pass $owner $repo' % sys.argv[0]
    sys.exit(1)

user = sys.argv[1]
password = sys.argv[2]
owner = sys.argv[3]
repository = sys.argv[4]

gh = login(user, password=password)
repo = gh.repository(owner, repository)

data = []
for stargazer in repo.iter_stargazers():
    stargazer.refresh()
    data.append(stargazer._json_data)

with open('raw_data.json', 'w') as f:
    json.dump(data, f, indent=2)


geolocator = GoogleV3()  # 2500 requests per 24h
for stargazer in data:
    if 'location' not in stargazer or not stargazer['location']:
        stargazer['geocoded_location'] = None
        continue
    location = stargazer['location'].strip()
    if location:
        try:
            address, (latitude, longitude) = geolocator.geocode(location)
            geocoded_location = {
                'coordinates': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'full_address': address,
                'country': address.split(', ')[-1]
            }
        except:
            geocoded_location = None
    else:
        geocoded_location = None
    stargazer['geocoded_location'] = geocoded_location

print(json.dumps(data, indent=2))
