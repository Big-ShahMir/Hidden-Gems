import unittest
from data_collection.aggregator import aggregate_data

class TestAggregator(unittest.TestCase):
    def test_aggregate_data_structure(self):
        # Using example coordinates for New York City
        #location = "40.7128,-74.0060"
        location = "Tokyo"
        data = aggregate_data(location)
        
        # Check that keys are in the aggregated output
        # self.assertIn("places", data)
        self.assertIn("reddit_posts", data)
        self.assertIn("blogs", data)
        
        # Validate that each key returns a list
        # self.assertIsInstance(data["places"], list)
        self.assertIsInstance(data["reddit_posts"], list)
        self.assertIsInstance(data["blogs"], list)
    
    def test_aggregate_data_content(self):
        # This test assumes that at least one source returns non-empty data.
        # In production tests, consider using mocks to control responses.
        # location = "40.7128,-74.0060
        location = "Tokyo"
        data = aggregate_data(location)
        
        # Here, you can check more details if your API keys are active
        # For example, if Google Places returns results, ensure at least one is present.
        # For demonstration, we only check type safety.
        #if data["places"]:
        #   self.assertIn("name", data["places"][0])
        if data["reddit_posts"]:
            self.assertIn("title", data["reddit_posts"][0])
        # You could add more detailed assertions depending on your data.

if __name__ == "__main__":
    unittest.main()
