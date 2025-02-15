from forum import get_reddit_posts
from blog import scrape_travel_blog
from url import get_relevant_travel_blog_urls

def aggregate_data(location):
    """
    Aggregates travel data from multiple sources.

    Args:
        location (str): Coordinates in "lat,lng" format.

    Returns:
        dict: Aggregated data from Google Places, Reddit, and travel blogs.
    """
    # Step 1: Get nearby places
    # places = get_places(location)
    
    # Step 2: Fetch Reddit posts related to the location (or a place type)
    reddit_data = get_reddit_posts(query=location, limit=5)
    
    # Step 3: (Optional) For each place, attempt to scrape related travel blogs.
    # For demonstration, we’ll use a placeholder blog URL.
    blogs = []
    # placeholder_blog_url = "https://travelwithruba.com/?utm_source=chatgpt.com" 
    # blog_content = scrape_travel_blog(placeholder_blog_url)
    urls = get_relevant_travel_blog_urls(location)
    
    # blog_content = scrape_travel_blog(urls[0])
    # if blog_content:
    #     blogs.append(blog_content)
    
    for url in urls:
        blog_content = scrape_travel_blog(url)
        if blog_content:
            blogs.append(blog_content)

    # Aggregate all data into a single dictionary
    aggregated = {
        # 'places': places,
        'reddit_posts': reddit_data,
        'blogs': blogs,
    }
    
    return aggregated

# if __name__ == "__main__":
#     # Example coordinates for New York City
#     #location = "40.7128,-74.0060"
#     location = "Not so popular activities to do in Tokyo"
#     data = aggregate_data(location)

#     for blog in data["blogs"]:
#         print(blog["title"])
#         print(blog["content"])
#         print("\n")
#     for reddit in data["reddit_posts"]:
#         print(reddit["title"])
#         print(reddit["selftext"])

    # print(data["reddit_posts"]["content"])
