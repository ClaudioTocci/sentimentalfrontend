import { useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("https://YOUR-BACKEND-URL/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const sentimentColor = {
    positive: "#4CAF50",
    neutral: "#FFC107",
    negative: "#F44336"
  };

  return (
    <div className="container">
      <h1>Sentiment Analyzer</h1>

      <textarea
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze} disabled={loading || !text}>
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </button>

      {result && (
        <div className="result-card" style={{ borderColor: sentimentColor[result.sentiment] }}>
          <h2 style={{ color: sentimentColor[result.sentiment] }}>
            {result.sentiment.toUpperCase()}
          </h2>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
