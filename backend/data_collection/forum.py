import requests
from config import USER_AGENT

def get_reddit_posts(query, limit=5):
    """
    Fetches Reddit posts related to the query and extracts just the post content.

    Args:
        query (str): Search query.
        limit (int): Number of posts to retrieve.

    Returns:
        list: A list of dictionaries containing post content and basic info.
    """
    headers = {'User-Agent': USER_AGENT}
    url = f"https://www.reddit.com/search.json?q={query}&limit={limit}"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        posts = data.get('data', {}).get('children', [])
        
        extracted_posts = []
        for post in posts:
            post_data = post.get('data', {})
            extracted_post = {
                'title': post_data.get('title', ''),
                'selftext': post_data.get('selftext', ''),
                'subreddit': post_data.get('subreddit', ''),
                'author': post_data.get('author', ''),
                'permalink': post_data.get('permalink', ''),
                'created_utc': post_data.get('created_utc', None)
            }
            extracted_posts.append(extracted_post)
            
        return extracted_posts
    else:
        print("Error fetching Reddit posts:", response.status_code)
        return []
    