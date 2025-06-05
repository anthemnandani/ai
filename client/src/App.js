import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import ChallengePage from "./pages/ChallengePage"
import SubmitPage from "./pages/SubmitPage"
import GalleryPage from "./pages/GalleryPage"
import SubmissionDetailPage from "./pages/SubmissionDetailPage"
import LeaderboardPage from "./pages/LeaderboardPage"
import ProfilePage from "./pages/ProfilePage"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/submission/:id" element={<SubmissionDetailPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile/:email" element={<ProfilePage />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
