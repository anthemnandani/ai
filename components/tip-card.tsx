import { Card } from "@/components/ui/card"
import { LightbulbIcon } from "lucide-react"

interface TipCardProps {
  title: string
  tips: string[]
}

export function TipCard({ title, tips }: TipCardProps) {
  return (
    <Card className="p-6 rounded-xl shadow-md border-0 bg-[#f5f0ff]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-[#d8b4fe]/30 flex items-center justify-center">
          <LightbulbIcon className="h-5 w-5 text-[#9333ea]" />
        </div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-[#9333ea] font-medium">•</span>
            <span className="text-sm text-gray-600">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
