"use client"

import { useEffect, useRef } from "react"
import type { Task, SchedulerType } from "@/lib/types"

interface HeapVisualizerProps {
  tasks: Task[]
  schedulerType: SchedulerType
}

export default function HeapVisualizer({ tasks, schedulerType }: HeapVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get the comparison key based on scheduler type
  const getComparisonKey = (task: Task): number => {
    switch (schedulerType) {
      case "min-heap":
        return task.executionTime
      case "max-heap":
        return task.priority
      case "queue":
        return task.arrivalTime
      default:
        return 0
    }
  }

  // Get the label to display based on scheduler type
  const getLabel = (task: Task): string => {
    switch (schedulerType) {
      case "min-heap":
        return `${task.name} (${task.executionTime}s)`
      case "max-heap":
        return `${task.name} (P:${task.priority})`
      case "queue":
        return task.name
      default:
        return task.name
    }
  }

  // Sort tasks based on scheduler type
  const sortedTasks = [...tasks].sort((a, b) => {
    if (schedulerType === "min-heap") {
      return a.executionTime - b.executionTime
    } else if (schedulerType === "max-heap") {
      return b.priority - a.priority
    } else {
      return a.arrivalTime - b.arrivalTime
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || tasks.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Calculate node dimensions
    const nodeRadius = 30
    const horizontalSpacing = 80
    const verticalSpacing = 70

    // Calculate the number of levels in the heap
    const numLevels = Math.ceil(Math.log2(tasks.length + 1))

    // Draw the heap structure
    const drawNode = (index: number, x: number, y: number, level: number) => {
      if (index >= sortedTasks.length) return

      const task = sortedTasks[index]

      // Draw node circle
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)

      // Fill based on scheduler type
      if (schedulerType === "min-heap") {
        // Color gradient based on execution time (lower is greener)
        const normalizedValue = Math.min(task.executionTime / 20, 1) // Normalize to 0-1
        const r = Math.floor(34 + normalizedValue * 220)
        const g = Math.floor(197 - normalizedValue * 150)
        const b = Math.floor(94 - normalizedValue * 50)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      } else if (schedulerType === "max-heap") {
        // Color gradient based on priority (higher is more blue)
        const normalizedValue = Math.min(task.priority / 10, 1) // Normalize to 0-1
        const r = Math.floor(59 - normalizedValue * 30)
        const g = Math.floor(130 - normalizedValue * 50)
        const b = Math.floor(246)
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      } else {
        // Queue - use a neutral color
        ctx.fillStyle = "#94a3b8" // slate-400
      }

      ctx.fill()
      ctx.strokeStyle = "#0f172a" // slate-900
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(getLabel(task), x, y)

      // Draw comparison key
      const key = getComparisonKey(task)
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.fillText(key.toString(), x, y + 15)

      // Calculate child indices
      const leftChildIndex = 2 * index + 1
      const rightChildIndex = 2 * index + 2

      // Calculate child positions
      const nextLevelWidth = Math.pow(2, level + 1) * horizontalSpacing
      const leftChildX = x - nextLevelWidth / 4
      const rightChildX = x + nextLevelWidth / 4
      const childY = y + verticalSpacing

      // Draw lines to children
      if (leftChildIndex < sortedTasks.length) {
        ctx.beginPath()
        ctx.moveTo(x, y + nodeRadius)
        ctx.lineTo(leftChildX, childY - nodeRadius)
        ctx.strokeStyle = "#64748b" // slate-500
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw left child
        drawNode(leftChildIndex, leftChildX, childY, level + 1)
      }

      if (rightChildIndex < sortedTasks.length) {
        ctx.beginPath()
        ctx.moveTo(x, y + nodeRadius)
        ctx.lineTo(rightChildX, childY - nodeRadius)
        ctx.strokeStyle = "#64748b" // slate-500
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw right child
        drawNode(rightChildIndex, rightChildX, childY, level + 1)
      }
    }

    // Start drawing from the root
    const rootX = width / 2
    const rootY = 40

    if (schedulerType === "queue") {
      // Draw as a queue instead of a heap
      const queueNodeWidth = 80
      const queueNodeHeight = 40
      const queueY = height / 2

      sortedTasks.forEach((task, index) => {
        const x = 50 + index * (queueNodeWidth + 10)

        // Draw rectangle
        ctx.beginPath()
        ctx.rect(x, queueY - queueNodeHeight / 2, queueNodeWidth, queueNodeHeight)
        ctx.fillStyle = "#94a3b8" // slate-400
        ctx.fill()
        ctx.strokeStyle = "#0f172a" // slate-900
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw text
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(task.name, x + queueNodeWidth / 2, queueY)

        // Draw arrow if not the last element
        if (index < sortedTasks.length - 1) {
          ctx.beginPath()
          ctx.moveTo(x + queueNodeWidth + 2, queueY)
          ctx.lineTo(x + queueNodeWidth + 8, queueY)
          ctx.strokeStyle = "#0f172a" // slate-900
          ctx.lineWidth = 2
          ctx.stroke()

          // Arrow head
          ctx.beginPath()
          ctx.moveTo(x + queueNodeWidth + 8, queueY)
          ctx.lineTo(x + queueNodeWidth + 5, queueY - 3)
          ctx.lineTo(x + queueNodeWidth + 5, queueY + 3)
          ctx.closePath()
          ctx.fillStyle = "#0f172a" // slate-900
          ctx.fill()
        }
      })

      // Draw front and rear labels
      if (sortedTasks.length > 0) {
        ctx.fillStyle = "#0f172a" // slate-900
        ctx.font = "14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Front", 50 + queueNodeWidth / 2, queueY - queueNodeHeight / 2 - 15)
        ctx.fillText(
          "Rear",
          50 + (sortedTasks.length - 1) * (queueNodeWidth + 10) + queueNodeWidth / 2,
          queueY - queueNodeHeight / 2 - 15,
        )
      }
    } else {
      // Draw as a heap
      drawNode(0, rootX, rootY, 0)
    }

    // Draw title
    ctx.fillStyle = "#0f172a" // slate-900
    ctx.font = "16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(
      schedulerType === "min-heap"
        ? "Min Heap (Shortest Job First)"
        : schedulerType === "max-heap"
          ? "Max Heap (Priority Based)"
          : "Queue (First Come First Served)",
      width / 2,
      20,
    )
  }, [tasks, schedulerType, sortedTasks])

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={canvasRef} width={800} height={300} className="w-full" />
    </div>
  )
}

