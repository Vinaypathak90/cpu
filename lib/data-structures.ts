// Min Heap implementation
export class MinHeap<T> {
  private heap: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compareFn: (a: T, b: T) => number) {
    this.compare = compareFn
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2)
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2
  }

  private swap(i: number, j: number): void {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  private siftUp(index: number): void {
    let parent = this.getParentIndex(index)
    while (index > 0 && this.compare(this.heap[parent], this.heap[index]) > 0) {
      this.swap(parent, index)
      index = parent
      parent = this.getParentIndex(index)
    }
  }

  private siftDown(index: number): void {
    let smallest = index
    const left = this.getLeftChildIndex(index)
    const right = this.getRightChildIndex(index)
    const size = this.size()

    if (left < size && this.compare(this.heap[smallest], this.heap[left]) > 0) {
      smallest = left
    }

    if (right < size && this.compare(this.heap[smallest], this.heap[right]) > 0) {
      smallest = right
    }

    if (smallest !== index) {
      this.swap(index, smallest)
      this.siftDown(smallest)
    }
  }

  public insert(value: T): void {
    this.heap.push(value)
    this.siftUp(this.heap.length - 1)
  }

  public extract(): T | null {
    if (this.isEmpty()) {
      return null
    }

    const min = this.heap[0]
    const last = this.heap.pop()!

    if (this.heap.length > 0) {
      this.heap[0] = last
      this.siftDown(0)
    }

    return min
  }

  public peek(): T | null {
    return this.isEmpty() ? null : this.heap[0]
  }

  public size(): number {
    return this.heap.length
  }

  public isEmpty(): boolean {
    return this.size() === 0
  }

  public getHeap(): T[] {
    return [...this.heap]
  }
}

// Max Heap implementation
export class MaxHeap<T> {
  private heap: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compareFn: (a: T, b: T) => number) {
    // Invert the comparison for max heap
    this.compare = (a, b) => -compareFn(a, b)
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2)
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2
  }

  private swap(i: number, j: number): void {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  private siftUp(index: number): void {
    let parent = this.getParentIndex(index)
    while (index > 0 && this.compare(this.heap[parent], this.heap[index]) > 0) {
      this.swap(parent, index)
      index = parent
      parent = this.getParentIndex(index)
    }
  }

  private siftDown(index: number): void {
    let largest = index
    const left = this.getLeftChildIndex(index)
    const right = this.getRightChildIndex(index)
    const size = this.size()

    if (left < size && this.compare(this.heap[largest], this.heap[left]) > 0) {
      largest = left
    }

    if (right < size && this.compare(this.heap[largest], this.heap[right]) > 0) {
      largest = right
    }

    if (largest !== index) {
      this.swap(index, largest)
      this.siftDown(largest)
    }
  }

  public insert(value: T): void {
    this.heap.push(value)
    this.siftUp(this.heap.length - 1)
  }

  public extract(): T | null {
    if (this.isEmpty()) {
      return null
    }

    const max = this.heap[0]
    const last = this.heap.pop()!

    if (this.heap.length > 0) {
      this.heap[0] = last
      this.siftDown(0)
    }

    return max
  }

  public peek(): T | null {
    return this.isEmpty() ? null : this.heap[0]
  }

  public size(): number {
    return this.heap.length
  }

  public isEmpty(): boolean {
    return this.size() === 0
  }

  public getHeap(): T[] {
    return [...this.heap]
  }
}

// Queue implementation
export class Queue<T> {
  private items: T[] = []

  public enqueue(item: T): void {
    this.items.push(item)
  }

  public dequeue(): T | null {
    if (this.isEmpty()) {
      return null
    }
    return this.items.shift()!
  }

  public peek(): T | null {
    if (this.isEmpty()) {
      return null
    }
    return this.items[0]
  }

  public isEmpty(): boolean {
    return this.items.length === 0
  }

  public size(): number {
    return this.items.length
  }

  public getItems(): T[] {
    return [...this.items]
  }
}

