class Node: 
    def __init__(self, value=None):
        self.value = value
        self.next= None

class Stack:
    def __init__(self):
        self.topo = None
        self._size = 0
        
    def push(self, value):
        new_node = Node(value)
        new_node.next = self.topo
        self.topo = new_node
        self._size += 1 
    
    def pop(self):
        if self.topo is None:
            raise IndexError("Nenhuma ação para desfazer.")
        removed = self.topo
        self.topo = self.topo.next
        self._size -= 1
        
        return removed.value
    
    def peek(self):
        if self.topo is None:
            return None
        return self.topo.value
    
    def __len__(self):
        return self._size