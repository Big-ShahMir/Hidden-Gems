import requests
from bs4 import BeautifulSoup

def scrape_blog(blog_url):
    """
    Scrapes the given blog URL for content.

    Args:
        blog_url (str): URL of the blog to scrape.

    Returns:
        str: Extracted text content or None if not found.
    """
    response = requests.get(blog_url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # Example: Look for a div with class "post-content"
        content_div = soup.find('div', class_='post-content')
        if content_div:
            return content_div.get_text(strip=True)
        else:
            return None
    else:
        print("Error scraping blog:", response.status_code)
        return None
