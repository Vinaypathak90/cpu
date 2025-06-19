export enum TaskStatus {
  WAITING = "waiting",
  RUNNING = "running",
  COMPLETED = "completed",
}

export type Task = {
  id: string
  name: string
  executionTime: number
  priority: number
  arrivalTime: number
  startTime: number
  endTime: number
  remainingTime: number
  status: TaskStatus
}

export type SchedulerType = "min-heap" | "max-heap" | "queue"

