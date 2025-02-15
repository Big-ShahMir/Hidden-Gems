import requests
from config import USER_AGENT

def get_reddit_posts(query, limit=5):
    """
    Fetches Reddit posts related to the query.

    Args:
        query (str): Search query.
        limit (int): Number of posts to retrieve.

    Returns:
        list: A list of Reddit post data dictionaries.
    """
    headers = {'User-Agent': USER_AGENT}
    url = f"https://www.reddit.com/search.json?q={query}&limit={limit}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        posts = data.get('data', {}).get('children', [])
        # Extract the 'data' field for each post
        return [post['data'] for post in posts]
    else:
        print("Error fetching Reddit posts:", response.status_code)
        return []
