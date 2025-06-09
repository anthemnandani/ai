// Local storage utilities for data persistence
export interface Submission {
  id: string
  name: string
  email: string
  designTitle: string
  description: string
  imageUrl: string
  problemId: string
  problemTitle: string
  submittedAt: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  requirements: string[]
  date: string
  brandName: string
}

const STORAGE_KEYS = {
  SUBMISSIONS: "ai_design_submissions",
  CHALLENGES: "ai_design_challenges",
  USER_HISTORY: "user_submission_history",
}

// Real-time event system using localStorage events
export class RealtimeStorage {
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    // Listen for storage changes from other tabs
    window.addEventListener("storage", (e) => {
      if (e.key && this.listeners.has(e.key)) {
        const callbacks = this.listeners.get(e.key) || []
        callbacks.forEach((callback) => callback(e.newValue))
      }
    })
  }

  subscribe(key: string, callback: Function) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }
    this.listeners.get(key)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data))
    // Trigger event for current tab
    const callbacks = this.listeners.get(key) || []
    callbacks.forEach((callback) => callback(JSON.stringify(data)))
  }
}

export const realtimeStorage = new RealtimeStorage()

export const storageUtils = {
getSubmissions: async (): Promise<Submission[]> => {
  try {
    const res = await fetch("/api/submissions"); // <-- adjust URL to match your backend route
    if (!res.ok) throw new Error("Failed to fetch submissions");
    const mongoSubmissions = await res.json();

    // Convert MongoDB format to expected format
    return mongoSubmissions.map((item: any) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      designTitle: item.designTitle,
      description: item.description,
      imageUrl: item.imageUrl,
      problemId: item.problemId,
      problemTitle: item.problemTitle,
      submittedAt: item.createdAt,
    }));
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return [];
  }
},

  addSubmission(submission: Omit<Submission, "id" | "submittedAt">): Submission {
    const submissions = this.getSubmissions()
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
    }

    submissions.unshift(newSubmission)
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions))

    // Emit real-time event
    realtimeStorage.emit("new_submission", newSubmission)

    return newSubmission
  },

  // Challenges
  getChallenges(): Challenge[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES)
    return data ? JSON.parse(data) : []
  },

  getTodaysChallenge(): Challenge {
    const challenges = this.getChallenges()
    const today = new Date().toISOString().split("T")[0]

    let todaysChallenge = challenges.find((c) => c.date === today)

    if (!todaysChallenge) {
      // Create default challenge for today
      todaysChallenge = {
        id: "default-" + today,
        title: "AI-Powered Brand Identity Design",
        description:
          "Create a modern, innovative brand identity using AI tools. Design a logo, color palette, and visual elements that represent a forward-thinking tech company focused on sustainability and innovation.",
        requirements: [
          "Design a unique logo using AI image generation",
          "Create a cohesive color palette (3-5 colors)",
          "Include typography recommendations",
          "Show the logo in different contexts (business card, website header, etc.)",
          "Explain your AI prompts and design decisions",
        ],
        date: today,
        brandName: "EcoTech Solutions",
      }

      challenges.push(todaysChallenge)
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges))
    }

    return todaysChallenge
  },

  // User submission history
  getUserHistory(): Record<string, boolean> {
    const data = localStorage.getItem(STORAGE_KEYS.USER_HISTORY)
    return data ? JSON.parse(data) : {}
  },

  markUserSubmitted(date: string) {
    const history = this.getUserHistory()
    history[date] = true
    localStorage.setItem(STORAGE_KEYS.USER_HISTORY, JSON.stringify(history))
  },

  hasUserSubmittedToday(): boolean {
    const today = new Date().toISOString().split("T")[0]
    const history = this.getUserHistory()
    return history[today] === true
  },

  // File handling
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
}
