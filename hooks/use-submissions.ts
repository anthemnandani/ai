// hooks/use-submissions.ts
"use client";

import { useState, useEffect } from "react";
import { storageUtils, type Submission } from "@/lib/storage";
import { toast } from "sonner";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const initialSubmissions = await storageUtils.getSubmissions();
        console.log("Submissions set in hook:", JSON.stringify(initialSubmissions, null, 2));
        setSubmissions(initialSubmissions);
        setError(null);
      } catch (error) {
        const message = "Could not load submissions. Please try again.";
        console.error("Error fetching initial submissions:", error);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return { submissions, loading, error };
}