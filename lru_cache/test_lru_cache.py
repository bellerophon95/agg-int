import os
import unittest

from lru_cache import LRUCache


class TestLRUCache(unittest.TestCase):
    def setUp(self):
        self.cache = LRUCache(capacity=3)

    def test_cache_empty_get(self):
        self.assertEqual(self.cache.get(1), -1, "Empty cache get should return -1")

    def test_cache_get_value_check(self):
        self.cache.put(1, 5)
        self.assertEqual(self.cache.get(1), 5, f"Value mismatch, should be 5")

    def test_cache_eviction(self):
        self.cache.put(1, 5)
        self.cache.put(2, 15)
        self.cache.put(3, 25)
        self.cache.put(4, 35)

        self.assertEqual(self.cache.get(1), -1, "Element not evicted")

    def test_cache_put_update(self):
        self.cache.put(1, 5)
        self.cache.put(1, 15)

        self.assertEqual(self.cache.get(1), 15, "Element's updated value should be 15")

    def test_recency(self):
        self.cache.put(1, 5)
        self.cache.put(2, 15)
        self.cache.put(3, 25)

        self.cache.get(1)
        self.cache.put(4, 65)
        self.assertEqual(self.cache.get(2), -1, "2 should be evicted as per recency")


if __name__ == '__main__':
    unittest.main()
