from serpapi import GoogleSearch

def get_relevant_travel_blog_urls(query, max_results=10, serpapi_api_key="c351dccc615b6b780739aaa82d7978967536cfa1c14cced5ac1a1d474475b87f"):
    """
    Retrieve travel blog URLs relevant to a query using SerpAPI's Google Search API.
    
    Args:
        query (str): The search query or location, e.g., "hidden gems travel blog Paris".
        max_results (int): Maximum number of results to retrieve.
        serpapi_api_key (str): Your SerpAPI API key.
    
    Returns:
        list: A list of URLs that are likely travel blogs.
    """
    params = {
        "engine": "google",
        "q": query,
        "num": max_results,
        "api_key": serpapi_api_key
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    
    organic_results = results.get("organic_results", [])
    
    filtered_urls = []
    for result in organic_results:
        title = result.get("title", "").lower()
    
        # print(result.get("link"))
        url = result.get("link")
        if url and url not in filtered_urls:
                    filtered_urls.append(url)
                    if len(filtered_urls) >= max_results:
                        break
    return filtered_urls
