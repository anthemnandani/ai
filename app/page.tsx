import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Target, Users, Trophy, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#f0f4f8]">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8 text-center min-h-[80vh]">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] bg-clip-text text-transparent">
              AI Design Arena
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Create stunning AI-powered designs for real brands. Submit your solutions and explore creative approaches
              from the community in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link href="/submit">
              <Button className="h-14 px-8 bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 text-white rounded-full shadow-lg text-lg">
                <Target className="mr-2 h-5 w-5" />
                Take Today's Challenge
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                variant="outline"
                className="h-14 px-8 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff] rounded-full shadow-sm text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Explore Gallery
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <Card className="p-6 rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">Daily Challenges</h3>
                <p className="text-sm text-gray-600">
                  New design briefs every day featuring real brands and creative prompts
                </p>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">Real-time Updates</h3>
                <p className="text-sm text-gray-600">
                  See new submissions appear instantly and get inspired by the community
                </p>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">AI-Powered</h3>
                <p className="text-sm text-gray-600">
                  Use cutting-edge AI tools to create professional-quality designs
                </p>
              </div>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <h3 className="font-medium text-gray-800">Get Today's Brief</h3>
                <p className="text-sm text-gray-600">
                  Receive a detailed design challenge with brand guidelines and requirements
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <h3 className="font-medium text-gray-800">Create with AI</h3>
                <p className="text-sm text-gray-600">
                  Use your favorite AI tools to design and submit your creative solution
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <h3 className="font-medium text-gray-800">Share & Explore</h3>
                <p className="text-sm text-gray-600">
                  View your submission in the gallery and discover other creative approaches
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
