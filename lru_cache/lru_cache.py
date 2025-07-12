from cache_node import CacheNode


class LRUCache:
    def __init__(self, capacity: int):
        self.start = CacheNode(-1, -1)
        self.end = CacheNode(-1, -1)

        self.start.next = self.end
        self.end.prev = self.start

        self.capacity = capacity
        self.key_to_node = {}

    def __insert_to_start(self, node: CacheNode):
        node.prev = self.start
        node.next = self.start.next

        self.start.next.prev = node
        self.start.next = node

    def __remove_node(self, node: CacheNode):
        node.prev.next = node.next
        node.next.prev = node.prev

        node.prev = None
        node.next = None

    def __move_to_start(self, node: CacheNode):
        self.__remove_node(node)
        self.__insert_to_start(node)

    def get(self, key: int) -> int:
        if key not in self.key_to_node:
            return -1

        node = self.key_to_node[key]
        self.__move_to_start(node)
        return node.value

    def put(self, key: int, value: int):
        if key in self.key_to_node:
            node = self.key_to_node[key]
            self.__move_to_start(node)
            node.value = value
            return

        new_node = CacheNode(key, value)
        self.key_to_node[key] = new_node
        self.__insert_to_start(new_node)

        if len(self.key_to_node) > self.capacity:
            node_to_delete = self.end.prev
            self.__remove_node(node_to_delete)
            del self.key_to_node[node_to_delete.key]
