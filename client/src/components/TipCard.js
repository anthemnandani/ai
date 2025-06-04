import { Lightbulb } from "lucide-react"

const TipCard = ({ title, tips }) => {
  return (
    <div className="card" style={{ padding: "1.5rem", background: "#f5f0ff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            background: "rgba(216, 180, 254, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9333ea",
          }}
        >
          <Lightbulb size={20} />
        </div>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>{title}</h3>
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tips.map((tip, index) => (
          <li key={index} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ color: "#9333ea", fontWeight: "500" }}>•</span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TipCard
