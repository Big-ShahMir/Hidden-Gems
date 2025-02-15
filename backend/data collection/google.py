# aggregator/google_places.py

import requests
from config import GOOGLE_API_KEY

def get_places(location, radius=5000, place_type='restaurant'):
    """
    Fetches nearby places using the Google Places API.

    Args:
        location (str): Coordinates in "lat,lng" format.
        radius (int): Search radius in meters.
        place_type (str): Type of place to search for.

    Returns:
        list: A list of place dictionaries.
    """
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': location,
        'radius': radius,
        'type': place_type,
        'key': GOOGLE_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        return data.get('results', [])
    else:
        print("Error fetching places:", response.status_code)
        return []
