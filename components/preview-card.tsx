import { Card } from "@/components/ui/card"

interface Submission {
  id: number
  name: string
  email: string
  description: string
  filePreview: string
  problemId: string
  problemTitle: string
  submittedAt: string
}

interface PreviewCardProps {
  data: Submission
}

export function PreviewCard({ data }: PreviewCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md border-0">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submission Preview</h2>

        <div className="space-y-6">
          <div className="p-4 bg-[#f5f0ff] rounded-lg">
            <h3 className="font-medium text-[#9333ea] mb-1">Challenge:</h3>
            <p className="text-gray-700">{data.problemTitle}</p>
          </div>

          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <img
              src={data.filePreview || "/placeholder.svg"}
              alt="Design preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base text-gray-800">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-800">{data.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Solution Description</p>
            <p className="text-base text-gray-800 mt-1">{data.description}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
