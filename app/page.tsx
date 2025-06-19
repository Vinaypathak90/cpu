import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskScheduler from "@/components/task-scheduler"
import AlgorithmExplanation from "@/components/algorithm-explanation"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">CPU Task Scheduler</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
          Visualize heap & queue-based priority scheduling algorithms
        </p>

        <Tabs defaultValue="scheduler" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scheduler">Task Scheduler</TabsTrigger>
            <TabsTrigger value="explanation">Algorithm Explanation</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduler">
            <TaskScheduler />
          </TabsContent>
          <TabsContent value="explanation">
            <AlgorithmExplanation />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

