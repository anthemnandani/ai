import { Calendar, Target, CheckCircle } from "lucide-react"

const ProblemStatement = ({ problem }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="card card-gradient" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: "rgba(216, 180, 254, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9333ea",
          }}
        >
          <Target size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937" }}>{problem.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>
            <Calendar size={16} />
            <span>{formatDate(problem.date)}</span>
          </div>
        </div>
      </div>

      <p style={{ color: "#374151", marginBottom: "1.5rem", lineHeight: "1.6" }}>{problem.description}</p>

      <div>
        <h3
          style={{
            fontWeight: "500",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <CheckCircle size={20} style={{ color: "#9333ea" }} />
          <span>Requirements:</span>
        </h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {problem.requirements.map((req, index) => (
            <li key={index} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ color: "#9333ea", fontWeight: "500", marginTop: "0.25rem" }}>•</span>
              <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProblemStatement
