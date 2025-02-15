import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def scrape_travel_blog(blog_url):
    """
    Scrapes a travel blog for relevant information including title, content,
    author, date, and any location tags.

    Args:
        blog_url (str): URL of the travel blog to scrape.

    Returns:
        dict: Dictionary containing extracted blog information or None if failed.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(blog_url, headers=headers, timeout=10, verify=False)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error making request to {blog_url}: {e}")
        return None
    
    soup = BeautifulSoup(response.content, 'html.parser')
    domain = urlparse(blog_url).netloc
    
    # Initialize result dictionary
    blog_data = {
        'url': blog_url,
        'domain': domain,
        'title': None,
        'content': None,
        'author': None,
        'date': None,
        'locations': [],
        'images': []
    }
    
    # Extract title (try different common selectors)
    title_selectors = ['h1.entry-title', 'h1.post-title', 'h1.article-title', 'h1']
    for selector in title_selectors:
        title = soup.select_one(selector)
        if title:
            blog_data['title'] = title.get_text(strip=True)
            break
    
    # Extract content (try different common content containers)
    content_selectors = [
        'div.post-content', 'div.entry-content', 'article.post', 
        'div.blog-post-content', 'div.article-content'
    ]
    for selector in content_selectors:
        content = soup.select_one(selector)
        if content:
            # Get all paragraphs within the content
            paragraphs = content.find_all('p')
            if paragraphs:
                blog_data['content'] = '\n\n'.join([p.get_text(strip=True) for p in paragraphs])
            else:
                blog_data['content'] = content.get_text(strip=True)
            break
    
    # Extract author
    author_selectors = [
        'a.author', 'span.author', 'a.fn', 'span.fn', 
        'div.author-name', 'span.author-name'
    ]
    for selector in author_selectors:
        author = soup.select_one(selector)
        if author:
            blog_data['author'] = author.get_text(strip=True)
            break
    
    # Extract date
    date_selectors = [
        'time.entry-date', 'span.posted-on time', 'meta[property="article:published_time"]',
        'span.post-date', 'time.published'
    ]
    for selector in date_selectors:
        date = soup.select_one(selector)
        if date:
            if date.name == 'meta':
                blog_data['date'] = date.get('content', None)
            else:
                blog_data['date'] = date.get_text(strip=True)
            break
    
    # Extract location tags (common in travel blogs)
    location_selectors = [
        'a[rel="tag"]', 'span.location', 'div.travel-location', 
        'a.destination-tag', 'a.category-location'
    ]
    for selector in location_selectors:
        locations = soup.select(selector)
        if locations:
            blog_data['locations'] = [loc.get_text(strip=True) for loc in locations if loc.get_text(strip=True)]
            break
    
    # Extract image URLs (useful for travel blogs)
    if content and content.find_all('img'):
        for img in content.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src:
                blog_data['images'].append(src)
    
    return blog_data