
import { ListKind, ListOperation } from '../types';

export const CODE_SNIPPETS: Record<string, Record<string, { cpp: string; python: string; c: string }>> = {
  SLL: {
    INSERT_HEAD: {
      cpp: `void insertAtHead(Node* &head, int val) {\n    Node* newNode = new Node(val);\n    newNode->next = head;\n    head = newNode;\n}`,
      python: `def insert_at_head(self, val):\n    new_node = Node(val)\n    new_node.next = self.head\n    self.head = new_node`,
      c: `void insertAtHead(struct Node** head, int val) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = val;\n    newNode->next = *head;\n    *head = newNode;\n}`
    },
    INSERT_TAIL: {
      cpp: `void insertAtTail(Node* &head, int val) {\n    Node* newNode = new Node(val);\n    if (!head) { head = newNode; return; }\n    Node* temp = head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n}`,
      python: `def insert_at_tail(self, val):\n    new_node = Node(val)\n    if not self.head:\n        self.head = new_node\n        return\n    curr = self.head\n    while curr.next: curr = curr.next\n    curr.next = new_node`,
      c: `void insertAtTail(struct Node** head, int val) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = val;\n    newNode->next = NULL;\n    if (*head == NULL) { *head = newNode; return; }\n    struct Node* temp = *head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n}`
    },
    FIND_MIDDLE: {
      cpp: `Node* findMiddle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
      python: `def find_middle(self):\n    slow = fast = self.head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
      c: `struct Node* findMiddle(struct Node* head) {\n    struct Node *slow = head, *fast = head;\n    while (fast != NULL && fast->next != NULL) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`
    },
    SORT: {
      cpp: `void bubbleSort(Node* head) {\n    if (!head) return;\n    bool swapped;\n    do {\n        swapped = false;\n        Node* curr = head;\n        while (curr->next) {\n            if (curr->data > curr->next->data) {\n                swap(curr->data, curr->next->data);\n                swapped = true;\n            }\n            curr = curr->next;\n        }\n    } while (swapped);\n}`,
      python: `def bubble_sort(self):\n    if not self.head: return\n    swapped = True\n    while swapped:\n        swapped = False\n        curr = self.head\n        while curr.next:\n            if curr.data > curr.next.data:\n                curr.data, curr.next.data = curr.next.data, curr.data\n                swapped = True\n            curr = curr.next`,
      c: `void bubbleSort(struct Node* head) {\n    int swapped;\n    struct Node* ptr1;\n    if (head == NULL) return;\n    do {\n        swapped = 0;\n        ptr1 = head;\n        while (ptr1->next != NULL) {\n            if (ptr1->data > ptr1->next->data) {\n                int temp = ptr1->data;\n                ptr1->data = ptr1->next->data;\n                ptr1->next->data = temp;\n                swapped = 1;\n            }\n            ptr1 = ptr1->next;\n        }\n    } while (swapped);\n}`
    }
  }
};

export const getSnippet = (kind: ListKind, op: string, lang: 'c' | 'cpp' | 'python') => {
  return CODE_SNIPPETS[kind]?.[op]?.[lang] || CODE_SNIPPETS['SLL']?.[op]?.[lang] || "// Operation implementation visual for " + op;
};
