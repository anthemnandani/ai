import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8]">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8 text-center min-h-[80vh]">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] bg-clip-text text-transparent">
              TuteDude Daily Challenge
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solve today's design challenge and explore creative solutions from the community. Submit your solution
              first to unlock the gallery and see how others approached the same problem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link href="/submit">
              <Button className="h-12 px-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-md">
                Take Today's Challenge
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                variant="outline"
                className="h-12 px-8 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff] rounded-full shadow-sm"
              >
                View Previous Challenges
              </Button>
            </Link>
          </div>

          <div className="mt-16 p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <h3 className="font-medium text-gray-800">Get Challenge</h3>
                <p className="text-sm text-gray-600">Receive a new design problem statement every day</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <h3 className="font-medium text-gray-800">Submit Solution</h3>
                <p className="text-sm text-gray-600">Upload your design solution with description</p>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <h3 className="font-medium text-gray-800">Explore Gallery</h3>
                <p className="text-sm text-gray-600">View and get inspired by community solutions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
