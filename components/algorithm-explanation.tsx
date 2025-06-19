"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AlgorithmExplanation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CPU Scheduling Algorithms</CardTitle>
          <CardDescription>Understanding heap and queue-based priority scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            CPU scheduling is the process of determining which process in the ready queue gets the CPU for execution.
            Different scheduling algorithms use different data structures and criteria to select the next process.
          </p>

          <Tabs defaultValue="min-heap">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="min-heap">Min Heap (SJF)</TabsTrigger>
              <TabsTrigger value="max-heap">Max Heap (Priority)</TabsTrigger>
              <TabsTrigger value="queue">Queue (FCFS)</TabsTrigger>
            </TabsList>

            <TabsContent value="min-heap" className="space-y-4">
              <h3 className="text-lg font-medium mt-4">Shortest Job First (SJF)</h3>
              <p>
                The Shortest Job First (SJF) algorithm selects the process with the shortest execution time. This is
                implemented using a Min Heap data structure, where the process with the minimum execution time is at the
                root.
              </p>

              <h4 className="text-md font-medium mt-2">Min Heap Properties:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Complete binary tree where the value of each node is less than or equal to its children</li>
                <li>The root contains the minimum value in the heap</li>
                <li>Extraction operation (O(log n)) returns the minimum element</li>
                <li>Insertion operation (O(log n)) maintains the heap property</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Advantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Minimizes average waiting time</li>
                <li>Efficient for systems where execution times are known in advance</li>
                <li>Provides optimal average waiting time when all jobs arrive simultaneously</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Disadvantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>May lead to starvation of longer processes</li>
                <li>Requires knowledge of execution time in advance</li>
                <li>Not practical for interactive systems</li>
              </ul>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mt-4">
                <h4 className="text-md font-medium mb-2">Min Heap Implementation:</h4>
                <pre className="text-sm overflow-x-auto">
                  {`class MinHeap {
  constructor(compareFn = (a, b) => a - b) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  siftUp(index) {
    let parent = this.getParentIndex(index);
    while (
      index > 0 &&
      this.compareFn(this.heap[parent], this.heap[index]) > 0
    ) {
      this.swap(parent, index);
      index = parent;
      parent = this.getParentIndex(index);
    }
  }

  siftDown(index) {
    let smallest = index;
    const left = this.getLeftChildIndex(index);
    const right = this.getRightChildIndex(index);
    const size = this.size();

    if (
      left < size &&
      this.compareFn(this.heap[smallest], this.heap[left]) > 0
    ) {
      smallest = left;
    }

    if (
      right < size &&
      this.compareFn(this.heap[smallest], this.heap[right]) > 0
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.siftDown(smallest);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  extract() {
    if (this.isEmpty()) {
      return null;
    }
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    
    return min;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="max-heap" className="space-y-4">
              <h3 className="text-lg font-medium mt-4">Priority Scheduling</h3>
              <p>
                Priority Scheduling selects the process with the highest priority for execution. This is implemented
                using a Max Heap data structure, where the process with the maximum priority is at the root.
              </p>

              <h4 className="text-md font-medium mt-2">Max Heap Properties:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Complete binary tree where the value of each node is greater than or equal to its children</li>
                <li>The root contains the maximum value in the heap</li>
                <li>Extraction operation (O(log n)) returns the maximum element</li>
                <li>Insertion operation (O(log n)) maintains the heap property</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Advantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Prioritizes important processes</li>
                <li>Suitable for real-time systems</li>
                <li>Can be preemptive or non-preemptive</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Disadvantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>May lead to starvation of low-priority processes</li>
                <li>
                  Priority inversion can occur (low-priority process holding resources needed by high-priority process)
                </li>
                <li>Overhead in maintaining priority information</li>
              </ul>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mt-4">
                <h4 className="text-md font-medium mb-2">Max Heap Implementation:</h4>
                <pre className="text-sm overflow-x-auto">
                  {`class MaxHeap {
  constructor(compareFn = (a, b) => b - a) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  siftUp(index) {
    let parent = this.getParentIndex(index);
    while (
      index > 0 &&
      this.compareFn(this.heap[parent], this.heap[index]) > 0
    ) {
      this.swap(parent, index);
      index = parent;
      parent = this.getParentIndex(index);
    }
  }

  siftDown(index) {
    let largest = index;
    const left = this.getLeftChildIndex(index);
    const right = this.getRightChildIndex(index);
    const size = this.size();

    if (
      left < size &&
      this.compareFn(this.heap[largest], this.heap[left]) > 0
    ) {
      largest = left;
    }

    if (
      right < size &&
      this.compareFn(this.heap[largest], this.heap[right]) > 0
    ) {
      largest = right;
    }

    if (largest !== index) {
      this.swap(index, largest);
      this.siftDown(largest);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  extract() {
    if (this.isEmpty()) {
      return null;
    }
    
    const max = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    
    return max;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="queue" className="space-y-4">
              <h3 className="text-lg font-medium mt-4">First Come First Served (FCFS)</h3>
              <p>
                The First Come First Served (FCFS) algorithm executes processes in the order they arrive. This is
                implemented using a Queue data structure, where processes are dequeued in the same order they were
                enqueued.
              </p>

              <h4 className="text-md font-medium mt-2">Queue Properties:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>FIFO (First In, First Out) data structure</li>
                <li>Elements are added at the rear and removed from the front</li>
                <li>Enqueue and dequeue operations are O(1)</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Advantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Simple to implement and understand</li>
                <li>No starvation (every process gets a chance to execute)</li>
                <li>Fair in terms of arrival order</li>
              </ul>

              <h4 className="text-md font-medium mt-2">Disadvantages:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Can lead to the "convoy effect" (short processes waiting behind long ones)</li>
                <li>High average waiting time if short processes arrive after long ones</li>
                <li>Not suitable for interactive systems</li>
              </ul>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mt-4">
                <h4 className="text-md font-medium mb-2">Queue Implementation:</h4>
                <pre className="text-sm overflow-x-auto">
                  {`class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Understanding CPU scheduling performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Waiting Time</h3>
              <p>
                The time a process spends waiting in the ready queue before it gets CPU time.
                <br />
                <strong>Formula:</strong> Waiting Time = Start Time - Arrival Time
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Turnaround Time</h3>
              <p>
                The total time taken from submission to completion of a process.
                <br />
                <strong>Formula:</strong> Turnaround Time = Completion Time - Arrival Time
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Response Time</h3>
              <p>
                The time from submission until the first response is produced.
                <br />
                <strong>Formula:</strong> Response Time = First CPU Time - Arrival Time
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">CPU Utilization</h3>
              <p>
                The percentage of time the CPU is busy executing processes.
                <br />
                <strong>Formula:</strong> CPU Utilization = (Total Execution Time / Total Time) × 100%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

