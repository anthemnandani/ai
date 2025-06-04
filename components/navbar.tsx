import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4]"></div>
          <span className="font-bold text-xl text-gray-800">TuteDude</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/submit" className="text-gray-600 hover:text-gray-900">
            Submit
          </Link>
          <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
            Gallery
          </Link>
        </nav>
        <div className="flex items-center">
          <Button className="bg-gradient-to-r from-[#d8b4fe] to-[#f9a8d4] hover:opacity-90 rounded-full">Join</Button>
        </div>
      </div>
    </header>
  )
}
