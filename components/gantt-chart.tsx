"use client"

import { useEffect, useRef } from "react"
import { type Task, TaskStatus } from "@/lib/types"

interface GanttChartProps {
  tasks: Task[]
  currentTime: number
  height: number
}

export default function GanttChart({ tasks, currentTime, height }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Colors for different task states
  const colors = {
    waiting: "#94a3b8", // slate-400
    running: "#3b82f6", // blue-500
    completed: "#22c55e", // green-500
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width

    // Calculate time scale (pixels per second)
    const maxTime = Math.max(currentTime + 10, ...tasks.map((t) => (t.endTime !== -1 ? t.endTime : 0)))
    const timeScale = width / maxTime

    // Draw time axis
    ctx.beginPath()
    ctx.moveTo(0, height - 20)
    ctx.lineTo(width, height - 20)
    ctx.strokeStyle = "#64748b" // slate-500
    ctx.stroke()

    // Draw time markers
    for (let t = 0; t <= maxTime; t += 5) {
      const x = t * timeScale

      // Draw marker line
      ctx.beginPath()
      ctx.moveTo(x, height - 25)
      ctx.lineTo(x, height - 15)
      ctx.strokeStyle = "#64748b" // slate-500
      ctx.stroke()

      // Draw time label
      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(t.toString(), x, height - 5)
    }

    // Draw current time marker
    const currentX = currentTime * timeScale
    ctx.beginPath()
    ctx.moveTo(currentX, 0)
    ctx.lineTo(currentX, height - 20)
    ctx.strokeStyle = "#ef4444" // red-500
    ctx.setLineDash([3, 3])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw task bars
    const barHeight = 20
    const spacing = 5
    const startY = 10

    tasks.forEach((task, index) => {
      const y = startY + index * (barHeight + spacing)

      // Draw task label
      ctx.fillStyle = "#0f172a" // slate-900
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(task.name, 5, y + barHeight / 2 + 4)

      // Draw task bar background (for waiting tasks)
      if (task.status === TaskStatus.WAITING) {
        ctx.fillStyle = colors.waiting
        ctx.fillRect(100, y, task.executionTime * timeScale, barHeight)
      }

      // Draw task bar for running or completed tasks
      if (task.startTime !== -1) {
        const barX = task.startTime * timeScale
        let barWidth

        if (task.status === TaskStatus.COMPLETED) {
          barWidth = (task.endTime - task.startTime) * timeScale
          ctx.fillStyle = colors.completed
        } else {
          barWidth = (currentTime - task.startTime) * timeScale
          ctx.fillStyle = colors.running
        }

        ctx.fillRect(barX, y, barWidth, barHeight)
      }
    })
  }, [tasks, currentTime, height, colors])

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={canvasRef} width={800} height={height} className="w-full" />
    </div>
  )
}

