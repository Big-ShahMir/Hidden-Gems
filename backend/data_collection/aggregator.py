from forum import get_reddit_posts
from blog import scrape_travel_blog
from url import get_relevant_travel_blog_urls

def aggregate_data(location, budget, interest: list[str]):
    """
    Aggregates travel data from multiple sources.

    Args:
        location (str): str of the location.

    Returns:
        dict: Aggregated data from Google Places, Reddit, and travel blogs.
    """
    # places = get_places(location)
    
    query1 = f"Unique and affordable activities in {location} under ${budget} if you like {interest}"
    
    # reddit_data = get_reddit_posts(query=location, limit=5)
    reddit_data = get_reddit_posts(query=query1, limit=5)
    
    blogs = []
    # placeholder_blog_url = "https://travelwithruba.com/?utm_source=chatgpt.com" 
    # blog_content = scrape_travel_blog(placeholder_blog_url)
    # urls = get_relevant_travel_blog_urls(location)
    urls = get_relevant_travel_blog_urls(query1)
    

    # blog_content = scrape_travel_blog(urls[0])
    # if blog_content:
    #     blogs.append(blog_content)
    
    for url in urls:
        blog_content = scrape_travel_blog(url)
        if blog_content:
            blogs.append(blog_content)

    aggregated = {
        # 'places': places,
        'reddit_posts': reddit_data,
        'blogs': blogs,
    }
    
    return aggregated

# if __name__ == "__main__":
#     # Example coordinates for New York City
#     #location = "40.7128,-74.0060"
#     location = "New York City"
#     data = aggregate_data(location, 100, ["adventure"])

#     for blog in data["blogs"]:
#         print(blog["title"])
#         print(blog["content"])
#         print("\n")
#     for reddit in data["reddit_posts"]:
#         print(reddit["title"])
#         print(reddit["selftext"])

    # print(data["reddit_posts"]["content"])
