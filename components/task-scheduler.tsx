"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Plus, RefreshCw, X } from "lucide-react"
import { type Task, type SchedulerType, TaskStatus } from "@/lib/types"
import { MinHeap, MaxHeap, Queue } from "@/lib/data-structures"
import GanttChart from "@/components/gantt-chart"
import HeapVisualizer from "@/components/heap-visualizer"
import StatisticsPanel from "@/components/statistics-panel"

export default function TaskScheduler() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskName, setTaskName] = useState("")
  const [executionTime, setExecutionTime] = useState(5)
  const [priority, setPriority] = useState(1)
  const [schedulerType, setSchedulerType] = useState<SchedulerType>("min-heap")
  const [isRunning, setIsRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [showHeapView, setShowHeapView] = useState(true)

  // References to data structures
  const minHeapRef = useRef(new MinHeap<Task>((a, b) => a.executionTime - b.executionTime))
  const maxHeapRef = useRef(new MaxHeap<Task>((a, b) => a.priority - b.priority))
  const queueRef = useRef(new Queue<Task>())

  // Reset all data structures
  const resetDataStructures = () => {
    minHeapRef.current = new MinHeap<Task>((a, b) => a.executionTime - b.executionTime)
    maxHeapRef.current = new MaxHeap<Task>((a, b) => a.priority - b.priority)
    queueRef.current = new Queue<Task>()

    // Add all tasks to the appropriate data structure
    tasks.forEach((task) => {
      if (task.status === TaskStatus.WAITING) {
        minHeapRef.current.insert(task)
        maxHeapRef.current.insert(task)
        queueRef.current.enqueue(task)
      }
    })
  }

  // Add a new task
  const addTask = () => {
    if (!taskName.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      executionTime,
      priority,
      arrivalTime: currentTime,
      startTime: -1,
      endTime: -1,
      remainingTime: executionTime,
      status: TaskStatus.WAITING,
    }

    setTasks((prev) => [...prev, newTask])

    // Add to appropriate data structure
    minHeapRef.current.insert(newTask)
    maxHeapRef.current.insert(newTask)
    queueRef.current.enqueue(newTask)

    // Reset form
    setTaskName("")
    setExecutionTime(5)
    setPriority(1)
  }

  // Remove a task
  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    resetDataStructures()
  }

  // Toggle scheduler running state
  const toggleRunning = () => {
    setIsRunning(!isRunning)
  }

  // Reset the scheduler
  const resetScheduler = () => {
    setIsRunning(false)
    setCurrentTime(0)
    setCompletedTasks([])
    setCurrentTask(null)

    // Reset all tasks to waiting state
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        startTime: -1,
        endTime: -1,
        remainingTime: task.executionTime,
        status: TaskStatus.WAITING,
      })),
    )

    resetDataStructures()
  }

  // Get the next task based on the scheduler type
  const getNextTask = (): Task | null => {
    switch (schedulerType) {
      case "min-heap":
        return minHeapRef.current.isEmpty() ? null : minHeapRef.current.extract()
      case "max-heap":
        return maxHeapRef.current.isEmpty() ? null : maxHeapRef.current.extract()
      case "queue":
        return queueRef.current.isEmpty() ? null : queueRef.current.dequeue()
      default:
        return null
    }
  }

  // Simulation logic
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCurrentTime((time) => time + 1)

      // If there's a current task, process it
      if (currentTask) {
        const updatedTask = { ...currentTask }
        updatedTask.remainingTime -= 1

        // If task is complete
        if (updatedTask.remainingTime <= 0) {
          updatedTask.status = TaskStatus.COMPLETED
          updatedTask.endTime = currentTime + 1

          setCompletedTasks((prev) => [...prev, updatedTask])
          setCurrentTask(null)

          // Update task in the tasks array
          setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
        } else {
          // Update the current task
          setCurrentTask(updatedTask)

          // Update task in the tasks array
          setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
        }
      }
      // If there's no current task, get the next one
      else {
        const nextTask = getNextTask()

        if (nextTask) {
          nextTask.status = TaskStatus.RUNNING
          nextTask.startTime = currentTime

          setCurrentTask(nextTask)

          // Update task in the tasks array
          setTasks((prev) => prev.map((task) => (task.id === nextTask.id ? nextTask : task)))
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, currentTask, currentTime, schedulerType])

  // When scheduler type changes, reset data structures
  useEffect(() => {
    resetDataStructures()
  }, [schedulerType])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Task Submission</CardTitle>
          <CardDescription>Add tasks with execution time and priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="executionTime">Execution Time (seconds)</Label>
              <Input
                id="executionTime"
                type="number"
                min={1}
                max={20}
                value={executionTime}
                onChange={(e) => setExecutionTime(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority (1-10)</Label>
              <Input
                id="priority"
                type="number"
                min={1}
                max={10}
                value={priority}
                onChange={(e) => setPriority(Number.parseInt(e.target.value))}
              />
            </div>

            <Button onClick={addTask} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="schedulerType">Scheduler Algorithm</Label>
            <Select
              value={schedulerType}
              onValueChange={(value) => setSchedulerType(value as SchedulerType)}
              disabled={isRunning}
            >
              <SelectTrigger id="schedulerType">
                <SelectValue placeholder="Select scheduler type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="min-heap">Min Heap (Shortest Job First)</SelectItem>
                <SelectItem value="max-heap">Max Heap (Priority Based)</SelectItem>
                <SelectItem value="queue">Queue (First Come First Served)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex items-center space-x-2">
            <Switch id="showHeap" checked={showHeapView} onCheckedChange={setShowHeapView} />
            <Label htmlFor="showHeap">Show Heap Visualization</Label>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant={isRunning ? "destructive" : "default"} onClick={toggleRunning}>
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start
                </>
              )}
            </Button>

            <Button variant="outline" onClick={resetScheduler}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Task Execution</CardTitle>
          <CardDescription>
            Current Time: {currentTime}s |
            {currentTask ? (
              <span className="ml-1">
                Running: <Badge variant="outline">{currentTask.name}</Badge>
              </span>
            ) : (
              <span className="ml-1">Idle</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Waiting Tasks</h3>
              {tasks.filter((task) => task.status === TaskStatus.WAITING).length === 0 ? (
                <p className="text-sm text-slate-500">No waiting tasks</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tasks
                    .filter((task) => task.status === TaskStatus.WAITING)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded"
                      >
                        <div>
                          <span className="font-medium">{task.name}</span>
                          <div className="text-xs text-slate-500">
                            Exec: {task.executionTime}s | Priority: {task.priority}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} disabled={isRunning}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {showHeapView && (
              <HeapVisualizer
                tasks={tasks.filter((task) => task.status === TaskStatus.WAITING)}
                schedulerType={schedulerType}
              />
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Gantt Chart</h3>
              <GanttChart tasks={tasks} currentTime={currentTime} height={100} />
            </div>

            <StatisticsPanel tasks={tasks} completedTasks={completedTasks} currentTime={currentTime} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

