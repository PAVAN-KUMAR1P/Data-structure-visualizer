
import { TreeType, TreeOperation } from '../routes/tree/treeTypes';

export const TREE_CODE_SNIPPETS: Record<string, Record<string, { cpp: string; python: string; c: string }>> = {
    BST: {
        INSERT: {
            cpp: `TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root;
}`,
            python: `def insert(self, root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = self.insert(root.left, val)
    elif val > root.val:
        root.right = self.insert(root.right, val)
    return root`,
            c: `struct TreeNode* insert(struct TreeNode* root, int val) {
    if (root == NULL) {
        struct TreeNode* node = malloc(sizeof(struct TreeNode));
        node->val = val;
        node->left = node->right = NULL;
        return node;
    }
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root;
}`
        },
        DELETE: {
            cpp: `TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val)
        root->left = deleteNode(root->left, key);
    else if (key > root->val)
        root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        TreeNode* minNode = findMin(root->right);
        root->val = minNode->val;
        root->right = deleteNode(root->right, minNode->val);
    }
    return root;
}`,
            python: `def delete_node(self, root, key):
    if not root:
        return None
    if key < root.val:
        root.left = self.delete_node(root.left, key)
    elif key > root.val:
        root.right = self.delete_node(root.right, key)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        min_node = self.find_min(root.right)
        root.val = min_node.val
        root.right = self.delete_node(root.right, min_node.val)
    return root`,
            c: `struct TreeNode* deleteNode(struct TreeNode* root, int key) {
    if (!root) return NULL;
    if (key < root->val)
        root->left = deleteNode(root->left, key);
    else if (key > root->val)
        root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        struct TreeNode* minNode = findMin(root->right);
        root->val = minNode->val;
        root->right = deleteNode(root->right, minNode->val);
    }
    return root;
}`
        },
        SEARCH: {
            cpp: `TreeNode* search(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val)
        return search(root->left, val);
    return search(root->right, val);
}`,
            python: `def search(self, root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return self.search(root.left, val)
    return self.search(root.right, val)`,
            c: `struct TreeNode* search(struct TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    if (val < root->val)
        return search(root->left, val);
    return search(root->right, val);
}`
        },
        INORDER: {
            cpp: `void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}`,
            python: `def inorder(self, root):
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    traverse(root)
    return result`,
            c: `void inorder(struct TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}`
        },
        PREORDER: {
            cpp: `void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left, result);
    preorder(root->right, result);
}`,
            python: `def preorder(self, root):
    result = []
    def traverse(node):
        if not node:
            return
        result.append(node.val)
        traverse(node.left)
        traverse(node.right)
    traverse(root)
    return result`,
            c: `void preorder(struct TreeNode* root) {
    if (!root) return;
    printf("%d ", root->val);
    preorder(root->left);
    preorder(root->right);
}`
        },
        POSTORDER: {
            cpp: `void postorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    postorder(root->left, result);
    postorder(root->right, result);
    result.push_back(root->val);
}`,
            python: `def postorder(self, root):
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        traverse(node.right)
        result.append(node.val)
    traverse(root)
    return result`,
            c: `void postorder(struct TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->val);
}`
        },
        LEVEL_ORDER: {
            cpp: `vector<int> levelOrder(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        result.push_back(node->val);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return result;
}`,
            python: `def level_order(self, root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result`,
            c: `void levelOrder(struct TreeNode* root) {
    if (!root) return;
    struct Queue* q = createQueue();
    enqueue(q, root);
    while (!isEmpty(q)) {
        struct TreeNode* node = dequeue(q);
        printf("%d ", node->val);
        if (node->left) enqueue(q, node->left);
        if (node->right) enqueue(q, node->right);
    }
}`
        },
        FIND_MIN: {
            cpp: `TreeNode* findMin(TreeNode* root) {
    while (root && root->left)
        root = root->left;
    return root;
}`,
            python: `def find_min(self, root):
    while root and root.left:
        root = root.left
    return root`,
            c: `struct TreeNode* findMin(struct TreeNode* root) {
    while (root && root->left)
        root = root->left;
    return root;
}`
        },
        FIND_MAX: {
            cpp: `TreeNode* findMax(TreeNode* root) {
    while (root && root->right)
        root = root->right;
    return root;
}`,
            python: `def find_max(self, root):
    while root and root.right:
        root = root.right
    return root`,
            c: `struct TreeNode* findMax(struct TreeNode* root) {
    while (root && root->right)
        root = root->right;
    return root;
}`
        },
        GET_HEIGHT: {
            cpp: `int getHeight(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(getHeight(root->left), 
                   getHeight(root->right));
}`,
            python: `def get_height(self, root):
    if not root:
        return 0
    return 1 + max(self.get_height(root.left),
                   self.get_height(root.right))`,
            c: `int getHeight(struct TreeNode* root) {
    if (!root) return 0;
    int left = getHeight(root->left);
    int right = getHeight(root->right);
    return 1 + (left > right ? left : right);
}`
        }
    },
    AVL: {
        INSERT: {
            cpp: `TreeNode* insert(TreeNode* node, int val) {
    if (!node) return new TreeNode(val);
    if (val < node->val)
        node->left = insert(node->left, val);
    else if (val > node->val)
        node->right = insert(node->right, val);
    else return node;

    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && val < node->left->val)
        return rightRotate(node);
    // Right Right Case
    if (balance < -1 && val > node->right->val)
        return leftRotate(node);
    // Left Right Case
    if (balance > 1 && val > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // Right Left Case
    if (balance < -1 && val < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}`,
            python: `def insert(self, root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = self.insert(root.left, val)
    elif val > root.val:
        root.right = self.insert(root.right, val)
    else:
        return root
    
    root.height = 1 + max(self.height(root.left), 
                          self.height(root.right))
    balance = self.get_balance(root)
    
    # Left Left
    if balance > 1 and val < root.left.val:
        return self.right_rotate(root)
    # Right Right
    if balance < -1 and val > root.right.val:
        return self.left_rotate(root)
    # Left Right
    if balance > 1 and val > root.left.val:
        root.left = self.left_rotate(root.left)
        return self.right_rotate(root)
    # Right Left
    if balance < -1 and val < root.right.val:
        root.right = self.right_rotate(root.right)
        return self.left_rotate(root)
    
    return root`,
            c: `struct TreeNode* insert(struct TreeNode* node, int val) {
    if (!node) return createNode(val);
    if (val < node->val)
        node->left = insert(node->left, val);
    else if (val > node->val)
        node->right = insert(node->right, val);
    else return node;

    node->height = 1 + max(height(node->left), height(node->right));
    int balance = getBalance(node);

    if (balance > 1 && val < node->left->val)
        return rightRotate(node);
    if (balance < -1 && val > node->right->val)
        return leftRotate(node);
    if (balance > 1 && val > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (balance < -1 && val < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}`
        },
        DELETE: {
            cpp: `TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val)
        root->left = deleteNode(root->left, key);
    else if (key > root->val)
        root->right = deleteNode(root->right, key);
    else {
        if (!root->left || !root->right) {
            TreeNode* temp = root->left ? root->left : root->right;
            if (!temp) return nullptr;
            *root = *temp;
        } else {
            TreeNode* temp = findMin(root->right);
            root->val = temp->val;
            root->right = deleteNode(root->right, temp->val);
        }
    }
    root->height = 1 + max(height(root->left), height(root->right));
    int balance = getBalance(root);
    // Rebalance...
    return root;
}`,
            python: `def delete(self, root, key):
    if not root:
        return None
    if key < root.val:
        root.left = self.delete(root.left, key)
    elif key > root.val:
        root.right = self.delete(root.right, key)
    else:
        if not root.left or not root.right:
            return root.left if root.left else root.right
        temp = self.find_min(root.right)
        root.val = temp.val
        root.right = self.delete(root.right, temp.val)
    
    root.height = 1 + max(self.height(root.left), 
                          self.height(root.right))
    balance = self.get_balance(root)
    # Rebalance as needed...
    return root`,
            c: `struct TreeNode* deleteNode(struct TreeNode* root, int key) {
    if (!root) return NULL;
    if (key < root->val)
        root->left = deleteNode(root->left, key);
    else if (key > root->val)
        root->right = deleteNode(root->right, key);
    else {
        if (!root->left || !root->right) {
            struct TreeNode* temp = root->left ? root->left : root->right;
            if (!temp) return NULL;
            *root = *temp;
        } else {
            struct TreeNode* temp = findMin(root->right);
            root->val = temp->val;
            root->right = deleteNode(root->right, temp->val);
        }
    }
    root->height = 1 + max(height(root->left), height(root->right));
    // Rebalance...
    return root;
}`
        }
    },
    MAX_HEAP: {
        INSERT: {
            cpp: `void insert(int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    // Bubble up
    while (i > 0 && heap[parent(i)] < heap[i]) {
        swap(heap[i], heap[parent(i)]);
        i = parent(i);
    }
}`,
            python: `def insert(self, val):
    self.heap.append(val)
    i = len(self.heap) - 1
    # Bubble up
    while i > 0 and self.heap[self.parent(i)] < self.heap[i]:
        self.heap[i], self.heap[self.parent(i)] = \\
            self.heap[self.parent(i)], self.heap[i]
        i = self.parent(i)`,
            c: `void insert(int val) {
    heap[heapSize++] = val;
    int i = heapSize - 1;
    // Bubble up
    while (i > 0 && heap[parent(i)] < heap[i]) {
        int temp = heap[i];
        heap[i] = heap[parent(i)];
        heap[parent(i)] = temp;
        i = parent(i);
    }
}`
        },
        EXTRACT_ROOT: {
            cpp: `int extractMax() {
    if (heap.empty()) return -1;
    int max = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    heapifyDown(0);
    return max;
}

void heapifyDown(int i) {
    int largest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < heap.size() && heap[left] > heap[largest])
        largest = left;
    if (right < heap.size() && heap[right] > heap[largest])
        largest = right;
    if (largest != i) {
        swap(heap[i], heap[largest]);
        heapifyDown(largest);
    }
}`,
            python: `def extract_max(self):
    if not self.heap:
        return None
    max_val = self.heap[0]
    self.heap[0] = self.heap[-1]
    self.heap.pop()
    self._heapify_down(0)
    return max_val

def _heapify_down(self, i):
    largest = i
    left, right = 2*i + 1, 2*i + 2
    if left < len(self.heap) and self.heap[left] > self.heap[largest]:
        largest = left
    if right < len(self.heap) and self.heap[right] > self.heap[largest]:
        largest = right
    if largest != i:
        self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
        self._heapify_down(largest)`,
            c: `int extractMax() {
    if (heapSize == 0) return -1;
    int max = heap[0];
    heap[0] = heap[--heapSize];
    heapifyDown(0);
    return max;
}

void heapifyDown(int i) {
    int largest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < heapSize && heap[left] > heap[largest])
        largest = left;
    if (right < heapSize && heap[right] > heap[largest])
        largest = right;
    if (largest != i) {
        int temp = heap[i];
        heap[i] = heap[largest];
        heap[largest] = temp;
        heapifyDown(largest);
    }
}`
        },
        HEAPIFY: {
            cpp: `void buildMaxHeap(vector<int>& arr) {
    int n = arr.size();
    // Start from last non-leaf node
    for (int i = n/2 - 1; i >= 0; i--)
        heapifyDown(arr, n, i);
}

void heapifyDown(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapifyDown(arr, n, largest);
    }
}`,
            python: `def build_max_heap(self, arr):
    n = len(arr)
    # Start from last non-leaf node
    for i in range(n // 2 - 1, -1, -1):
        self._heapify_down(arr, n, i)

def _heapify_down(self, arr, n, i):
    largest = i
    left, right = 2*i + 1, 2*i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        self._heapify_down(arr, n, largest)`,
            c: `void buildMaxHeap(int arr[], int n) {
    for (int i = n/2 - 1; i >= 0; i--)
        heapifyDown(arr, n, i);
}

void heapifyDown(int arr[], int n, int i) {
    int largest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapifyDown(arr, n, largest);
    }
}`
        }
    },
    MIN_HEAP: {
        INSERT: {
            cpp: `void insert(int val) {
    heap.push_back(val);
    int i = heap.size() - 1;
    // Bubble up
    while (i > 0 && heap[parent(i)] > heap[i]) {
        swap(heap[i], heap[parent(i)]);
        i = parent(i);
    }
}`,
            python: `def insert(self, val):
    self.heap.append(val)
    i = len(self.heap) - 1
    # Bubble up
    while i > 0 and self.heap[self.parent(i)] > self.heap[i]:
        self.heap[i], self.heap[self.parent(i)] = \\
            self.heap[self.parent(i)], self.heap[i]
        i = self.parent(i)`,
            c: `void insert(int val) {
    heap[heapSize++] = val;
    int i = heapSize - 1;
    // Bubble up
    while (i > 0 && heap[parent(i)] > heap[i]) {
        int temp = heap[i];
        heap[i] = heap[parent(i)];
        heap[parent(i)] = temp;
        i = parent(i);
    }
}`
        },
        EXTRACT_ROOT: {
            cpp: `int extractMin() {
    if (heap.empty()) return -1;
    int min = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    heapifyDown(0);
    return min;
}

void heapifyDown(int i) {
    int smallest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < heap.size() && heap[left] < heap[smallest])
        smallest = left;
    if (right < heap.size() && heap[right] < heap[smallest])
        smallest = right;
    if (smallest != i) {
        swap(heap[i], heap[smallest]);
        heapifyDown(smallest);
    }
}`,
            python: `def extract_min(self):
    if not self.heap:
        return None
    min_val = self.heap[0]
    self.heap[0] = self.heap[-1]
    self.heap.pop()
    self._heapify_down(0)
    return min_val

def _heapify_down(self, i):
    smallest = i
    left, right = 2*i + 1, 2*i + 2
    if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
        smallest = left
    if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
        smallest = right
    if smallest != i:
        self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
        self._heapify_down(smallest)`,
            c: `int extractMin() {
    if (heapSize == 0) return -1;
    int min = heap[0];
    heap[0] = heap[--heapSize];
    heapifyDown(0);
    return min;
}

void heapifyDown(int i) {
    int smallest = i;
    int left = 2*i + 1, right = 2*i + 2;
    if (left < heapSize && heap[left] < heap[smallest])
        smallest = left;
    if (right < heapSize && heap[right] < heap[smallest])
        smallest = right;
    if (smallest != i) {
        int temp = heap[i];
        heap[i] = heap[smallest];
        heap[smallest] = temp;
        heapifyDown(smallest);
    }
}`
        }
    }
};

export const getTreeSnippet = (type: TreeType, op: string, lang: 'c' | 'cpp' | 'python'): string => {
    // Try to get specific snippet for the tree type
    const typeSnippet = TREE_CODE_SNIPPETS[type]?.[op]?.[lang];
    if (typeSnippet) return typeSnippet;

    // Fall back to BST snippets for common operations
    const bstSnippet = TREE_CODE_SNIPPETS['BST']?.[op]?.[lang];
    if (bstSnippet) return bstSnippet;

    return `// ${op} implementation for ${type}`;
};
