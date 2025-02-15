from duckduckgo_search import ddg

def get_relevant_travel_blog_urls(query, max_results=10):
    """
    Retrieve travel blog URLs relevant to a query using DuckDuckGo search.

    Args:
        query (str): The search query or location, e.g. "hidden gems travel blog Paris".
        max_results (int): Maximum number of results to retrieve.

    Returns:
        list: A list of URLs that are likely travel blogs.
    """
    # Perform the search with the given query
    results = ddg(query, max_results=max_results)
    
    if not results:
        return []
    
    # Filter results: for example, keep results where the title suggests it’s a blog
    filtered_urls = []
    for result in results:
        title = result.get("title", "").lower()
        # Use basic keywords to decide if the result is a travel blog
        if "blog" in title or "travel" in title:
            # DuckDuckGo's API may use 'href' or 'url' for the result URL
            url = result.get("href") or result.get("url")
            if url and url not in filtered_urls:
                filtered_urls.append(url)
    
    return filtered_urls

if __name__ == '__main__':
    # Example query: Adjust it based on your needs (e.g., location, keywords)
    query = "hidden gems travel blog New York"
    urls = get_relevant_travel_blog_urls(query)
    
    if urls:
        print("Relevant Travel Blog URLs:")
        for url in urls:
            print(url)
    else:
        print("No relevant URLs found.")
