"use client"

import { type Task, TaskStatus } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StatisticsPanelProps {
  tasks: Task[]
  completedTasks: Task[]
  currentTime: number
}

export default function StatisticsPanel({ tasks, completedTasks, currentTime }: StatisticsPanelProps) {
  // Calculate waiting time for a task
  const calculateWaitingTime = (task: Task): number => {
    if (task.startTime === -1) return 0
    return task.startTime - task.arrivalTime
  }

  // Calculate turnaround time for a task
  const calculateTurnaroundTime = (task: Task): number => {
    if (task.endTime === -1) return 0
    return task.endTime - task.arrivalTime
  }

  // Calculate response time for a task
  const calculateResponseTime = (task: Task): number => {
    if (task.startTime === -1) return 0
    return task.startTime - task.arrivalTime
  }

  // Calculate average waiting time
  const calculateAverageWaitingTime = (): number => {
    if (completedTasks.length === 0) return 0
    const totalWaitingTime = completedTasks.reduce((sum, task) => sum + calculateWaitingTime(task), 0)
    return totalWaitingTime / completedTasks.length
  }

  // Calculate average turnaround time
  const calculateAverageTurnaroundTime = (): number => {
    if (completedTasks.length === 0) return 0
    const totalTurnaroundTime = completedTasks.reduce((sum, task) => sum + calculateTurnaroundTime(task), 0)
    return totalTurnaroundTime / completedTasks.length
  }

  // Calculate average response time
  const calculateAverageResponseTime = (): number => {
    if (completedTasks.length === 0) return 0
    const totalResponseTime = completedTasks.reduce((sum, task) => sum + calculateResponseTime(task), 0)
    return totalResponseTime / completedTasks.length
  }

  // Calculate CPU utilization
  const calculateCpuUtilization = (): number => {
    if (currentTime === 0) return 0
    const totalExecutionTime = completedTasks.reduce((sum, task) => sum + task.executionTime, 0)
    // Add execution time of current running task
    const runningTask = tasks.find((task) => task.status === TaskStatus.RUNNING)
    const runningTaskTime = runningTask ? runningTask.executionTime - runningTask.remainingTime : 0

    return ((totalExecutionTime + runningTaskTime) / currentTime) * 100
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
          <div className="text-xs text-slate-500">Average Waiting Time</div>
          <div className="text-xl font-semibold">{calculateAverageWaitingTime().toFixed(2)}s</div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
          <div className="text-xs text-slate-500">Average Turnaround Time</div>
          <div className="text-xl font-semibold">{calculateAverageTurnaroundTime().toFixed(2)}s</div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
          <div className="text-xs text-slate-500">Average Response Time</div>
          <div className="text-xl font-semibold">{calculateAverageResponseTime().toFixed(2)}s</div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
          <div className="text-xs text-slate-500">CPU Utilization</div>
          <div className="text-xl font-semibold">{calculateCpuUtilization().toFixed(2)}%</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Execution</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Turnaround</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{task.arrivalTime}s</TableCell>
                <TableCell>{task.executionTime}s</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.startTime !== -1 ? `${task.startTime}s` : "-"}</TableCell>
                <TableCell>{task.endTime !== -1 ? `${task.endTime}s` : "-"}</TableCell>
                <TableCell>{task.startTime !== -1 ? `${calculateWaitingTime(task)}s` : "-"}</TableCell>
                <TableCell>{task.endTime !== -1 ? `${calculateTurnaroundTime(task)}s` : "-"}</TableCell>
                <TableCell>{task.startTime !== -1 ? `${calculateResponseTime(task)}s` : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

