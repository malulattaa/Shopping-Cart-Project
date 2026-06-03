class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkList: 
    def __init__(self):
        self.head = None
        self._size = 0
        
    def append(self, elem):
        node = Node(elem)
        if self.head:
            pointer = self.head
            while(pointer.next):
                pointer = pointer.next
            pointer.next = node
        else:
            self.head = node
        self._size += 1
    
    def to_list(self):
        lista = []
        current = self.head
        while current:
            lista.append(current.value)
            current = current.next
        return lista
    
    def __len__(self):
        return self._size