class CacheNode:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value

        self.next = None
        self.prev = None
