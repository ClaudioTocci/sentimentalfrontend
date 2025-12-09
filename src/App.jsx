import { useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const lexicon = {
    love: 3,
    like: 2,
    happy: 3,
    great: 3,
    good: 2,
    nice: 2,
    excellent: 4,
    amazing: 4,
    awesome: 4,
    fantastic: 4,
    wonderful: 4,
    cool: 2,

    bad: -2,
    horrible: -4,
    terrible: -4,
    awful: -4,
    hate: -4,
    angry: -3,
    sad: -2,
    worst: -4,

    "😊": 3,
    "😍": 4,
    "😁": 3,
    "👍": 2,

    "😡": -4,
    "😠": -4,
    "😞": -3,
    "👎": -2
  };

  const boosters = {
    really: 1.5,
    very: 1.3,
    extremely: 2,
    super: 1.8
  };

  const negations = [
    "not", "never", "no", "none",
    "isn't", "wasn't", "don't",
    "didn't", "can't", "won't"
  ];

  const sentimentEmoji = {
    positive: "😊",
    neutral: "😐",
    negative: "😡",
    error: "⚠️"
  };

  const analyzeSentiment = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    let total = 0;
    let count = 0;

    for (let i = 0; i < words.length; i++) {
      let word = words[i].replace(/[.,!?]/g, "");

      if (lexicon[word] !== undefined) {
        let score = lexicon[word];

        if (i > 0 && boosters[words[i - 1]]) {
          score *= boosters[words[i - 1]];
        }

        if (i > 0 && negations.includes(words[i - 1])) {
          score *= -1;
        }

        total += score;
        count++;
      }
    }

    if (count === 0) return { sentiment: "neutral", confidence: 0.5 };

    const avg = total / count;

    if (avg > 1) return { sentiment: "positive", confidence: Math.min(avg / 4, 1) };
    if (avg < -1) return { sentiment: "negative", confidence: Math.min(Math.abs(avg) / 4, 1) };
    return { sentiment: "neutral", confidence: 0.5 };
  };

  const analyze = () => {
    setLoading(true);
    setTimeout(() => {
      const output = analyzeSentiment(text);
      setResult(output);
      setLoading(false);
    }, 300);
  };

  const sentimentColor = {
    positive: "#4CAF50",
    neutral: "#FFC107",
    negative: "#F44336",
    error: "#000000",
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
        <div
          className="result-card"
          style={{ borderColor: sentimentColor[result.sentiment] }}
        >
          <h2 style={{ color: sentimentColor[result.sentiment] }}>
            {sentimentEmoji[result.sentiment]} {result.sentiment.toUpperCase()}
          </h2>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}
