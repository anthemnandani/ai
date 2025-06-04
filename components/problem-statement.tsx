import { Card } from "@/components/ui/card"
import { Calendar, Target, CheckCircle } from "lucide-react"

interface Problem {
  date: string
  title: string
  description: string
  requirements: string[]
}

interface ProblemStatementProps {
  problem: Problem
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="p-6 rounded-xl shadow-md border-0 bg-gradient-to-r from-[#f5f0ff] to-[#fdf2f8]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-[#d8b4fe]/30 flex items-center justify-center">
          <Target className="h-6 w-6 text-[#9333ea]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{problem.title}</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(problem.date)}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">{problem.description}</p>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-800 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-[#9333ea]" />
          <span>Requirements:</span>
        </h3>
        <ul className="space-y-2">
          {problem.requirements.map((req, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-[#9333ea] font-medium mt-1">•</span>
              <span className="text-sm text-gray-600">{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
